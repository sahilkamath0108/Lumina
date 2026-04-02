import CartController from "../controller/cartController.js";
import express from 'express';

const router = express.Router()

router.get('/getCart/:user_id', CartController.fetchCart);
router.post('/addCart', CartController.addNewCart);
router.put('/updateCartItem', CartController.updateCartItemQuantity);
router.delete('/removeCartItem/:cart_item_id', CartController.removeItemFromCart);
router.delete('/clearCart/:cart_id', CartController.clearCart);

export default router;