import { BaseUseCase } from "../../core/base/usecase";

import { EntregaCacheRepository } from "../../domain/repositories/entrega.repository";
import {
    ConcluirEntregaRequest,
    ConcluirEntregaUseCase,
    IConcluirEntregaUseCase
} from "../use-cases/concluir-entrega.usecase";

export class ConcluirEntregaProxy extends BaseUseCase<ConcluirEntregaRequest, void> implements IConcluirEntregaUseCase {
    constructor(private realUseCase: ConcluirEntregaUseCase, private entregaCacheRepository: EntregaCacheRepository) { super(); }

    async execute(request: ConcluirEntregaRequest): Promise<void> {
        const response = await this.realUseCase.execute(request);

        await this.entregaCacheRepository.clearByEntregadorId(request.entregadorId);

        return response;
    }
}