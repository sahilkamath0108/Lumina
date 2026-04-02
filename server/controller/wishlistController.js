import WishlistService from "../service/wishlistService.js";

class WishlistController {
    static async fetchWishlist(req, res){
        try {
            const userID = req.params.user_id
            const response = await WishlistService.fetchWishlist(userID)
            // console.log("Response from service is ", response)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addWishlist(req, res){
        try {
            console.log("Request received as ", req.body)
            const email = req.user.email
            const response = await WishlistService.addWishlist( req.body, email)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeItemFromWishlist(req, res){
        try {
            const itemID = req.params.wishlist_item_id
            const response = await WishlistService.removeItemFromWishlist(itemID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async clearWishlist(req, res){
        try {
            const wishlistID = req.params.wishlist_id
            const response = await WishlistService.clearWishlist(wishlistID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default WishlistController;