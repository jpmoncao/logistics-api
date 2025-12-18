import { BaseUseCase } from "../../core/base/usecase";
import { DomainEventDispatcher } from "../../core/events/dispatcher";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";
import { ResourceNotAllowedError } from "../../core/errors/resource-not-allowed.error";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";

interface ConcluirEntregaRequest {
    entregaId: string;
    entregadorId: string;
}

export class ConcluirEntregaUseCase extends BaseUseCase<ConcluirEntregaRequest, void> {
    constructor(private entregaRepository: EntregaRepository, dispatcher: DomainEventDispatcher) {
        super(dispatcher);
    }

    async execute(request: ConcluirEntregaRequest): Promise<void> {
        const entrega = await this.entregaRepository.findById(request.entregaId);
        if (!entrega)
            throw new ResourceNotFoundError('Entrega');

        if (entrega.entregadorId !== request.entregadorId)
            throw new ResourceNotAllowedError('Entregador');

        entrega.concluirEntrega();

        await this.entregaRepository.save(entrega);

        const dispatchedEvents = await this.dispatchEvents(entrega.domainEvents);
        if (dispatchedEvents)
            entrega.clearEvents();
    }
}