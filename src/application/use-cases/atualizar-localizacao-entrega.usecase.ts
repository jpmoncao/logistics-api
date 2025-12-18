import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotFoundError } from '../../core/errors/resource-not-found.error'

import { EntregaRepository } from "../../domain/repositories/entrega.repository";

interface AtualizarLocalizacaoEntregaRequest {
    entregaId: string;
    latitude: number;
    longitude: number;
}

export class AtualizarLocalizacaoEntregaUseCase extends BaseUseCase<AtualizarLocalizacaoEntregaRequest, void> {
    constructor(private entregaRepository: EntregaRepository) { super(); }

    async execute(request: AtualizarLocalizacaoEntregaRequest): Promise<void> {
        const entrega = await this.entregaRepository.findById(request.entregaId);
        if (!entrega)
            throw new ResourceNotFoundError('Entrega');

        entrega.atualizarLocalizacaoAtual(request.latitude, request.longitude);

        await this.entregaRepository.save(entrega);
    }
}