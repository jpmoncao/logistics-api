import { Pessoa, Prisma, Destinatario as PrismaDestinatario } from "@prisma/client";

import { Destinatario } from "../../../../domain/entities/destinatario.entity";

type PrismaDestinatarioWithPessoa = PrismaDestinatario & {
    pessoa: Pessoa;
};

export class PrismaDestinatarioMapper {
    static toPersistence(destinatario: Destinatario): Prisma.DestinatarioCreateInput {
        return {
            id: destinatario.id,
            pessoa: {
                connectOrCreate: {
                    where: { id: destinatario.id },
                    create: {
                        nome: destinatario.nome,
                        cpf: destinatario.cpf,
                        telefone: destinatario.telefone,
                        email: destinatario.email,
                        senha: destinatario.senha
                    }
                }
            }
        }
    }

    static toDomain(raw: PrismaDestinatarioWithPessoa): Destinatario {
        const destinatario = new Destinatario(
            {
                nome: raw.pessoa.nome,
                cpf: raw.pessoa.cpf,
                telefone: raw.pessoa.telefone,
                email: raw.pessoa.email,
                senha: raw.pessoa.senha
            },
            raw.id,
        );

        return destinatario;
    }
}