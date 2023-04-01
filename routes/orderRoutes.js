const express = require ('express')
const router = express.Router()
const {getAllOrders, getSingleOrder, getCurrentUserOrders,createOrder, updateOrder} = require ('../contollers/orderController')
const {authenticateUser,authorizePermissions} = require ('../middleware/authentication')



router.route('/').post(authenticateUser,createOrder).get(authenticateUser,authorizePermissions('admin'), getAllOrders)
router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser,updateOrder)
router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrders)


module.exports = router

