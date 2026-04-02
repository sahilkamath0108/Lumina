import OrdersRepo from "../repositories/ordersRepo.js";
import CartsRepo from "../repositories/cartRepo.js";
import ProductRepo from "../repositories/productRepo.js";
import kProducers from "../kafka/kproducerAPI.js";

class OrdersService {
    static async fetchOrder(userID) {
        const order = await OrdersRepo.fetchOrder(userID)
        return order
    }

    static async fetchOrderItems(userID) {
        let orderID = await OrdersRepo.fetchOrder(userID)
        orderID = orderID?.order_id
        console.log("Fetched orderID: ", orderID)
        if (orderID) {
            let orderItems = await OrdersRepo.fetchOrderItems(orderID)
            console.log("Order items before fetching product details: ", orderItems)
            orderItems = await Promise.all(
                orderItems.map(async (item) => {
                    const productDetails = await ProductRepo.fetchProduct(item.product_id);
                    // console.log("Product details are ", productDetails)
                    const { product_id, title, image } = productDetails[0];
                    console.log("Product details fetched are ", product_id, title, image)
                    return {
                        order_id: orderID,
                        order_item_id: item.order_item_id,
                        quantity: item.quantity, cost: item.cost,
                        product_id, title, image
                    };
                })
            );

            // await CartsRepo.clearCart(data.cart_id)
            console.log("Fetched order items are ", orderItems);
            return orderItems
        }
        else {
            console.log("Could not fetch order items :(")
            return []
        }
    }

    static async addNewOrder(data, userID, email) {
        const newOrder = await OrdersRepo.addNewOrder(data)
        const orderID = newOrder?.order_id
        const cartItems = await CartsRepo.fetchCartItems(data.cart_id)
        console.log("Cart items to add in order are ", cartItems)
        const orderItems = [];
        for (const item of cartItems) {
            console.log("Adding this item to order ", item);
            const res = await OrdersRepo.addOrderItems(orderID, item.product_id, item.quantity, item.cost);
            orderItems.push(res);
        }

        const updatedItems = await Promise.all(
            cartItems.map(async item => {
                const { title } = (await ProductRepo.fetchProduct(item.product_id))[0];
                return { ...item, title };
            })
        );

        await kProducers.addUserPurchase({
            userID,
            orderID,
            email,
            purchases: updatedItems.map(ci => ({ productID: ci.product_id, quantity: ci.quantity, title: ci.title }))
        })

        return orderItems
    }
}

export default OrdersService