import WishlistController from "../controller/wishlistController.js";
import express from 'express';

const router = express.Router()

router.get('/getWishlist/:user_id', WishlistController.fetchWishlist);
router.post('/addWishlist', WishlistController.addWishlist);
router.delete('/removeItemsFromWishlist/:wishlist_item_id', WishlistController.removeItemFromWishlist);
router.delete('/clearWishlist/:wishlist_id', WishlistController.clearWishlist);

export default router;