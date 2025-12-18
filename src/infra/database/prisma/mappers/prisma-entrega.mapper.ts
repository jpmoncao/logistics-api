import { Prisma, Entrega as PrismaEntrega, StatusEntrega as PrismaStatusEntrega, Movimentacao as PrismaMovimentacao } from "@prisma/client";

import { Movimentacao } from "../../../../domain/entities/movimentacao.entity";
import { Entrega } from "../../../../domain/entities/entrega.entity";

import { StatusEntrega } from "../../../../domain/types/entrega";
import { Coordenada } from "../../../../domain/value-objects/coordenada.value-object";

type PrismaEntregaDetalhada = PrismaEntrega & {
    movimentacoes: PrismaMovimentacao[];
};

export class PrismaEntregaMapper {
    static toPersistence(entrega: Entrega): Prisma.EntregaCreateInput {
        return {
            id: entrega.id,
            status: entrega.status as unknown as PrismaStatusEntrega,
            latitude_destino: entrega.destino.latitude,
            longitude_destino: entrega.destino.longitude,
            movimentacoes: {
                create: entrega.movimentacoes.map((movimentacao: Movimentacao) => {
                    return {
                        data: movimentacao.data,
                        descricao: movimentacao.descricao,
                        latitude: movimentacao.coordenada?.latitude,
                        longitude: movimentacao.coordenada?.longitude
                    }
                })
            }
        }
    }

    static toDomain(raw: PrismaEntregaDetalhada): Entrega {
        if (!Object.values(StatusEntrega).includes(raw.status as any)) {
            throw new Error(`Status inválido: ${raw.status}`);
        }

        const entrega = new Entrega(
            {
                status: raw.status as unknown as StatusEntrega,
                destino: new Coordenada(raw.latitude_destino, raw.longitude_destino),
                movimentacoes: raw.movimentacoes.map(
                    (movRaw) => new Movimentacao({
                        descricao: movRaw.descricao,
                        data: movRaw.data,
                        coordenada: (movRaw.latitude && movRaw.longitude) ? new Coordenada(movRaw.latitude, movRaw.longitude) : undefined
                    })
                )
            },
            raw.id,
        );

        return entrega;
    }
}