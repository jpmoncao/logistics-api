import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { AtualizarLocalizacaoEntregaUseCase } from "../../application/use-cases/atualizar-localizacao-entrega.use-case";
import { AtualizarLocalizacaoEntregaController } from "../http/controllers/atualizar-localizacao-entrega.controller";

export function atualizarLocalizacaoEntregaFactory(): AtualizarLocalizacaoEntregaController {
    const repository = new PrismaEntregaRepository(prisma);

    const useCase = new AtualizarLocalizacaoEntregaUseCase(repository);
    const controller = new AtualizarLocalizacaoEntregaController(useCase);

    return controller;
}