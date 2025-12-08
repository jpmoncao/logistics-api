import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega-repository"
import { CreateEntregaUseCase } from "../../application/use-cases/create-entrega";
import { CreateEntregaController } from "../http/controllers/create-entrega-controller";
import { prisma } from "../database/prisma/client";

export function createEntregaFactory(): CreateEntregaController {
    const repository = new PrismaEntregaRepository(prisma);
    const useCase = new CreateEntregaUseCase(repository);
    const controller = new CreateEntregaController(useCase);

    return controller;
}