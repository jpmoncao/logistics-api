import { Entrega } from "../../domain/entities/entrega";
import { EntregaRepository } from "../../domain/repos/entrega";
import { StatusEntrega } from "../../core/types/entrega";

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