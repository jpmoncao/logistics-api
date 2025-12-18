import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { PrismaEntregadorRepository } from "../database/prisma/repositories/prisma-entregador.repository"
import { DomainEventDispatcher } from "../../core/events/dispatcher";
import { enviarEmailDespachoHandler } from "../../application/handlers/enviar-email-despacho.handler";
import { DespacharEntregaUseCase } from "../../application/use-cases/despachar-entrega.usecase";
import { DespacharEntregaController } from "../http/controllers/despachar-entrega.controller";
import { EntregaDespachadaEvent } from "../../domain/events/entrega-despachada.event";

export function despacharEntregaFactory(): DespacharEntregaController {
    const entregaRepository = new PrismaEntregaRepository(prisma);
    const entregadorRepository = new PrismaEntregadorRepository(prisma);

    const dispatcher = new DomainEventDispatcher();
    dispatcher.register(EntregaDespachadaEvent.eventName, enviarEmailDespachoHandler)

    const useCase = new DespacharEntregaUseCase(entregaRepository, entregadorRepository, dispatcher);
    const controller = new DespacharEntregaController(useCase);

    return controller;
}