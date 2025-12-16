import { EntregaConcluidaEvent } from "../../domain/events/entrega-concluida.event";

export async function enviarEmailEntregaConcluidaHandler(event: EntregaConcluidaEvent) {
    console.log(`[📧EMAIL] Enviando para ${event.payload.emailCliente}: Seu pedido ${event.payload.entregaId} foi entregue!`);
}