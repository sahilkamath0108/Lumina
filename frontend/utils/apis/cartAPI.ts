import { fetchWithAuth } from './fetchWithAuth';

export async function fetchCart(user_id: string) {
    try {
        const response = await fetchWithAuth(`/cart/getCart/${user_id}`, {
            method: 'GET'
        });
        return response
    } catch (error) {
        throw error;
    }
}

export async function addCart(user_id: string, product_id: string, quantity: number, price: number) {
    try {
        const response = await fetchWithAuth(`/cart/addCart`, {
            method: 'POST',
            data: { userID: user_id, productID: product_id, quantity: quantity, cost: price }
        });
        return response
    } catch (error) {
        throw error;
    }
}

export async function removeItemFromCart(cart_item_id: string) {
    try {
        const response = await fetchWithAuth(`/cart/removeCartItem/${cart_item_id}`, {
            method: 'DELETE'
        });
        return response
    } catch (error) {
        throw error;
    }   
}

export async function clearCart(cart_id: string) {
    try {
        const response = await fetchWithAuth(`/cart/clearCart/${cart_id}`, {
            method: 'DELETE'
        });
        return response
    } catch (error) {
        throw error;
    }
}

export async function updateCartItem(cart_item_id: string, quantity: number) {
    try {
        const response = await fetchWithAuth(`/cart/updateCartItem`, {
            method: 'PUT',
            data: { itemID: cart_item_id, quantity: quantity }
        });
        return response
    } catch (error) {
        throw error;
    }
}
