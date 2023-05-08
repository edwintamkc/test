import express from 'express'
import orderController from '../controllers/orderController'

const router = express.Router()

// place order
router.post('/orders', orderController.placeOrderController)

// take order
router.patch('/orders/:id', orderController.takeOrderController)

// get order list
router.get('/orders', orderController.getOrderListController)

export default router