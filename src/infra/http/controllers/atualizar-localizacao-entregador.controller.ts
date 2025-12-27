import z from 'zod';
import { Request, Response } from 'express';

import { RouteDocsConfig } from '../docs/describe-route';
import HttpStatusCode from '../utils/status-code';

import { BaseController } from '../../../core/base/controller'
import { IAtualizarLocalizacaoEntregadorUseCase } from '../../../application/use-cases/atualizar-localizacao-entregador.usecase';
import { atualizarLocalizacaoEntregaBodySchema } from '../../../application/dtos/atualizar-localizacao-entrega.dto';
import { UserRole } from '../../../core/types/user-role';

export class AtualizarLocalizacaoEntregadorController extends BaseController {
    constructor(private atualizarLocalizacaoEntregadorUseCase: IAtualizarLocalizacaoEntregadorUseCase) { super() }

    public docs: RouteDocsConfig = {
        summary: 'Atualizar a localização atual do entregador',
        tags: ['Entregadores'],
        roles: [UserRole.ENTREGADOR],
        body: atualizarLocalizacaoEntregaBodySchema,
        response: {
            [HttpStatusCode.OK]: {
                description: 'Entregador teve sua localização atualizada com sucesso.',
                schema: z.object()
            }
        }
    };

    handle = async (req: Request, res: Response) => {
        try {
            const { latitude, longitude } = atualizarLocalizacaoEntregaBodySchema.parse(req.body);

            await this.atualizarLocalizacaoEntregadorUseCase.execute({ entregadorId: req.user.id, latitude, longitude });
            return this.ok(res, 'Entregador teve sua localização atualizada com sucesso.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}