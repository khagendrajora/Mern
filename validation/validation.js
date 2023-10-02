//install exprese-validator from website
const { check, validationResult } = require('express-validator')

exports.categoryValidation = [
    check('category_name', 'category is required').notEmpty()
        .isLength({ min: 3 }).withMessage('category name must be minum of 3 char or more')



]

exports.productValidation = [
    check('product_name', 'product is required').notEmpty()
        .isLength({ min: 3 }).withMessage('product name must be minum of 3 char or more'),

    check('product_price', 'price is required').notEmpty()
        .isNumeric().withMessage('price must be numeric value'),

    check('countInStock', 'stock is required').notEmpty()
        .isNumeric().withMessage('numberic value is required'),

    check('category', 'category is required').notEmpty(),
    check('product_description', 'description  is required').notEmpty()
        .isLength({ min: 20 }).withMessage('description must be 20 characters or more')

]

exports.userValidation =[
    check('name','name is required').notEmpty()
    .isLength({min:2}).withMessage('name must be minimum of 2 characters'),
    check('email','email is required').notEmpty()
    .isEmail().withMessage('Email format is invalid'),
    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain atleast one lowercase letter')
    .matches(/[A-Z]/).withMessage('password must contain atleast one uppercase letter')
    .matches(/[0-9]/).withMessage('password must contain atleast one number ')
    .matches(/[@#$-_?]/).withMessage('password must contain atleast one special character')
    .isLength({min:8}).withMessage('password must be atleast 8 characters')
]

exports.passwordValidation =[
    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain atleast one lowercase letter')
    .matches(/[A-Z]/).withMessage('password must contain atleast one uppercase letter')
    .matches(/[0-9]/).withMessage('password must contain atleast one number ')
    .matches(/[@#$-_?]$/).withMessage('password must contain atleast one special character')
    .isLength({min:8}).withMessage('password must be atleast 8 characters')
    
]


exports.validation = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    }
    else {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
}