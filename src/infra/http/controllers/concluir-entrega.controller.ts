import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'

import { ConcluirEntregaUseCase } from '../../../application/use-cases/concluir-entrega.usecase'

const concluirEntregaParamsSchema = z.object({
    id: z.uuid({ message: 'Id da entrega não informado!' })
});

export class ConcluirEntregaController extends BaseController {
    constructor(private concluirEntregaUseCase: ConcluirEntregaUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { id } = concluirEntregaParamsSchema.parse(req.params);

            await this.concluirEntregaUseCase.execute({ entregaId: id });

            return this.ok(res, 'Pedido de entrega foi concluído.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}