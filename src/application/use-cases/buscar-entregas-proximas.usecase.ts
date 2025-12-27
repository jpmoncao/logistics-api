import { BaseUseCase } from "../../core/base/usecase";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";
import { Entrega } from "../../domain/aggregate/entrega.entity";

export interface BuscarEntregasProximasRequest {
    entregadorId: string;
}

export interface BuscarEntregasProximasResponse {
    entregas: Entrega[];
}

export interface IBuscarEntregasProximasUseCase {
    execute(request: BuscarEntregasProximasRequest): Promise<BuscarEntregasProximasResponse>;
}

export class BuscarEntregasProximasUseCase extends BaseUseCase<BuscarEntregasProximasRequest, BuscarEntregasProximasResponse> implements IBuscarEntregasProximasUseCase {
    constructor(private entregaRepository: EntregaRepository) { super(); }

    async execute({ entregadorId }: BuscarEntregasProximasRequest): Promise<BuscarEntregasProximasResponse> {
        const entregas = await this.entregaRepository.findAllByEntregadorId(entregadorId);

        return { entregas };
    }
}