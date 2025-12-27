import { BuscarEntregasProximasUseCase } from "../../application/use-cases/buscar-entregas-proximas.usecase";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository";
import { PrismaEntregadorRepository } from "../database/prisma/repositories/prisma-entregador.repository";
import { BuscarEntregasProximasController } from "../http/controllers/buscar-entregas-proximas.controller";
import { prisma } from "../database/prisma/client";
import { RedisCacheProvider } from "../providers/redis-cache.provider";
import { RedisEntregaRepository } from "../database/redis/repositories/redis-entregas.repository";
import { BuscarEntregasProximasProxy } from "../../application/proxies/buscar-entregas-proximas.proxy";

export function buscarEntregasProximasFactory(): BuscarEntregasProximasController {
    // DB Repositories
    const entregadorRepository = new PrismaEntregadorRepository(prisma);
    const entregaRepository = new PrismaEntregaRepository(prisma);

    // Cache Repository
    const cacheProvider = new RedisCacheProvider();
    const entregaCacheRepository = new RedisEntregaRepository(cacheProvider);

    const realUseCase = new BuscarEntregasProximasUseCase(entregaRepository);
    const proxy = new BuscarEntregasProximasProxy(realUseCase, entregadorRepository, entregaCacheRepository)

    const controller = new BuscarEntregasProximasController(proxy);

    return controller;
}