export default {
    redis: {
        port: Number(process.env.REDIS_PORT) || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASS || ''
    }
}
