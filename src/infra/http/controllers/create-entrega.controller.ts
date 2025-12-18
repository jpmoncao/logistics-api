import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { CreateEntregaUseCase } from "../../../application/use-cases/create-entrega.usecase";

const createEntregaBodySchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
});

export class CreateEntregaController extends BaseController {
    constructor(private createEntregaUseCase: CreateEntregaUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { latitude, longitude } = createEntregaBodySchema.parse(req.body);

            const { entregaId } = await this.createEntregaUseCase.execute({ latitude, longitude });

            return this.created(res, "Entrega criada com sucesso!", { entregaId });
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}