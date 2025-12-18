import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { AtualizarLocalizacaoEntregaUseCase } from '../../../application/use-cases/atualizar-localizacao-entrega.use-case'


const atualizarLocalizacaoEntregaParamsSchema = z.object({
    id: z.uuid({ message: 'Id da entrega não informado!' })
});

const atualizarLocalizacaoEntregaBodySchema = z.object({
    latitude: z.number({ message: 'Latitude não informada!' }),
    longitude: z.number({ message: 'Longitude não informada!' })
});

export class AtualizarLocalizacaoEntregaController extends BaseController {
    constructor(private atualizarLocalizacaoEntregaUseCase: AtualizarLocalizacaoEntregaUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { id } = atualizarLocalizacaoEntregaParamsSchema.parse(req.params);
            const { latitude, longitude } = atualizarLocalizacaoEntregaBodySchema.parse(req.body);

            await this.atualizarLocalizacaoEntregaUseCase.execute({ entregaId: id, latitude, longitude });

            return this.ok(res, 'Entrega teve sua atualização alterada com sucesso.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}