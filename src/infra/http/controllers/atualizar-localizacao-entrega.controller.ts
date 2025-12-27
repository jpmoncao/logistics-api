import z from 'zod';
import { Request, Response } from 'express';

import { RouteDocsConfig } from '../docs/describe-route';
import HttpStatusCode from '../utils/status-code';

import { BaseController } from '../../../core/base/controller'
import { IAtualizarLocalizacaoEntregaUseCase } from '../../../application/use-cases/atualizar-localizacao-entrega.usecase'
import { atualizarLocalizacaoEntregaBodySchema, atualizarLocalizacaoEntregaParamsSchema } from '../../../application/dtos/atualizar-localizacao-entrega.dto';
import { UserRole } from '../../../core/types/user-role';

export class AtualizarLocalizacaoEntregaController extends BaseController {
    constructor(private atualizarLocalizacaoEntregaUseCase: IAtualizarLocalizacaoEntregaUseCase) { super() }

    public docs: RouteDocsConfig = {
        summary: 'Atualizar a localização atual da entrega',
        tags: ['Entregas'],
        roles: [UserRole.ENTREGADOR],
        body: atualizarLocalizacaoEntregaBodySchema,
        params: atualizarLocalizacaoEntregaParamsSchema,
        response: {
            [HttpStatusCode.OK]: {
                description: 'Entrega teve sua localização alterada com sucesso.',
                schema: z.object()
            }
        }
    };

    handle = async (req: Request, res: Response) => {
        try {
            const { id } = atualizarLocalizacaoEntregaParamsSchema.parse(req.params);
            const { latitude, longitude } = atualizarLocalizacaoEntregaBodySchema.parse(req.body);

            await this.atualizarLocalizacaoEntregaUseCase.execute({ entregaId: id, entregadorId: req.user.id, latitude, longitude });
            return this.ok(res, 'Entrega teve sua localização alterada com sucesso.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}