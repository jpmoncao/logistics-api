import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { CreateEntregaUseCase } from "../../../application/use-cases/create-entrega.usecase";
import { StatusEntrega } from '../../../domain/types/entrega';

const createEntregaBodySchema = z.object({
    status: z.enum(StatusEntrega, { message: "Status não conhecido!" })
});

export class CreateEntregaController extends BaseController {
    constructor(private createEntregaUseCase: CreateEntregaUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { status } = createEntregaBodySchema.parse(req.body);

            await this.createEntregaUseCase.execute({ status });

            return this.created(res, "Entrega criada com sucesso!");
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}