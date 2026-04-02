import supabase from "../supabase/configure.js";

class CartRepo {
    static fetchCart = async (userID) => {
        console.log("Fetching cart for userID: ", userID)
        const { data, error } = await supabase
            .from('carts')
            .select('cart_id')
            .eq('user_id', userID)
            .maybeSingle()
        if (error) {
            console.log("Failed to fetch the cart ", error)
        }
        // console.log("Fetched cart data: ", data)
        return data || null
    }

    static async fetchCartItems(cartID) {
        const { data, error } = await supabase.from('cart_items')
            .select()
            .eq('cart_id', cartID)
        if (error) {
            console.log("Failed to fetch the cart items ", error)
        }
        return data
    }

    static addNewCart = async (userID) => {
        const { data, error } = await supabase
            .from('carts')
            .insert({ user_id: userID })
            .select('cart_id')
            .single()
        if (error) {
            console.log("Failed to add the cart ", error)
        }
        return data
    }

    static addItemToCart = async (cartID, productID, quantity, cost) => {
        const { data, error } = await supabase
            .from('cart_items')
            .insert({ cart_id: cartID, product_id: productID, quantity: quantity, cost: cost })
            .select('cart_item_id')
            .single()
        if (error) {
            console.log("Failed to add the item to the cart ", error)
        }
        return data
    }

    static updateCartItemQuantity = async (itemID, newQuantity) => {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('cart_item_id', itemID)
            .select()
        if (error) {
            console.log("Failed to update the item to the cart ", error)
        }

        return data
    }

    static removeItemFromCart = async (itemID) => {
        const { data, error } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_item_id', itemID)
            .select()
        if (error) {
            console.log("Failed to remove the element ", error)
        }
        return data
    }

    static clearCart = async (cartID) => {
        const { data, error } = await supabase
            .from('carts')
            .delete()
            .eq('cart_id', cartID)
            .select()
        if (error) {
            console.log("Failed to remove the cart ", error)
        }
        return data
    }

    static async clearCartItems(cartID) {
        const { data, error } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartID)
            .select()
        if (error) {
            console.log("Failed to remove the element ", error)
        }
        return data
    }
}

export default CartRepo;