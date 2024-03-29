const express = require('express')
const { postCategory, allCategory, categoryDetails, deleteCategory, updateCategory } = require('../controllers/categoryController')
const router = express.Router()
const { categoryValidation, validation } = require('../validation/validation')
const {requireAdmin} = require('../controllers/userController')
router.post('/postcategory',requireAdmin, categoryValidation, validation, postCategory)    // first parameter is url and second parameter is function

router.get('/allcategory', allCategory)

router.get('/categorydetails/:id', categoryDetails)
router.delete('/deletecategory/:id',requireAdmin, deleteCategory)
router.put('/updatecategory/:id',requireAdmin, categoryValidation, validation, updateCategory)
module.exports = router