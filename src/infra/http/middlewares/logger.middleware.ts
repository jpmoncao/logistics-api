import pinoHttp from 'pino-http';
import { pinoLogger } from '../../loggers/pino.logger';
import { randomUUID } from 'node:crypto';

export const loggerMiddleware = pinoHttp({
    logger: pinoLogger,
    genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completed in ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed with status ${res.statusCode}`,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    },
    autoLogging: {
        ignore: (req) => req.url?.includes('/docs') || req.url === '/health',
    },
});