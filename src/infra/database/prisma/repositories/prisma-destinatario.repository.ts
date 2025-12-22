import { PrismaClient } from "@prisma/client";
import { DestinatarioRepository } from "../../../../domain/repositories/destinatario.repository";
import { Destinatario } from "../../../../domain/entities/destinatario.entity";
import { PrismaDestinatarioMapper } from "../mappers/prisma-destinatario.mapper";

export class PrismaDestinatarioRepository implements DestinatarioRepository {
    constructor(private prisma: PrismaClient) { }

    async create(destinatario: Destinatario): Promise<void> {
        const data = PrismaDestinatarioMapper.toPersistence(destinatario);

        await this.prisma.destinatario.create({ data });
    }

    async findById(id: string): Promise<Destinatario | null> {
        const raw = await this.prisma.destinatario.findUnique({
            where: { id },
            include: { pessoa: true }
        });

        if (!raw) return null;

        return PrismaDestinatarioMapper.toDomain(raw);
    }

    async findByEmail(email: string): Promise<Destinatario | null> {
        const raw = await this.prisma.destinatario.findFirst({
            where: { email },
            include: { pessoa: true }
        });

        if (!raw) return null;

        return PrismaDestinatarioMapper.toDomain(raw);
    }

    async findByCPF(cpf: string): Promise<Destinatario | null> {
        const raw = await this.prisma.destinatario.findFirst({
            where: { pessoa: { cpf } },
            include: { pessoa: true }
        });

        if (!raw) return null;

        return PrismaDestinatarioMapper.toDomain(raw);
    }

    async findByTelefone(telefone: string): Promise<Destinatario | null> {
        const raw = await this.prisma.destinatario.findFirst({
            where: { pessoa: { telefone } },
            include: { pessoa: true }
        });

        if (!raw) return null;

        return PrismaDestinatarioMapper.toDomain(raw);
    }

    async save(destinatario: Destinatario): Promise<void> {
        await this.prisma.destinatario.update({
            where: { id: destinatario.id.toString() },
            data: {
                email: destinatario.email,
                senha: destinatario.senha,
                pessoa: {
                    update: {
                        nome: destinatario.nome,
                        telefone: destinatario.telefone,
                        cpf: destinatario.cpf,
                    }
                }
            }
        });
    }
}