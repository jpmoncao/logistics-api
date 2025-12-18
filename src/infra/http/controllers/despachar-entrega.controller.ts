import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { DespacharEntregaUseCase } from '../../../application/use-cases/despachar-entrega.usecase'


const despacharEntregaParamsSchema = z.object({
    id: z.uuid({ message: 'Id da entrega não informado!' })
});

const despacharEntregaBodySchema = z.object({
    latitude: z.number({ message: 'Latitude não informada!' }),
    longitude: z.number({ message: 'Longitude não informada!' })
});

export class DespacharEntregaController extends BaseController {
    constructor(private despacharEntregaUseCase: DespacharEntregaUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { id } = despacharEntregaParamsSchema.parse(req.params);
            const { latitude, longitude } = despacharEntregaBodySchema.parse(req.body);

            await this.despacharEntregaUseCase.execute({ entregaId: id, entregadorId: req.user.id, latitude, longitude });

            return this.ok(res, 'Pedido saiu para entrega.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}