import { BaseUseCase } from "../../core/base/usecase";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";

import { Entrega } from "../../domain/entities/entrega.entity";
import { Coordenada } from "../../domain/value-objects/coordenada.value-object";

import { StatusEntrega } from "../../domain/types/entrega";

interface CreateEntregaRequest {
    latitude: number;
    longitude: number;

}
interface CreateEntregaResponse {
    entregaId: string;
}

export class CreateEntregaUseCase extends BaseUseCase<CreateEntregaRequest, CreateEntregaResponse> {
    constructor(private entregaRepository: EntregaRepository) { super() }

    async execute(request: CreateEntregaRequest): Promise<CreateEntregaResponse> {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: new Coordenada(request.latitude, request.longitude)
        });

        await this.entregaRepository.create(entrega);

        return { entregaId: entrega.id }
    }
}