import { BaseUseCase } from "../../core/base/usecase";

import { EntregaCacheRepository } from "../../domain/repositories/entrega.repository";
import {
    AtualizarLocalizacaoEntregadorRequest,
    AtualizarLocalizacaoEntregadorUseCase,
    IAtualizarLocalizacaoEntregadorUseCase
} from "../use-cases/atualizar-localizacao-entregador.usecase";

export class AtualizarLocalizacaoEntregadorProxy extends BaseUseCase<AtualizarLocalizacaoEntregadorRequest, void> implements IAtualizarLocalizacaoEntregadorUseCase {
    constructor(private realUseCase: AtualizarLocalizacaoEntregadorUseCase, private entregaCacheRepository: EntregaCacheRepository) { super(); }

    async execute(request: AtualizarLocalizacaoEntregadorRequest): Promise<void> {
        const response = await this.realUseCase.execute(request);

        await this.entregaCacheRepository.clearByEntregadorId(request.entregadorId);

        return response;
    }
}