import kafkaClient from './config.js'
const producer = kafkaClient.producer()

// const kafkaProducer = async (kafkaClient) => {
//     const producer = kafkaClient.producer()

//     await producer.connect()
//     await producer.send({
//         topic: 'quickstart-events',
//         messages: [
//             { value: 'Hello KafkaJS user!' },
//         ],
//     })

//     await producer.disconnect()
// }

export default producer

