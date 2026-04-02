import kafkaClient from './config.js'

export const redisConsumer = kafkaClient.consumer({ groupId: 'redis-group' })

//test-group
// export const kafkaConsumer = async (kafkaClient) => {
//     const consumer = kafkaClient.consumer({ groupId: 'test-group', fromBeginning: true })

//     await consumer.connect()
//     await consumer.subscribe({ topic: 'lumina-user-events'})

//     await consumer.run({
//         autoCommitThreshold: 100,
//         eachMessage: async ({ topic, partition, message }) => {
//             console.log({
//                 value: message.value.toString(),
//                 // offset: message.offset,
//             })
//         }
//     })
   
// }

// export default redisConsumer 

// kafkaConsumer(kafkaClient);