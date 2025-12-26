import { BaseUseCase } from "../../core/base/usecase";
import { DomainEventDispatcher } from "../../core/events/dispatcher";
import { ResourceNotFoundError } from '../../core/errors/resource-not-found.error'
import { ResourcesNotFoundError } from "../../core/errors/resources-not-found.error";

import { EntregadorRepository } from "../../domain/repositories/entregador.repository";
import { EntregaRepository } from "../../domain/repositories/entrega.repository";

interface DespacharLoteEntregasRequest {
    entregadorId: string;
    entregas: string[];
    latitude: number;
    longitude: number;
}

export class DespacharLoteEntregasUseCase extends BaseUseCase<DespacharLoteEntregasRequest, void> {
    constructor(private entregaRepository: EntregaRepository, private entregadorRepository: EntregadorRepository, dispatcher: DomainEventDispatcher) {
        super(dispatcher);
    }

    async execute({ entregadorId, entregas: entregasIds, latitude, longitude }: DespacharLoteEntregasRequest): Promise<void> {
        const entregador = await this.entregadorRepository.findById(entregadorId);
        if (!entregador)
            throw new ResourceNotFoundError('Entregador', entregadorId);

        const entregasEntities = await this.entregaRepository.findManyByIds(entregasIds);

        if (entregasEntities.length !== entregasIds.length)
            throw new ResourcesNotFoundError('one or more "deliveries"');

        for (const entrega of entregasEntities) {
            entrega.atribuirEntregador(entregador.id);
            entrega.despachar(latitude, longitude);
        }

        await this.entregaRepository.saveMany(entregasEntities);

        for (const entrega of entregasEntities) {
            const dispatchedEvents = await this.dispatchEvents(entrega.domainEvents);
            if (dispatchedEvents)
                entrega.clearEvents();
        }
    }
}