const express = require ('express')
const router = express.Router()
const {authenticateUser, authorizePermissions} = require ('../middleware/authentication')
const {createProduct,getAllProducts,getSingleProducts,updateProduct,deleteProduct,uploadImage} = require ('../contollers/productController')
// const { get } = require('mongoose')
// const { update } = require('../models/Product')
const {getSingleProductReviews} = require ('../contollers/reviewController')



router.route('/').post([authenticateUser,authorizePermissions('admin')],createProduct).get(getAllProducts)
router.route('/uploadImage').post([authenticateUser,authorizePermissions('admin')],uploadImage)
router.route('/:id').get(getSingleProducts).patch([authenticateUser,authorizePermissions('admin')],updateProduct).delete([authenticateUser,authorizePermissions('admin')],deleteProduct)
router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router