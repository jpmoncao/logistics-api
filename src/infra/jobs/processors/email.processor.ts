import { Job } from "bullmq";
import { MailGateway, MailBody, MailTo } from "../../../application/gateways/mail.gateway";
import { pinoLogger } from "../../loggers/pino.logger";

interface EmailJobData {
    to: MailTo[];
    subject: string;
    body: MailBody;
}

export class EmailJobProcessor {
    constructor(private mailGateway: MailGateway) { }

    public process = async (job: Job<EmailJobData>) => {
        pinoLogger.info(`[⏩ Processor] Processando job #${job.id}`);
        const { to, subject, body } = job.data;

        await this.mailGateway.sendMail(to, subject, body);
    }
}