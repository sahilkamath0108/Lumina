import { createClient } from 'redis';
import dotenv from 'dotenv'

dotenv.config()

const user = process.env.REDIS_USERNAME
const pass = process.env.REDIS_PASSWORD
const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT

// console.log("envs loaded in config: ", user, pass, host, port)

const client = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

export default client

