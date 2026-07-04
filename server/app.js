import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import redisRoutes from './routes/redisRoutes.js'
import kProducerRoutes from './routes/kProducerRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import userRoutes from './routes/userRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import ordersRoutes from './routes/ordersRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import { verifySupabaseJWT } from './middleware/authMiddleware.js'
import cors from 'cors'
import {
    register, http_request_total, http_response_rate_histogram, nodejs_memory, nodejs_cpu_usage
} from './prometheus/promClient.js';

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use((req, res, next) => {
    const req_url = new URL(req.url, `http://${req.headers.host}`);
    const endTimer = http_response_rate_histogram.startTimer();

    const memory_before = process.memoryUsage().rss;
    const cpu_before = process.cpuUsage();

    res.on('finish', () => {
        // Increment request counter
        http_request_total.inc({
            method: req.method,
            path: req_url.pathname,
            status_code: res.statusCode
        });

        // Observe histogram duration
        endTimer({
            method: req.method,
            path: req_url.pathname,
            status_code: res.statusCode
        });

        // Update gauges
        const memory_after = process.memoryUsage().rss;
        const cpu_after = process.cpuUsage();
        nodejs_memory.set(memory_after);
        const cpuPercent = ((cpu_after.user - cpu_before.user) + (cpu_after.system - cpu_before.system)) / 1000;
        nodejs_cpu_usage.set(cpuPercent);
    });

    next();
});

// app.use('/redis', redisRoutes);
// app.use('/kafka', kProducerRoutes);
app.use('/events', verifySupabaseJWT, eventRoutes);
app.use('/user', verifySupabaseJWT, userRoutes);
app.use('/wishlist', verifySupabaseJWT, wishlistRoutes);
app.use('/orders', verifySupabaseJWT, ordersRoutes);
app.use('/cart', verifySupabaseJWT, cartRoutes);

app.get("/metrics", async (req, res, next) => {
    res.setHeader("Content-type", register.contentType);
    res.send(await register.metrics());
    next();
});

app.get('/', (req, res) => {
    res.send("Lumina API — conference catalog, registrations, and analytics pipeline.")
});

app.get('/health', async (req, res) => {
    try {
        const redisClient = await import('./redis/config.js').then(module => module.default);
        await redisClient.ping();
        const supabase = await import('./supabase/configure.js').then(module => module.default);
        const { data, error } = await supabase.from('products').select();
        if (error) {
            throw error;
        }
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ status: 'unhealthy' });
    }
});

export default app