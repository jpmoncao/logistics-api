import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import { BcryptHasher } from "../cryptography/bcrypt-hasher";
import { PrismaDestinatarioRepository } from "../database/prisma/repositories/prisma-destinatario.repository"
import { AutenticarDestinatarioController } from "../http/controllers/autenticar-destinatario.controller";
import { AutenticarDestinatarioUseCase } from "../../application/use-cases/autenticar-destinatario.usecase";
import { prisma } from "../database/prisma/client";

export function autenticarDestinatarioFactory(): AutenticarDestinatarioController {
    const encrypter = new JwtEncrypter();
    const hasher = new BcryptHasher();

    const repository = new PrismaDestinatarioRepository(prisma);
    const useCase = new AutenticarDestinatarioUseCase(repository, encrypter, hasher);
    const controller = new AutenticarDestinatarioController(useCase);

    return controller;
}