import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { DomainEventDispatcher } from "../../core/events/dispatcher";
import { enviarEmailEntregaConcluidaHandler } from "../../application/handlers/enviar-email-entrega-concluida.handler";
import { ConcluirEntregaUseCase } from "../../application/use-cases/concluir-entrega.usecase";
import { ConcluirEntregaController } from "../http/controllers/concluir-entrega.controller";
import { EntregaConcluidaEvent } from "../../domain/events/entrega-concluida.event";

export function concluirEntregaFactory(): ConcluirEntregaController {
    const repository = new PrismaEntregaRepository(prisma);

    const dispatcher = new DomainEventDispatcher();
    dispatcher.register(EntregaConcluidaEvent.eventName, enviarEmailEntregaConcluidaHandler)

    const useCase = new ConcluirEntregaUseCase(repository, dispatcher);
    const controller = new ConcluirEntregaController(useCase);

    return controller;
}