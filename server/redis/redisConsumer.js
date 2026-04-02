import { redisConsumer } from "../kafka/consumer.js";
// import redisClient from '../redis/config.js';

const redisConsumerAPI = async (redisClient) => {
    await redisConsumer.connect()
    await redisConsumer.subscribe({ topic: 'lumina-user-events' })

    await redisConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let event;
            try {
                event = JSON.parse(message.value.toString());
                
                console.log({
                    topic,
                    partition,
                    value: message.value.toString()
                })

                if (event.eventType === "views") {
                    await redisClient.xAdd(
                        `clicks:${event.email}`,
                        '*',
                        { productID: event.productID, ts: event.timestamp, title: event.title, userID: event.userID }
                    );
                    await redisClient.zIncrBy("leaderboard:views", 1, event.title);
                    await redisClient.zIncrBy("perUser:views", 1, event.email);
                }
                else if (event.eventType === "wishlist") {
                    await redisClient.zAdd(
                        `wishlist:${event.email}`,
                        [{ score: Date.parse(event.timestamp) , value: event.title }]
                    );
                    await redisClient.zIncrBy("leaderboard:wishlist", 1, event.title);
                    await redisClient.zIncrBy("perUser:wishlist", 1, event.email);
                }
                else if (event.eventType === "purchase") {
                    await redisClient.hSet(
                        `purchase:${event.orderID}`,
                        { productID: event.productID, ts: event.timestamp, title: event.title, userID: event.userID, email: event.email }
                    );
                    await redisClient.sAdd(`orders:${event.email}`, event.orderID);
                    await redisClient.zIncrBy("leaderboard:purchase", 1, event.title);
                    await redisClient.zIncrBy("perUser:purchases", 1, event.email);
                }
            } catch (err) {
                console.log("Failed to process Kafka message:", err);
                return;
            }

            console.log("Processed Kafka message:", event);
        }
    })
}

export default redisConsumerAPI;