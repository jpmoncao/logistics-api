import { DomainEventHandler } from "../../core/events/handler";
import { EntregaDespachadaEvent } from "../../domain/events/entrega-despachada.event";
import { DestinatarioRepository } from "../../domain/repositories/destinatario.repository";
import { getEntregaDespachadaTemplate } from "../../infra/mail/templates/entrega-despachada.template";
import { MailBody, MailTo } from "../gateways/mail.gateway";
import { JobQueue } from "../gateways/job-queue.gateway";
import { EmailJobName } from "../../infra/jobs/job-names";
import { pinoLogger } from "../../infra/loggers/pino.logger";

export class EnviarEmailDespachoHandler implements DomainEventHandler {
    constructor(private destinatarioRepository: DestinatarioRepository, private queue: JobQueue) { }

    public handle = async (event: EntregaDespachadaEvent) => {
        const destinatario = await this.destinatarioRepository.findById(event.payload.destinatarioId);
        if (!destinatario) {
            pinoLogger.warn(`[❌ Mailservice] Destinatário com ID ${event.payload.destinatarioId} não encontrado. Não foi possível enviar o email.`);
            return;
        }

        const to: MailTo[] = [{
            nome: destinatario.nome,
            email: destinatario.email
        }]

        const subject = 'Pedido saiu para entrega';

        const body: MailBody = {
            html: getEntregaDespachadaTemplate({
                idEntrega: event.payload.entregaId,
                nomeDestinatario: destinatario.nome,
            }),
            textContent: `Olá, ${destinatario.nome}! Sua entrega referente ao código: ${event.payload.entregaId} está a caminho!`
        }

        this.queue.add(EmailJobName.ENTREGA_DESPACHADA, { to, subject, body });
    }
}
