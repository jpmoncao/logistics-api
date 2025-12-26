import { BaseUseCase } from "../../core/base/usecase";

import { EntregaRepository } from "../../domain/repositories/entrega.repository";
import { DestinatarioRepository } from "../../domain/repositories/destinatario.repository";

import { Entrega } from "../../domain/aggregate/entrega.entity";
import { Coordenada } from "../../domain/value-objects/coordenada.value-object";

import { StatusEntrega } from "../../domain/types/entrega";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found.error";

interface CreateEntregaRequest {
    latitude: number;
    longitude: number;
    destinatarioId: string;
}
interface CreateEntregaResponse {
    entregaId: string;
}

export class CreateEntregaUseCase extends BaseUseCase<CreateEntregaRequest, CreateEntregaResponse> {
    constructor(private entregaRepository: EntregaRepository, private destinatarioRepository: DestinatarioRepository) { super() }

    async execute({ latitude, longitude, destinatarioId }: CreateEntregaRequest): Promise<CreateEntregaResponse> {
        const destinatario = this.destinatarioRepository.findById(destinatarioId);
        if (!destinatario)
            throw new ResourceNotFoundError("Destinatário", destinatarioId);

        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: new Coordenada(latitude, longitude),
            destinatarioId
        });

        await this.entregaRepository.create(entrega);

        return { entregaId: entrega.id }
    }
}