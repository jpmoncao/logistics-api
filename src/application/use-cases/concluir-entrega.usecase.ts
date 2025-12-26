import { BaseUseCase } from "../../core/base/usecase";
import { DomainEventDispatcher } from "../../core/events/dispatcher";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";
import { ResourceNotAllowedError } from "../../core/errors/resource-not-allowed.error";

import { StorageGateway } from "../gateways/storage.gateway";

import { EntregaCacheRepository, EntregaRepository } from "../../domain/repositories/entrega.repository";

interface ConcluirEntregaRequest {
    entregaId: string;
    entregadorId: string;
    fileBody: Buffer;
    fileType: string;
}

export class ConcluirEntregaUseCase extends BaseUseCase<ConcluirEntregaRequest, void> {
    constructor(private entregaRepository: EntregaRepository, dispatcher: DomainEventDispatcher, private storage: StorageGateway, private entregaCacheRepository: EntregaCacheRepository) {
        super(dispatcher);
    }

    async execute(request: ConcluirEntregaRequest): Promise<void> {
        const entrega = await this.entregaRepository.findById(request.entregaId);
        if (!entrega)
            throw new ResourceNotFoundError('Entrega', request.entregaId);

        if (entrega.entregadorId !== request.entregadorId)
            throw new ResourceNotAllowedError('Entregador', { entregadorId: request.entregadorId });

        const timestamp = new Date().getTime();
        const extensao = request.fileType.split('/')[1] || 'jpg';
        const fileName = `${timestamp}-comprovante_entrega-${entrega.id}.${extensao}`;

        entrega.anexarComprovanteEntrega(fileName);
        entrega.concluirEntrega();

        await this.storage.save({
            fileName,
            body: request.fileBody,
            fileType: request.fileType
        });

        await this.entregaRepository.save(entrega);

        await this.entregaCacheRepository.clearByEntregadorId(entrega.entregadorId);

        const dispatchedEvents = await this.dispatchEvents(entrega.domainEvents);
        if (dispatchedEvents)
            entrega.clearEvents();
    }
}