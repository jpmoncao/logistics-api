import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotAllowedError } from "../../core/errors/resource-not-allowed.error";
import { ResourceNotFoundError } from '../../core/errors/resource-not-found.error'

import { EntregaRepository } from "../../domain/repositories/entrega.repository";

interface AtualizarLocalizacaoEntregaRequest {
    entregaId: string;
    entregadorId: string;
    latitude: number;
    longitude: number;
}

export class AtualizarLocalizacaoEntregaUseCase extends BaseUseCase<AtualizarLocalizacaoEntregaRequest, void> {
    constructor(private entregaRepository: EntregaRepository) { super(); }

    async execute(request: AtualizarLocalizacaoEntregaRequest): Promise<void> {
        const entrega = await this.entregaRepository.findById(request.entregaId);
        if (!entrega)
            throw new ResourceNotFoundError('Entrega');

        if (entrega.entregadorId !== request.entregadorId)
            throw new ResourceNotAllowedError('Entregador');

        entrega.atualizarLocalizacaoAtual(request.latitude, request.longitude);

        await this.entregaRepository.save(entrega);
    }
}