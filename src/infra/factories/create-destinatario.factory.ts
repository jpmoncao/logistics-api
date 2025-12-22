import { BcryptHasher } from "../cryptography/bcrypt-hasher";
import { PrismaDestinatarioRepository } from "../database/prisma/repositories/prisma-destinatario.repository"
import { CreateDestinatarioUseCase } from "../../application/use-cases/create-destinatario.usecase";
import { CreateDestinatarioController } from "../http/controllers/create-destinatario.controller";
import { prisma } from "../database/prisma/client";

export function createDestinatarioFactory(): CreateDestinatarioController {
    const encrypter = new BcryptHasher();

    const repository = new PrismaDestinatarioRepository(prisma);
    const useCase = new CreateDestinatarioUseCase(repository, encrypter);
    const controller = new CreateDestinatarioController(useCase);

    return controller;
}