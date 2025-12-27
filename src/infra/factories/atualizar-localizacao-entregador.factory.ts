import { prisma } from "../database/prisma/client";
import { PrismaEntregaRepository } from "../database/prisma/repositories/prisma-entrega.repository"
import { AtualizarLocalizacaoEntregadorController } from "../http/controllers/atualizar-localizacao-entregador.controller";
import { AtualizarLocalizacaoEntregadorUseCase } from "../../application/use-cases/atualizar-localizacao-entregador.usecase";
import { RedisCacheProvider } from "../providers/redis-cache.provider";
import { RedisEntregaRepository } from "../database/redis/repositories/redis-entregas.repository";
import { AtualizarLocalizacaoEntregadorProxy } from "../../application/proxies/atualizar-localizacao-entregador.proxy";

export function atualizarLocalizacaoEntregadorFactory(): AtualizarLocalizacaoEntregadorController {
    // DB Repository
    const entregaRepository = new PrismaEntregaRepository(prisma);

    // Cache Repository
    const cacheProvider = new RedisCacheProvider();
    const entregaCacheRepository = new RedisEntregaRepository(cacheProvider);

    const realUseCase = new AtualizarLocalizacaoEntregadorUseCase(entregaRepository);
    const proxy = new AtualizarLocalizacaoEntregadorProxy(realUseCase, entregaCacheRepository)

    const controller = new AtualizarLocalizacaoEntregadorController(proxy);
    return controller;
}