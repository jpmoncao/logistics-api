import { DomainEvent } from '../../core/events/domain-event'

import { Entrega } from '../aggregate/entrega.entity'

interface EntregaDespachadaPayload {
    entregaId: string;
    destinatarioId: string
}

export class EntregaDespachadaEvent implements DomainEvent {
    public readonly occurredAt: Date;
    public readonly eventName: string;
    public readonly payload: EntregaDespachadaPayload;

    public static eventName = 'EntregaDespachada';

    constructor(entrega: Entrega) {
        this.occurredAt = new Date();
        this.payload = {
            entregaId: entrega.id,
            destinatarioId: entrega.destinatarioId
        }

        this.eventName = EntregaDespachadaEvent.eventName;
    }
}