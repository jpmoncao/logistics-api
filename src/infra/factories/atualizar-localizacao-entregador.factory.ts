import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { AtualizarLocalizacaoEntregadorController } from "../http/controllers/atualizar-localizacao-entregador.controller";
import { AtualizarLocalizacaoEntregadorUseCase } from "../../application/use-cases/atualizar-localizacao-entregador.usecase";

export function atualizarLocalizacaoEntregadorFactory(): AtualizarLocalizacaoEntregadorController {
    const repository = new PrismaEntregaRepository(prisma);

    const useCase = new AtualizarLocalizacaoEntregadorUseCase(repository);
    const controller = new AtualizarLocalizacaoEntregadorController(useCase);
    return controller;
}