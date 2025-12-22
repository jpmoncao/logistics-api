import { Pessoa, Prisma, Entregador as PrismaEntregador } from "@prisma/client";

import { Entregador } from "../../../../domain/entities/entregador.entity";

type PrismaEntregadorWithPessoa = PrismaEntregador & {
    pessoa: Pessoa;
};

export class PrismaEntregadorMapper {
    static toPersistence(entregador: Entregador): Prisma.EntregadorCreateInput {
        return {
            id: entregador.id,
            email: entregador.email,
            senha: entregador.senha,
            pessoa: {
                connectOrCreate: {
                    where: { id: entregador.id },
                    create: {
                        nome: entregador.nome,
                        cpf: entregador.cpf,
                        telefone: entregador.telefone
                    }
                }
            }
        }
    }

    static toDomain(raw: PrismaEntregadorWithPessoa): Entregador {
        const entregador = new Entregador(
            {
                email: raw.email,
                senha: raw.senha,
                nome: raw.pessoa.nome,
                cpf: raw.pessoa.cpf,
                telefone: raw.pessoa.telefone
            },
            raw.id,
        );

        return entregador;
    }
}