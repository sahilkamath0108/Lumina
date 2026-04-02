import OrdersService from "../service/orderService.js";

class OrdersController {
    static async fetchOrder(req, res){
        try {
            const userID = req.params.user_id
            const response = await OrdersService.fetchOrder(userID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async fetchOrderItems(req, res){
        try {
            const userID = req.params.user_id
            const response = await OrdersService.fetchOrderItems(userID)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addNewOrder(req, res){
        try {
            const userID = req.body.user_id
            const email = req.user.email
            const response = await OrdersService.addNewOrder(req.body, userID, email)
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default OrdersController;
