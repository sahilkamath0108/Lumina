import app from './app.js';
import redisClient from './redis/config.js'
import kafkaProducer from './kafka/producer.js'
import redisConsumerAPI from './redis/redisConsumer.js';
import supabase from './supabase/configure.js'

const port = process.env.EXPRESS_PORT || 5000;

(async () => {
    try {
        redisClient.on('error', err => console.log('Redis Client Error', err));
        await redisClient.connect();
        await redisClient.set('ping', 'pong');
        const result = await redisClient.get('ping');
        console.log("Connected to redis successfully: ", result);
        
        await kafkaProducer.connect()
        
        const { data, error } = await supabase.from('products').select();
        if(error){
            console.log("Failed to connect to supabase.")
        }
        console.log("Connected to supadb and fetched data ", data)

        redisConsumerAPI(redisClient)
        // await redisConsumer.connect()
        // await redisConsumer.subscribe({ topic: 'lumina-user-events'})
        
        const server = app.listen(port, () => {
            console.log(`Express server running on port ${port}`)
        });

        server.on("close", async () => {
            console.log('Express server closed.');
            await kafkaProducer.disconnect();
            await redisClient.quit();
            console.log('Kafka producer and Redis client disconnected.');
        })

    } catch (error) {
        console.error('Server failed to start:', error);
    }
})();