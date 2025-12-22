import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { AutenticarDestinatarioUseCase } from "../../../application/use-cases/autenticar-destinatario.usecase";

const autenticarDestinatarioBodySchema = z.object({
    email: z.email({ message: "Email inválido" }),
    senha: z.string({ message: "Senha inválida" }).min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
});

export class AutenticarDestinatarioController extends BaseController {
    constructor(private autenticarDestinatarioUseCase: AutenticarDestinatarioUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { email, senha } = autenticarDestinatarioBodySchema.parse(req.body);

            const { token } = await this.autenticarDestinatarioUseCase.execute({ email, senha });

            return this.created(res, "Login efetuado com sucesso!", { token });
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}