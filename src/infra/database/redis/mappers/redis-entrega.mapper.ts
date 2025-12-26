import { Entrega } from "../../../../domain/aggregate/entrega.entity";
import { RedisEntregaDTO } from "../dtos/redis-entrega.dto";
import { StatusEntrega } from "../../../../domain/types/entrega";
import { Coordenada } from "../../../../domain/value-objects/coordenada.value-object";
import { Movimentacao } from "../../../../domain/entities/movimentacao.entity";

export class RedisEntregaMapper {
    static toPersistence(entrega: Entrega): RedisEntregaDTO {
        return {
            id: entrega.id,
            status: entrega.status,
            destinatarioId: entrega.destinatarioId,
            entregadorId: entrega.entregadorId,
            urlComprovanteEntrega: entrega.urlComprovanteEntrega,
            latitude_destino: entrega.destino.latitude,
            longitude_destino: entrega.destino.longitude,
            latitude_atual: entrega.localizacaoAtual?.latitude,
            longitude_atual: entrega.localizacaoAtual?.longitude,
            movimentacoes: entrega.movimentacoes.map(mov => ({
                descricao: mov.descricao,
                data: mov.data.toISOString(),
                latitude: mov.coordenada?.latitude,
                longitude: mov.coordenada?.longitude
            }))
        };
    }

    // Recebe o OBJETO DTO, não uma string
    static toDomain(dto: RedisEntregaDTO): Entrega {
        return new Entrega({
            status: dto.status as StatusEntrega,
            destinatarioId: dto.destinatarioId,
            entregadorId: dto.entregadorId,
            urlComprovanteEntrega: dto.urlComprovanteEntrega,

            destino: new Coordenada(dto.latitude_destino, dto.longitude_destino),

            localizacaoAtual: (dto.latitude_atual && dto.longitude_atual)
                ? new Coordenada(dto.latitude_atual, dto.longitude_atual)
                : undefined,

            movimentacoes: dto.movimentacoes.map(mov => new Movimentacao({
                descricao: mov.descricao,
                data: new Date(mov.data),
                coordenada: (mov.latitude && mov.longitude)
                    ? new Coordenada(mov.latitude, mov.longitude)
                    : undefined
            }))
        }, dto.id);
    }
}