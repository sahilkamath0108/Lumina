import { fetchWithAuth } from './fetchWithAuth';

export async function fetchOrder(user_id: string){
    try{
        const response = await fetchWithAuth(`/orders/getOrder/${user_id}`, {
            method: 'GET'
        });
        console.log("Fetched order ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function fetchOrderItems(user_id: string) {
    try {
        // console.log("Fetching order for user_id: ", user_id)
        const response = await fetchWithAuth(`/orders/getOrderItems/${user_id}`, {
            method: 'GET'
        });
        console.log("Fetched order items ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export async function addOrder(user_id: string, cart_id: string, subtotal: number, tax: number, total: number) {
    try {
        const response = await fetchWithAuth(`/orders/addOrder`, {
            method: 'POST',
            data: { user_id, cart_id, subtotal, tax, total }
        });
        console.log("Added order item ", response)
        return response
    } catch (error) {
        console.error(error)
    }
}