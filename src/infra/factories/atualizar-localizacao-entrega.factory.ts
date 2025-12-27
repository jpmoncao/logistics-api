import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { AtualizarLocalizacaoEntregaUseCase } from "../../application/use-cases/atualizar-localizacao-entrega.usecase";
import { AtualizarLocalizacaoEntregaController } from "../http/controllers/atualizar-localizacao-entrega.controller";
import { RedisCacheProvider } from "../providers/redis-cache.provider";
import { RedisEntregaRepository } from "../database/redis/repositories/redis-entregas.repository";
import { AtualizarLocalizacaoEntregaProxy } from "../../application/proxies/atualizar-localizacao-entrega.proxy";

export function atualizarLocalizacaoEntregaFactory(): AtualizarLocalizacaoEntregaController {
    // DB Repository
    const entregaRepository = new PrismaEntregaRepository(prisma);

    // Cache Repository
    const cacheProvider = new RedisCacheProvider();
    const entregaCacheRepository = new RedisEntregaRepository(cacheProvider);

    const realUseCase = new AtualizarLocalizacaoEntregaUseCase(entregaRepository);
    const proxy = new AtualizarLocalizacaoEntregaProxy(realUseCase, entregaCacheRepository)

    const controller = new AtualizarLocalizacaoEntregaController(proxy);

    return controller;
}