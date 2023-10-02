const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
const jwt = require('jsonwebtoken') //authentication
const { expressjwt } = require("express-jwt") //authorization


//post user

exports.postUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    //check if the email is already registered or not
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'email must mbe unique' })
            }
            else {
                user = await user.save()
                if (!user) {
                    return res.status(400).json({ error: 'something went wrong while creating your account' })
                }
                //send token to database
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id      //userid from model and user._id from above postUser.
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'Failed to create token' })
                }
                const url = process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
                //send Email
                sendEmail({
                    from: 'no-reply@ecommercestore.com',
                    to: user.email,
                    subject: 'Email verification Link',
                    text: `Hello \n please verify your email by click in the below link \n\n
                    http://${req.headers.host}/api/confirmation/${token.token}
                    `,
                    html: `
                    <h1>Verify Your Email<h1>
                    <a href = '${url}'>click to verify`
                })
                res.send(user)
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })

}

//email confirmation or verification
exports.postEmailConfirmation = (req, res) => {

    //at first find the valid or matching token
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'invalid token or token may have expired' })
            }
            //if we found found the valid token then find the valid user for that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: 'we are unable to find the valid user for this token' })
                    }
                    //check if the user is already verified or not 
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'email is already verified,login to continuee' })
                    }
                    // save the verified user
                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'failed to verify your email' })
                            }
                            else {
                                res.json({ message: 'congrats your email is verified' })
                            }
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                        })
                })
                .catch(err => {
                    return res.status(400).json({ error: err })
                })
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

//login process
exports.signIn = async (req, res) => {
    //destructing user
    const { email, password } = req.body
    //at first check if email is registered in th database or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ error: 'sorry the email you provided is not found in  your system' })
    }
    //if email fouund then check the matching password of that email
    if (!user.authenticate(password)) {     //here user ma password variable is passed and checked.
        return res.status(400).json({ error: 'email and password doesnot matched' })

    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: 'verify your email before login' })
    }
    // res.send(user)

    // now generate token using user id and jwt secret
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET)

    //store token in the cookie
    res.cookie('myCookie', token, { expire: Date.now() + 99999 })
    //return user info to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { _id, name, email, role } })
}

//forget password
exports.forgetPassword = async (req, res) => {

    //at first check if the email is in the system or not
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({ error: 'email you provided not found in our system' })
    }
    let token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if (!token) {
        return res.status(400).josn({ error: 'failed to create the token , process terminated' })
    }

    const url = process.env.FRONTEND_URL+'\/reset\/password\/'+token.token
    //sendEmail
    sendEmail({
        from: 'no-reply@ecommercestore.com',
        to: user.email,
        subject: 'Password Reset Link',
        text: `Hello \n please reset your password by click in the below link \n\n
        http://${req.headers.host}/api/conformation/${token.token}
        `,
        html:  `
        <h1>Reset Your password<h1>
        <a href = '${url}'>click to reset password </a>`
    })
    res.json({ message: 'password reset link has been sent to your email' })

}

//reset pasword

exports.resetPassword = async (req, res) => {
    // at first find the valid or matching token
    const token = await Token.findOne({ token: req.params.token })  // here params is used to access the parameter defined in url i.e /:id
    if (!token) {
        return res.status(404).json({ error: 'invalid token or token may have expired ' })
    }

    //if token found then find the valid user for that token
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(404).json({ error: 'we are unable to find the valid user for this token' })
    }
    // new password set and save
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(500).josn({ error: 'failed to reset password' })
    }
    res.json({ message: 'password has been reset successfully' })
}

//user list
exports.userList = async (req, res) => {
    const user = await User.find()
        .select('-hashed_Password')
        .select('-salt')
    if (!user) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(user)
}

//user details
exports.userDetails = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-hashed_Password')
        .select('-salt')
    if (!user) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(user)
}

//admin middleware

exports.requireAdmin = (req, res, next) => {
    //verify jwt
    // this is fixed algorithm copied from express-jwt
    expressjwt({
        secret: process.env.JWT_SECRET,    //represents jwt secret key used for verifying the tokens signature
        algorithms: ["HS256"],  // specified the allowed algo for JWt
        userProperty: 'auth'
    })(req, res, (err) => {      // if there was error in verifiction process automatically err fun will be called
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        //check for user role
        if (req.auth.role === "1") {
            next()
        }
        else {
            return res.status(403).json({ error: 'you are not authorized to access this page' })
        }
    })
}

//signout

exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: "signout success" })
}

//user middleware

exports.requireUser = (req, res, next) => {
    //verify jwt
    // this is fixed algorithm copied from express-jwt
    expressjwt({
        secret: process.env.JWT_SECRET,    //represents jwt secret key used for verifying the tokens signature
        algorithms: ["HS256"],  // specified the allowed algo for JWt
        userProperty: 'auth'
    })(req, res, (err) => {      // if there was error in verifiction process automatically err fun will be called
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        //check for user role
        if (req.auth.role === "0") {
            next()
        }
        else {
            return res.status(403).json({ error: 'you are not authorized to access this page' })
        }
    })
}
