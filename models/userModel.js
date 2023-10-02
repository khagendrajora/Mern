//npm install uuidv1

const mongoose = require('mongoose')

const crypto = require('crypto')
//for hashing password i.e encrypt/decrypt
const uuidv1 = require('uuidv1')
// random string generator

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 0
    },
    hashed_password: {
        type: String,
        required: true,

    },
    salt: String,
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

//virtual fields  creates a virtual field in userSchema that is not stored directly in database.
//this field is used for password defining. this field allows getting and
// setting the password value,while internally encrypted and storing its as hashed_password using the encryptedPassword method
//here the "password" value is comming from the body part password of user at userController.
userSchema.virtual('password')
    .set(function (password) {   //assigns the value of password in that obtained virtual field password in userSchema.
        this._password = password   //It assigns the value of "password" parameter to a non persistent field name '_password',  used to store the actual plain text password temporarily. 
        this.salt = uuidv1()  //generates a unique salt value and assigns it to the salt field, as salt is a random value use in password hashing to add an extra layer of security.
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password    //returns the plain text of the password.
    })

//defining the method
userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return err
        }
    },
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    }
}

module.exports = mongoose.model('User', userSchema)


//mailtrap
//nodemailer