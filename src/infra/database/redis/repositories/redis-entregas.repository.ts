import { Entrega } from "../../../../domain/aggregate/entrega.entity";
import { EntregaCacheRepository } from "../../../../domain/repositories/entrega.repository";
import { RedisCacheProvider } from "../../../providers/redis-cache.provider";
import { RedisEntregaMapper } from "../mappers/redis-entrega.mapper";
import { RedisEntregaDTO } from "../dtos/redis-entrega.dto";

export class RedisEntregaRepository implements EntregaCacheRepository {

    constructor(private provider: RedisCacheProvider) { }

    async findAllByEntregadorId(entregadorId: string): Promise<Entrega[] | null> {
        const key = `entregas:entregador:${entregadorId}`;

        const cachedString = await this.provider.get<string>(key);
        if (!cachedString) return null;

        const cachedData = JSON.parse(cachedString) as RedisEntregaDTO[];

        return cachedData.map(dto => RedisEntregaMapper.toDomain(dto));
    }

    async saveManyByEntregadorId(entregadorId: string, entregas: Entrega[]): Promise<void> {
        const key = `entregas:entregador:${entregadorId}`;

        const dataToSave = entregas.map(entrega => RedisEntregaMapper.toPersistence(entrega));

        const stringData = JSON.stringify(dataToSave);

        await this.provider.save(key, stringData, 60);
    }

    async clearByEntregadorId(entregadorId: string) {
        const key = `entregas:entregador:${entregadorId}`;

        await this.provider.invalidate(key);
    }
}