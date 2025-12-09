import { PrismaClient } from "@prisma/client";
import { EntregaRepository } from "../../../../domain/repositories/entrega.repository";
import { Entrega } from "../../../../domain/entities/entrega.entity";
import { PrismaEntregaMapper } from "../mappers/prisma-entrega.mapper";

export class PrismaEntregaRepository implements EntregaRepository {
    constructor(private prisma: PrismaClient) { }

    async create(entrega: Entrega): Promise<void> {
        const data = PrismaEntregaMapper.toPersistence(entrega);

        await this.prisma.entrega.create({ data });
    }

    async findById(id: string): Promise<Entrega | null> {
        const raw = await this.prisma.entrega.findUnique({
            where: { id },
            include: { movimentacoes: true }
        });

        if (!raw) return null;

        return PrismaEntregaMapper.toDomain(raw);
    }

    async save(entrega: Entrega): Promise<void> {
        const data = PrismaEntregaMapper.toPersistence(entrega);

        await this.prisma.$transaction([
            this.prisma.movimentacao.deleteMany({
                where: { entregaId: entrega.id }
            }),

            this.prisma.entrega.update({
                where: { id: entrega.id },
                data
            })
        ]);
    }
}