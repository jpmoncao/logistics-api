import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { ListarHistoricoEntregaUseCase } from "../../application/use-cases/listar-historico-entrega.usecase";
import { ListarHistoricoEntregaController } from "../http/controllers/listar-historico-entrega.controller";

export function listarHistoricoEntregaFactory(): ListarHistoricoEntregaController {
    const repository = new PrismaEntregaRepository(prisma);

    const useCase = new ListarHistoricoEntregaUseCase(repository);
    const controller = new ListarHistoricoEntregaController(useCase);

    return controller;
}