import z from 'zod';
import { Request, Response } from 'express';

import { RouteDocsConfig } from '../docs/describe-route';
import HttpStatusCode from '../utils/status-code';

import { BaseController } from '../../../core/base/controller'
import { ValidationError } from '../../../core/errors/validation.error';

import { IConcluirEntregaUseCase } from '../../../application/use-cases/concluir-entrega.usecase'
import { concluirEntregaBodySchema, concluirEntregaParamsSchema } from '../../../application/dtos/concluir-entrega.dto';
import { UserRole } from '../../../core/types/user-role';

export class ConcluirEntregaController extends BaseController {
    constructor(private concluirEntregaUseCase: IConcluirEntregaUseCase) { super() }

    public docs: RouteDocsConfig = {
        contentType: 'multipart/form-data',
        summary: 'Concluir uma entrega',
        tags: ['Entregas'],
        roles: [UserRole.ENTREGADOR],
        body: concluirEntregaBodySchema,
        params: concluirEntregaParamsSchema,
        response: {
            [HttpStatusCode.OK]: {
                description: 'Pedido de entrega foi concluído.',
                schema: z.object()
            }
        }
    };

    handle = async (req: Request, res: Response) => {
        try {
            const { id } = concluirEntregaParamsSchema.parse(req.params);

            const file = req.file;
            if (!file)
                throw new ValidationError([{
                    field: 'comprovante',
                    message: 'A photo of the delivery receipt is required to complete the delivery.'
                }]);

            await this.concluirEntregaUseCase.execute({
                entregaId: id,
                entregadorId: req.user.id,
                fileBody: file.buffer,
                fileType: file.mimetype
            });

            return this.ok(res, 'Pedido de entrega foi concluído.');
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}