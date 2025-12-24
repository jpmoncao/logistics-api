import { DomainEventHandler } from "../../core/events/handler";
import { EntregaConcluidaEvent } from "../../domain/events/entrega-concluida.event";
import { DestinatarioRepository } from "../../domain/repositories/destinatario.repository";
import { EmailJobName } from "../../infra/jobs/job-names";
import { pinoLogger } from "../../infra/loggers/pino.logger";
import { getEntregaConcluidaTemplate } from "../../infra/mail/templates/entrega-concluida.template";
import { JobQueue } from "../gateways/job-queue.gateway";
import { MailBody, MailTo } from "../gateways/mail.gateway";

export class EnviarEmailEntregaConcluidaHandler implements DomainEventHandler {
    constructor(private destinatarioRepository: DestinatarioRepository, private queue: JobQueue) { }

    public handle = async (event: EntregaConcluidaEvent) => {
        const destinatario = await this.destinatarioRepository.findById(event.payload.destinatarioId);
        if (!destinatario) {
            pinoLogger.warn(`[❌ Mailservice] Destinatário com ID ${event.payload.destinatarioId} não encontrado. Não foi possível enviar o email.`);
            return;
        }

        const to: MailTo[] = [{
            nome: destinatario.nome,
            email: destinatario.email
        }];

        const subject = 'Entrega Concluída';

        const body: MailBody = {
            html: getEntregaConcluidaTemplate({
                idEntrega: event.payload.entregaId,
                nomeDestinatario: destinatario.nome,
            }),
            textContent: `Olá, ${destinatario.nome}! Sua entrega referente ao código: ${event.payload.entregaId} foi entregue com sucesso! Esperamos que você aproveite sua encomenda.`
        };

        this.queue.add(EmailJobName.ENTREGA_CONCLUIDA, { to, subject, body });
    }
}