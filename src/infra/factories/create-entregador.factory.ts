import { BcryptEncrypter } from "../cryptography/bcrypt-encrypter";
import { PrismaEntregadorRepository } from "../database/prisma/repositories/prisma-entregador.repository"
import { CreateEntregadorUseCase } from "../../application/use-cases/create-entregador.usecase";
import { CreateEntregadorController } from "../http/controllers/create-entregador.controller";
import { prisma } from "../database/prisma/client";

export function createEntregadorFactory(): CreateEntregadorController {
    const repository = new PrismaEntregadorRepository(prisma);
    const encrypter = new BcryptEncrypter();
    const useCase = new CreateEntregadorUseCase(repository, encrypter);
    const controller = new CreateEntregadorController(useCase);

    return controller;
}