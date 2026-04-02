import supabase from "../supabase/configure.js";

class OrdersRepo {
    static fetchOrder = async (userID) => {
        const { data, error } = await supabase
            .from('orders')
            .select()
            .eq('user_id', userID)
            .single()
        if (error) {
            console.log("Failed to fetch the order ", error)
        }
        return data
    }

    static fetchOrderItems = async (orderID) => {
        const { data, error } = await supabase
            .from('order_items')
            .select()
            .eq('order_id', orderID)
        if (error) {
            console.log("Failed to fetch the order items ", error)
        }

        return data
    }

    static addNewOrder = async ({ user_id, cart_id, subtotal, tax, total }) => {
        const { data, error } = await supabase
            .from('orders')
            .insert({ user_id, cart_id, subtotal, tax, total })
            .select('order_id')
            .single()
        if (error) {
            console.log("Failed to add the order ", error)
        }

        return data
    }

    static addOrderItems = async (orderID, productID, quantity, cost) => {
        const { data, error } = await supabase
            .from('order_items')
            .insert({ order_id: orderID, product_id: productID, quantity, cost })
            .select()
        if (error) {
            console.log("Failed to add the order items ", error)
        }
        return data
    }
}

export default OrdersRepo;

