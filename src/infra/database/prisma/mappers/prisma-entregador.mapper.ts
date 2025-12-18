import { Prisma, Entregador as PrismaEntregador } from "@prisma/client";

import { Entregador } from "../../../../domain/entities/entregador.entity";

export class PrismaEntregadorMapper {
    static toPersistence(entregador: Entregador): Prisma.EntregadorCreateInput {
        return {
            id: entregador.id,
            nome: entregador.nome,
            cpf: entregador.cpf,
            telefone: entregador.telefone,
            email: entregador.email,
            senha: entregador.senha
        }
    }

    static toDomain(raw: PrismaEntregador): Entregador {

        const entregador = new Entregador(
            {
                nome: raw.nome,
                cpf: raw.cpf,
                telefone: raw.telefone,
                email: raw.email,
                senha: raw.senha
            },
            raw.id,
        );

        return entregador;
    }
}