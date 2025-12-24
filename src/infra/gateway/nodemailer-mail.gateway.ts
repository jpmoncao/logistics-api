import nodemailer from 'nodemailer';

import { MailGateway, MailTo, MailBody } from "../../application/gateways/mail.gateway";
import { pinoLogger } from '../loggers/pino.logger';

export class NodemailerMailGateway implements MailGateway {
    private DEV_MODE = process.env.NODE_ENV !== 'production';
    private transporter: nodemailer.Transporter;

    constructor() {
        if (this.DEV_MODE) {
            nodemailer.createTestAccount().then(testAccount => {
                this.transporter = nodemailer.createTransport({
                    host: testAccount.smtp.host,
                    port: testAccount.smtp.port,
                    secure: testAccount.smtp.secure,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                });
            });

            return;
        }

        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
    }

    async sendMail(to: MailTo[], subject: string, body: MailBody): Promise<void> {
        const recipients = to
            .map(contact => `"${contact.nome}" <${contact.email}>`)
            .join(',');

        const message = await this.transporter.sendMail({
            from: '"Logistics App 🚚" <noreply@logistics.com>',
            to: recipients,
            subject: subject,
            html: body.html,
            text: body.textContent
        });

        if (this.DEV_MODE) {
            pinoLogger.info(`[📧 Mailservice] URL: ${nodemailer.getTestMessageUrl(message)}`);
            return message!;
        }

        pinoLogger.info(`[📧 Mailservice] Mensagem enviada: ${message.messageId}`);
        return message!;
    }
}