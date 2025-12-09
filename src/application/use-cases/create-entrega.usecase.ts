import { Entrega } from "../../domain/entities/entrega.entity";
import { EntregaRepository } from "../../domain/repositories/entrega.repository";
import { StatusEntrega } from "../../domain/types/entrega";

interface CreateEntregaRequest {
    status?: StatusEntrega;
}

interface CreateEntregaResponse {
    entregaId: string;
}

export class CreateEntregaUseCase {
    constructor(private entregaRepository: EntregaRepository) { }

    async execute(request: CreateEntregaRequest): Promise<CreateEntregaResponse> {
        const entrega = new Entrega({
            status: request.status || StatusEntrega.PENDENTE
        });

        await this.entregaRepository.create(entrega);

        return { entregaId: entrega.id }
    }
}