import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";
import { Entrega } from "../../domain/entities/entrega.entity";
import { ResourceNotAllowedError } from "../../core/errors/resource-not-allowed.error";

interface ListarHistoricoEntregaRequest {
    entregaId: string;
    destinatarioId: string;
}

interface ListarHistoricoEntregaResponse {
    entrega: Entrega
}

export class ListarHistoricoEntregaUseCase extends BaseUseCase<ListarHistoricoEntregaRequest, ListarHistoricoEntregaResponse> {
    constructor(private entregaRepository: EntregaRepository) { super() }

    async execute(request: ListarHistoricoEntregaRequest): Promise<ListarHistoricoEntregaResponse> {
        const entrega = await this.entregaRepository.findById(request.entregaId);

        if (!entrega)
            throw new ResourceNotFoundError('Entrega', request.entregaId);

        if (entrega.destinatarioId !== request.destinatarioId)
            throw new ResourceNotAllowedError('Entrega', { destinatarioId: request.destinatarioId });

        return { entrega };
    }
}