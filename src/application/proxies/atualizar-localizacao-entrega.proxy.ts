import { BaseUseCase } from "../../core/base/usecase";

import { EntregaCacheRepository } from "../../domain/repositories/entrega.repository";

import {
    AtualizarLocalizacaoEntregaRequest,
    AtualizarLocalizacaoEntregaUseCase,
    IAtualizarLocalizacaoEntregaUseCase
} from "../use-cases/atualizar-localizacao-entrega.usecase";

export class AtualizarLocalizacaoEntregaProxy extends BaseUseCase<AtualizarLocalizacaoEntregaRequest, void> implements IAtualizarLocalizacaoEntregaUseCase {
    constructor(private realUseCase: AtualizarLocalizacaoEntregaUseCase, private entregaCacheRepository: EntregaCacheRepository) { super(); }

    async execute(request: AtualizarLocalizacaoEntregaRequest): Promise<void> {
        const response = await this.realUseCase.execute(request);

        await this.entregaCacheRepository.clearByEntregadorId(request.entregadorId);

        return response;
    }
}