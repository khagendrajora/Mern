const express = require('express')
const { postProducts, productList, productDetails, updateProduct, deleteProduct } = require('../controllers/productController')

const router = express.Router()
const upload = require('../middleware/fileUpload')
const { productValidation , validation} =require('../validation/validation')
const { requireAdmin } = require('../controllers/userController')

router.post('/postProduct',requireAdmin, upload.single('product_image'),productValidation,validation, postProducts)
//here first checks the image as single/multiple with its key, then post the product

router.get('/productlist', productList)
router.get('/productdetails/:id', productDetails)
router.put('/updateproduct/:id',requireAdmin, upload.single('product_image'), updateProduct)
router.delete('/deleteproduct', requireAdmin, deleteProduct)


module.exports = router