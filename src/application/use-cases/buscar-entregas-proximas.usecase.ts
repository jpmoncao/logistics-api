import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";

import { EntregaCacheRepository, EntregaRepository } from "../../domain/repositories/entrega.repository";
import { EntregadorRepository } from "../../domain/repositories/entregador.repository";
import { Entrega } from "../../domain/aggregate/entrega.entity";


interface BuscarEntregasProximasRequest {
    entregadorId: string;
}

interface BuscarEntregasProximasResponse {
    entregas: Entrega[];
}

export class BuscarEntregasProximasUseCase extends BaseUseCase<BuscarEntregasProximasRequest, BuscarEntregasProximasResponse> {
    constructor(private entregadorRepository: EntregadorRepository, private entregaRepository: EntregaRepository, private entregaCacheRepository: EntregaCacheRepository) { super(); }

    async execute({ entregadorId }: BuscarEntregasProximasRequest): Promise<BuscarEntregasProximasResponse> {
        const entregador = await this.entregadorRepository.findById(entregadorId);
        if (!entregador)
            throw new ResourceNotFoundError('Entregador', entregadorId);

        const cached = await this.entregaCacheRepository.findAllByEntregadorId(entregadorId);
        if (cached)
            return { entregas: cached };

        const entregas = await this.entregaRepository.findAllByEntregadorId(entregadorId);

        await this.entregaCacheRepository.saveManyByEntregadorId(entregadorId, entregas);

        return { entregas };
    }
}