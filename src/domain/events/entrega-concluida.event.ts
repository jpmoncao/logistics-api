import { DomainEvent } from '../../core/events/domain-event'

import { Entrega } from '../aggregate/entrega.entity'

interface EntregaConcluidaPayload {
    entregaId: string;
    destinatarioId: string
}

export class EntregaConcluidaEvent implements DomainEvent {
    public readonly occurredAt: Date;
    public readonly eventName: string;
    public readonly payload: EntregaConcluidaPayload;

    public static eventName = 'EntregaConcluida';

    constructor(entrega: Entrega) {
        this.occurredAt = new Date();
        this.payload = {
            entregaId: entrega.id,
            destinatarioId: entrega.destinatarioId
        }

        this.eventName = EntregaConcluidaEvent.eventName;
    }
}