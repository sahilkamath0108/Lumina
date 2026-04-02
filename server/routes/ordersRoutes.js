import OrdersController from "../controller/ordersController.js";
import express from 'express';

const router = express.Router()

router.get('/getOrder/:user_id', OrdersController.fetchOrder);
router.get('/getOrderItems/:user_id', OrdersController.fetchOrderItems);
router.post('/addOrder', OrdersController.addNewOrder);

export default router;