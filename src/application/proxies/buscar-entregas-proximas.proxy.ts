import { BaseUseCase } from "../../core/base/usecase";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";

import { EntregaCacheRepository } from "../../domain/repositories/entrega.repository";
import { EntregadorRepository } from "../../domain/repositories/entregador.repository";

import {
    BuscarEntregasProximasRequest,
    BuscarEntregasProximasResponse,
    BuscarEntregasProximasUseCase,
    IBuscarEntregasProximasUseCase
} from "../use-cases/buscar-entregas-proximas.usecase";


export class BuscarEntregasProximasProxy extends BaseUseCase<BuscarEntregasProximasRequest, BuscarEntregasProximasResponse> implements IBuscarEntregasProximasUseCase {
    constructor(private realUseCase: BuscarEntregasProximasUseCase, private entregadorRepository: EntregadorRepository, private entregaCacheRepository: EntregaCacheRepository) { super(); }

    async execute({ entregadorId }: BuscarEntregasProximasRequest): Promise<BuscarEntregasProximasResponse> {
        const entregador = await this.entregadorRepository.findById(entregadorId);
        if (!entregador)
            throw new ResourceNotFoundError('Entregador', entregadorId);

        const cached = await this.entregaCacheRepository.findAllByEntregadorId(entregadorId);
        if (cached)
            return { entregas: cached };

        const { entregas } = await this.realUseCase.execute({ entregadorId });

        await this.entregaCacheRepository.saveManyByEntregadorId(entregadorId, entregas);

        return { entregas };
    }
}