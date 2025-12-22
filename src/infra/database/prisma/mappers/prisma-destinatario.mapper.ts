import { Pessoa as PrismaPessoa, Prisma, Destinatario as PrismaDestinatario } from "@prisma/client";

import { Destinatario } from "../../../../domain/entities/destinatario.entity";

type PrismaDestinatarioWithPessoa = PrismaDestinatario & {
    pessoa: PrismaPessoa;
};

export class PrismaDestinatarioMapper {
    static toPersistence(destinatario: Destinatario): Prisma.DestinatarioCreateInput {
        return {
            id: destinatario.id,
            email: destinatario.email,
            senha: destinatario.senha,
            pessoa: {
                connectOrCreate: {
                    where: { cpf: destinatario.cpf },
                    create: {
                        nome: destinatario.nome,
                        cpf: destinatario.cpf,
                        telefone: destinatario.telefone,
                    }
                }
            }
        };
    }

    static toDomain(raw: PrismaDestinatarioWithPessoa): Destinatario {
        const destinatario = new Destinatario(
            {
                email: raw.email,
                senha: raw.senha,
                nome: raw.pessoa.nome,
                cpf: raw.pessoa.cpf,
                telefone: raw.pessoa.telefone,
            },
            raw.id
        );

        return destinatario;
    }
}