import { Prisma, Entrega as PrismaEntrega, StatusEntrega as PrismaStatusEntrega, Movimentacao as PrismaMovimentacao } from "@prisma/client";

import { Movimentacao } from "../../../../domain/entities/movimentacao.entity";
import { Entrega } from "../../../../domain/entities/entrega.entity";

import { StatusEntrega } from "../../../../domain/types/entrega";

type PrismaEntregaDetalhada = PrismaEntrega & {
    movimentacoes: PrismaMovimentacao[];
};

export class PrismaEntregaMapper {
    static toPersistence(entrega: Entrega): Prisma.EntregaCreateInput {
        return {
            id: entrega.id,
            status: entrega.status as unknown as PrismaStatusEntrega,
            movimentacoes: {
                create: entrega.movimentacoes.map((movimentacao: Movimentacao) => {
                    return {
                        data: movimentacao.data,
                        descricao: movimentacao.descricao
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
                movimentacoes: raw.movimentacoes.map(
                    (movRaw) => new Movimentacao(movRaw.descricao, movRaw.data)
                )
            },
            raw.id,
        );

        return entrega;
    }
}