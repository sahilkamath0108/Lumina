import CartService from "../service/cartService.js";

class CartController {
    static async fetchCart(req, res){
        try {
            const userID = req.params.user_id
            // console.log("Fetching controller cart for userID: ", userID)
            const response = await CartService.fetchCart(userID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addNewCart(req, res){
        try {
            console.log("Request Body: ", req.body);
            const response = await CartService.addNewCart(req.body)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateCartItemQuantity(req, res){
        try {
            console.log("Request Body: ", req.body);
            const response = await CartService.updateCartItemQuantity(req.body)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeItemFromCart(req, res){
        try {
            const itemID = req.params.cart_item_id
            const response = await CartService.removeItemFromCart(itemID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async clearCart(req, res){
        try {
            const cartID = req.params.cart_id
            const response = await CartService.clearCart(cartID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default CartController;