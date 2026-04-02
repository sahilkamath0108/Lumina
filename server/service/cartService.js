import CartRepo from "../repositories/cartRepo.js";
import ProductRepo from "../repositories/productRepo.js";

class CartService {
    static async fetchCart(userID){
        let cartID = await CartRepo.fetchCart(userID)
        cartID = cartID?.cart_id
        console.log("Fetched cartID: ", cartID)
        if(cartID){
            let cartItems = await CartRepo.fetchCartItems(cartID)
            console.log("Cart items before fetching product details: ", cartItems)
            cartItems = await Promise.all(
                cartItems.map(async (item) => {
                    const productDetails = await ProductRepo.fetchProduct(item.product_id);
                    console.log("Product details are ", productDetails)
                    const { product_id, title, image } = productDetails[0];
                    // console.log("Image is ", image)
                    return {
                        cart_id: cartID,
                        cart_item_id: item.cart_item_id,
                        quantity: item.quantity, cost: item.cost,
                        product_id, title, image
                    };
                })
            );

            console.log("Fetched cart items are ", cartItems);
            return cartItems
        }
        else{
            console.log("Could not fetch cart items :(")
            return []
        }
    }

    static async addNewCart(data){
        const { userID, productID, quantity, cost } = data
        console.log("Adding to cart for userID: ", userID, " productID: ", productID, " quantity: ", quantity)
        let cartID = await CartRepo.fetchCart(userID)
        cartID = cartID?.cart_id
        console.log("Fetched cartID: ", cartID)
        let cartItem = null
        if(cartID){
            console.log("Cart already exists for user ", userID, " with cartID ", cartID)
            console.log("Adding new item in ", cartID, " with productID ", productID, " quantity ", quantity, " cost ", cost)
            cartItem = await CartRepo.addItemToCart(cartID, productID, quantity, cost)
            console.log("Inserted item ", cartItem, " in already existing cart ", cartID)
        }
        else{
            console.log("Cart does not exist for user ", userID, ". Creating a new cart.")
            const newCart = await CartRepo.addNewCart(userID)
            cartID = newCart?.cart_id
            console.log("Adding new item in ", cartID, " with productID ", productID, " quantity ", quantity, " cost ", cost)
            cartItem = await CartRepo.addItemToCart(cartID, productID, quantity, cost)
            console.log("Inserted item ", cartItem, " in newly created cart ", cartID)
        }
        return cartItem
    }

    static async updateCartItemQuantity(data){
        const itemID = data.itemID
        const newQuantity = data.quantity
        const item = await CartRepo.updateCartItemQuantity(itemID, newQuantity)
        return item
    }

    static async removeItemFromCart(itemID){
        const item = await CartRepo.removeItemFromCart(itemID)
        return item
    }

    static async clearCart(cartID){
        if (cartID) {
            const cart = await CartRepo.clearCart(cartID)
            const items = await CartRepo.clearCartItems(cartID)
            return cart
        }
        else {
            console.log("Could not find cart to clear :(")
        }
    }
}

export default CartService;