import { Worker } from "bullmq";
import { connection } from "../../database/redis/conn";
import { EmailQueue } from "../queues/email.queue";
import { NodemailerMailGateway } from "../../gateway/nodemailer-mail.gateway";
import { EmailJobProcessor } from "../processors/email.processor";
import { pinoLogger } from "../../loggers/pino.logger";

export function emailWorker(message: string): Worker {
    // Gateways
    const mailGateway = new NodemailerMailGateway();

    // Processor
    const processor = new EmailJobProcessor(mailGateway);

    // Worker
    const worker = new Worker(
        EmailQueue.queueName,
        processor.process,
        { connection, concurrency: 5 }
    );

    if (worker)
        console.log(message);

    // Listeners
    worker.on('completed', job => {
        pinoLogger.info(`[✅ Job] #${job.id} ok`);
    });
    worker.on('failed', (job, err) => {
        pinoLogger.warn({ error: err.message }, `[❌ Job] #${job?.id} falhou`);
    });

    return worker;
}