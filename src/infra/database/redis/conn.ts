import IORedis from 'ioredis';
import { pinoLogger } from '../../loggers/pino.logger';

export const redisConn = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
});

redisConn.on('error', (err) => pinoLogger.error({ err }, 'Redis Error'));