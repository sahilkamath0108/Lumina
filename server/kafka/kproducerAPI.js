import producer from './producer.js'

class kProducers {
    static addUserWishlist = async (data) => {
        const msg = data
        try {
            await producer.send({
                topic: 'lumina-user-events',
                messages: [
                    {
                        key: msg.userID,
                        value: JSON.stringify(
                            {
                                eventType: "wishlist",
                                userID: msg.userID,
                                productID: msg.productID,
                                title: msg.title,
                                email: msg.email,
                                timestamp: new Date().toISOString()
                            }
                        ),
                        timeStamp: Date.now()
                    }
                ],
            })
        } catch (error) {
            console.error("Error sending user wishlist event :(", error)
        }

        console.log("Produced wishlist event to kafka:", msg.userID, msg.productID, msg.title);
    }

    static addUserClicks = async (data) => {
        // console.log("Request payload:", data.body);
        const msg = data
        // console.log("Producing user click event to kafka:", msg.userID, msg.productID, msg.title);

        try {
            await producer.send({
                topic: 'lumina-user-events',
                messages: [
                    {
                        key: msg.userID,
                        value: JSON.stringify(
                            {
                                eventType: "views",
                                userID: msg.userID,
                                productID: msg.productID,
                                title: msg.title,
                                email: msg.email,
                                timestamp: new Date().toISOString()
                            }
                        ),
                        timeStamp: Date.now()
                    }
                ],
            })
        } catch (error) {
            console.error("Error sending user click event :(", error)
        }

        console.log("Produced click event to kafka:", msg.userID, msg.productID, msg.title);
    }

    static addUserPurchase = async (data) => {
        const msg = data
        try {
            await producer.send({
                topic: 'lumina-user-events',
                messages: msg.purchases.map(p => ({
                    key: msg.userID,
                    value: JSON.stringify(
                        {
                            eventType: "purchase",
                            userID: msg.userID,
                            email: msg.email,
                            orderID: msg.orderID,
                            productID: p.productID,
                            quantity: p.quantity,
                            title: p.title,
                            timestamp: new Date().toISOString()
                        }
                    ),
                    timeStamp: Date.now()
                }
                ))
            })
        } catch (error) {
            console.error("Error sending user purchase event :(", error)
        }

        console.log("Produced purchase event to kafka:", msg.userID, msg.orderID, msg.purchases.length);
    }
}

export default kProducers;