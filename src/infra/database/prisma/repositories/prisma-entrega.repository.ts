import { PrismaClient } from "@prisma/client";
import { EntregaRepository } from "../../../../domain/repositories/entrega.repository";
import { Entrega } from "../../../../domain/aggregate/entrega.entity";
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

    async findManyByIds(ids: string[]): Promise<Entrega[]> {
        const raws = await this.prisma.entrega.findMany({
            where: { id: { in: ids } },
            include: { movimentacoes: true }
        });

        return raws.map(PrismaEntregaMapper.toDomain);
    }

    async saveMany(entregas: Entrega[]): Promise<void> {
        const transactions = entregas.flatMap(entrega => {
            const data = PrismaEntregaMapper.toPersistence(entrega);

            return [
                this.prisma.movimentacao.deleteMany({
                    where: { entregaId: entrega.id }
                }),

                this.prisma.entrega.update({
                    where: { id: entrega.id },
                    data
                })
            ];
        });

        await this.prisma.$transaction(transactions);
    }

    async findAllByEntregadorId(entregadorId: string): Promise<Entrega[]> {
        const raws = await this.prisma.entrega.findMany({
            where: { entregadorId, status: "CAMINHO" },
            include: { movimentacoes: true }
        });

        return raws.map(PrismaEntregaMapper.toDomain);
    }
}