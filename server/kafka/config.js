import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'lumina-server',
  brokers: ['kafka:9092'],
})

export default kafka;