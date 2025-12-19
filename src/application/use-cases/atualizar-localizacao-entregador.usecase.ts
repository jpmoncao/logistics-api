import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotFoundError } from '../../core/errors/resource-not-found.error'

import { EntregaRepository } from "../../domain/repositories/entrega.repository";
import { StatusEntrega } from "../../domain/types/entrega";

interface AtualizarLocalizacaoEntregadorRequest {
    entregadorId: string;
    latitude: number;
    longitude: number;
}

export class AtualizarLocalizacaoEntregadorUseCase extends BaseUseCase<AtualizarLocalizacaoEntregadorRequest, void> {
    constructor(private entregaRepository: EntregaRepository) { super(); }

    async execute({ entregadorId, latitude, longitude }: AtualizarLocalizacaoEntregadorRequest): Promise<void> {
        const entregas = await this.entregaRepository.findAllByEntregadorId(entregadorId);
        if (entregas.length === 0)
            throw new ResourceNotFoundError('Entregador');

        const entregasEmCaminho = entregas.filter(entrega => entrega.status === StatusEntrega.CAMINHO);

        for (const entrega of entregasEmCaminho)
            entrega.atualizarLocalizacaoAtual(latitude, longitude);

        await this.entregaRepository.saveMany(entregasEmCaminho);
    }
}