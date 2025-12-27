import z from 'zod';
import { Request, Response } from 'express';

import { RouteDocsConfig } from '../docs/describe-route';
import HttpStatusCode from '../utils/status-code';

import { BaseController } from "../../../core/base/controller";
import { IBuscarEntregasProximasUseCase } from "../../../application/use-cases/buscar-entregas-proximas.usecase";
import { EntregasProximasPresenter } from "../presenters/entrega-proximas.presenter";
import { UserRole } from '../../../core/types/user-role';

export class BuscarEntregasProximasController extends BaseController {
    constructor(private usecase: IBuscarEntregasProximasUseCase) { super() }

    public docs: RouteDocsConfig = {
        summary: 'Buscar entregas próximas do entregador',
        tags: ['Entregadores'],
        roles: [UserRole.ENTREGADOR],
        response: {
            [HttpStatusCode.OK]: {
                description: 'Entregas próximas listadas com sucesso.',
                schema: z.object({
                    id_entrega: z.uuid(),
                    distancia: z.string().openapi({ example: '5 km' }),
                    destino: z.object({
                        latitude: z.number().min(-90).max(90),
                        longitude: z.number().min(-180).max(180)
                    })
                })
            }
        }
    };

    handle = async (req: Request, res: Response) => {
        try {
            const { entregas } = await this.usecase.execute({ entregadorId: req.user.id });

            const entregasPresented = { entregas: EntregasProximasPresenter.toHTTP(entregas) };

            return this.ok(res, 'Entregas próximas listadas com sucesso.', entregasPresented);
        } catch (error) {
            this.analyzeError(res, error);
        }
    }
}