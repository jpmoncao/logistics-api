import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { AtualizarLocalizacaoEntregadorUseCase } from '../../../application/use-cases/atualizar-localizacao-entregador.usecase';

const atualizarLocalizacaoEntregaBodySchema = z.object({
    latitude: z.number({ message: 'Latitude não informada!' }),
    longitude: z.number({ message: 'Longitude não informada!' })
});

export class AtualizarLocalizacaoEntregadorController extends BaseController {
    constructor(private atualizarLocalizacaoEntregadorUseCase: AtualizarLocalizacaoEntregadorUseCase) { super() }

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