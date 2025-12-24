import pino from 'pino';

export const pinoLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                    messageFormat: '{msg} \x1b[37m({req.method} {req.url})\x1b[0m'
                }
            },
            {
                target: 'pino/file',
                options: {
                    destination: './logs/app.log',
                    mkdir: true
                }
            }
        ]
    },
});