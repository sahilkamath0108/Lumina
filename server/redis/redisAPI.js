import redisClient from './config.js'

class seedRedis {
    static async sendProductData(req, res) {
        console.log("This is the product ", req.body)
        const { productID, ...prodStats } = req.body
        const product = await redisClient.hSet(`product:${productID}`, prodStats)
        res.status(201).send('Product data created!', product);
    }

    static async addUserWishlist(req, res) {
        console.log("This is the wishlist ", req.body)
        const userID = req.body.userID
        const items = req.body.wishlist
        // console.log(typeof items)
        // console.log("User and his items: ", userID, items)
        for (let i = 0; i < items.length; i++){
            const item = await redisClient.sAdd(`wishlist:${userID}`, items[i])
            // console.log("Item added to the wishlist: ", item)
        }
        res.status(201).send('Wishlist created!');
    }

    static async addUserClicks(req, res) {
        console.log("These are the user clicks ", req.body)
        const userID = req.body.userID
        const items = req.body.clicks
        for (let i = 0; i < items.length; i++){
            await redisClient.rPush(`clicks:${userID}`, items[i])
        }
        res.status(201).send('User clicks created!');
    }

    static async addUserPurchase(req, res) {
        console.log("These are the user wishlists ", req.body)
        const userID = req.body.userID
        const items = req.body.wishlist
        for (let i = 0; i < items.length; i++){
            await redisClient.rPush(`purchases:${userID}`, items[i])
        }
        res.status(201).send('User purchases created!');
    }

    static async addMultiUserWishlist(req, res) {
        console.log("These are the user wishlists ", req.body)
        const users = req.body
        for (let j = 0; j < users.length; j++){
            const userID = users[j].userID
            const items = users[j].wishlist
            // console.log("user and his items are: ", userID, items)
            for (let i = 0; i < items.length; i++){
                await redisClient.sAdd(`wishlist:${userID}`, items[i])
            }
        }
        res.status(201).send('User wishlist created!');
    }

    static async addMultiUserClicks(req, res) {
        console.log("These are the user clicks ", req.body)
        const users = req.body
        for (let j = 0; j < users.length; j++){
            const userID = users[j].userID
            const items = users[j].clicks
            // console.log("user and his items are: ", userID, items)
            for (let i = 0; i < items.length; i++){
                await redisClient.rPush(`clicks:${userID}`, items[i])
            }
        }
        res.status(201).send('User clicks created!');
    }

    static async addMultiUserPurchase(req, res) {
        console.log("These are the user purchase ", req.body)
        const users = req.body
        for (let j = 0; j < users.length; j++){
            const userID = users[j].userID
            const items = users[j].purchases
            for (let i = 0; i < items.length; i++){
                await redisClient.rPush(`purchases:${userID}`, items[i])
            }
        }
        res.status(201).send('User purchases created!');
    }
}

export default seedRedis;


