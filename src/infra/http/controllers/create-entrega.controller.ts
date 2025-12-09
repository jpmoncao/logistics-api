import { Request, Response } from 'express';
import z from 'zod';

import { CreateEntregaUseCase } from "../../../application/use-cases/create-entrega.usecase";

import HttpStatusCode from "../utils/status-code"
import { StatusEntrega } from '../../../domain/types/entrega';


const createEntregaBodySchema = z.object({
    status: z.enum(StatusEntrega, { message: "Status não conhecido!" })
});

export class CreateEntregaController {
    constructor(private createEntregaUseCase: CreateEntregaUseCase) { }

    handle = async (req: Request, res: Response) => {
        try {
            const { status } = createEntregaBodySchema.parse(req.body);

            const result = await this.createEntregaUseCase.execute({ status });

            return res.status(HttpStatusCode.CREATED).json(result);
        } catch (err) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                error: err instanceof Error ? err.message : "Unexpected error"
            });
        }
    }
}