import { BaseUseCase } from "../../core/base/usecase";
import { DomainEventDispatcher } from "../../core/events/dispatcher";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";

import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";

interface ConcluirEntregaRequest {
    entregaId: string;
}

export class ConcluirEntregaUseCase extends BaseUseCase<ConcluirEntregaRequest, void> {
    constructor(private entregaRepository: EntregaRepository, dispatcher: DomainEventDispatcher) {
        super(dispatcher);
    }

    async execute(request: ConcluirEntregaRequest): Promise<void> {
        const entrega = await this.entregaRepository.findById(request.entregaId);
        if (!entrega)
            throw new ResourceNotFoundError('Entrega');

        entrega.concluirEntrega();

        await this.entregaRepository.save(entrega);

        const dispatchedEvents = await this.dispatchEvents(entrega.domainEvents);
        if (dispatchedEvents)
            entrega.clearEvents();
    }
}