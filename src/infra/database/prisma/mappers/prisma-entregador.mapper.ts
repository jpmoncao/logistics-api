import { Pessoa, Prisma, Entregador as PrismaEntregador } from "@prisma/client";

import { Entregador } from "../../../../domain/entities/entregador.entity";

type PrismaEntregadorWithPessoa = PrismaEntregador & {
    pessoa: Pessoa;
};

export class PrismaEntregadorMapper {
    static toPersistence(entregador: Entregador): Prisma.EntregadorCreateInput {
        return {
            id: entregador.id,
            pessoa: {
                connectOrCreate: {
                    where: { id: entregador.id },
                    create: {
                        nome: entregador.nome,
                        cpf: entregador.cpf,
                        telefone: entregador.telefone,
                        email: entregador.email,
                        senha: entregador.senha
                    }
                }
            }
        }
    }

    static toDomain(raw: PrismaEntregadorWithPessoa): Entregador {
        const entregador = new Entregador(
            {
                nome: raw.pessoa.nome,
                cpf: raw.pessoa.cpf,
                telefone: raw.pessoa.telefone,
                email: raw.pessoa.email,
                senha: raw.pessoa.senha
            },
            raw.id,
        );

        return entregador;
    }
}