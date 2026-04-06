import { fetchWithAuth } from './fetchWithAuth';

export async function fetchCart(user_id: string) {
    try {
        // console.log("Fetching cart for user_id: ", user_id)
        const response = await fetchWithAuth(`/cart/getCart/${user_id}`, {
            method: 'GET'
        });
        console.log("Fetched cart items ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function addCart(user_id: string, product_id: string, quantity: number, price: number) {
    try {
        const response = await fetchWithAuth(`/cart/addCart`, {
            method: 'POST',
            data: { userID: user_id, productID: product_id, quantity: quantity, cost: price }
        });
        console.log("Added cart item ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function removeItemFromCart(cart_item_id: string) {
    try {
        const response = await fetchWithAuth(`/cart/removeCartItem/${cart_item_id}`, {
            method: 'DELETE'
        });
        console.log("Removed cart item ", response)
        return response
    } catch (error) {
        console.error(error)
    }   
}

export async function clearCart(cart_id: string) {
    try {
        const response = await fetchWithAuth(`/cart/clearCart/${cart_id}`, {
            method: 'DELETE'
        });
        console.log("Cleared cart ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function updateCartItem(cart_item_id: string, quantity: number) {
    try {
        // console.log("Updating cart item ", cart_item_id, quantity)
        const response = await fetchWithAuth(`/cart/updateCartItem`, {
            method: 'PUT',
            data: { itemID: cart_item_id, quantity: quantity }
        });
        console.log("Updated cart item ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}
