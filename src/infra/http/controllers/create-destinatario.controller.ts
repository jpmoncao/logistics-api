import { Request, Response } from 'express';
import z from 'zod';

import { BaseController } from '../../../core/base/controller'
import { CreateDestinatarioUseCase } from "../../../application/use-cases/create-destinatario.usecase";
import { validarCpf } from '../../../core/utils/validar-cpf';

const createDestinatarioBodySchema = z.object({
    nome: z
        .string({ message: "Nome é obrigatório" })
        .min(1, { message: "Nome é obrigatório" })
        .max(100, { message: "Nome muito longo" }),
    cpf: z
        .string({ message: "CPF é obrigatório" })
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine((val) => val.length === 11, { message: "CPF deve ter 11 dígitos" })
        .refine((val) => validarCpf(val), { message: "CPF inválido." }),
    telefone: z
        .string({ message: "Telefone é obrigatório" })
        .transform((val) => val.replace(/[^\d]+/g, ''))
        .refine((val) => val.length >= 10 && val.length <= 11, { message: "Telefone inválido" }),
    email: z.email({ message: "E-mail inválido" }),
    senha: z
        .string({ message: "Senha é obrigatória" })
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
        .regex(/[A-Z]/, { message: "A senha deve conter ao menos uma letra maiúscula" })
        .regex(/[a-z]/, { message: "A senha deve conter ao menos uma letra minúscula" })
        .regex(/[0-9]/, { message: "A senha deve conter ao menos um número" })
        .regex(/[\W_]/, "A senha deve conter ao menos um caractere especial") // Regex mais curta para especiais (tudo que não for letra ou número + underscore)
});

export class CreateDestinatarioController extends BaseController {
    constructor(private createDestinatarioUseCase: CreateDestinatarioUseCase) { super() }

    handle = async (req: Request, res: Response) => {
        try {
            const { nome, cpf, telefone, email, senha } = createDestinatarioBodySchema.parse(req.body);

            const cleanedCpf = cpf.replace(/[^\d]+/g, '');

            const { destinatarioId } = await this.createDestinatarioUseCase.execute({ nome, cpf: cleanedCpf, telefone, email, senha });

            return this.created(res, "Destinatário criado com sucesso!", { destinatarioId });
        } catch (error) {
            this.analyzeError(res, error)
        }
    }
}