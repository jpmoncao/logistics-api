import { PrismaClient } from "@prisma/client";
import { EntregadorRepository } from "../../../../domain/repositories/entregador.repository";
import { Entregador } from "../../../../domain/entities/entregador.entity";
import { PrismaEntregadorMapper } from "../mappers/prisma-entregador.mapper";

export class PrismaEntregadorRepository implements EntregadorRepository {
    constructor(private prisma: PrismaClient) { }

    async create(entregador: Entregador): Promise<void> {
        const data = PrismaEntregadorMapper.toPersistence(entregador);

        await this.prisma.entregador.create({ data });
    }

    async findById(id: string): Promise<Entregador | null> {
        const raw = await this.prisma.entregador.findUnique({
            where: { id }
        });

        if (!raw) return null;

        return PrismaEntregadorMapper.toDomain(raw);
    }

    async findByEmail(email: string): Promise<Entregador | null> {
        const raw = await this.prisma.entregador.findUnique({
            where: { email }
        });

        if (!raw) return null;

        return PrismaEntregadorMapper.toDomain(raw);
    }

    async findByCPF(cpf: string): Promise<Entregador | null> {
        const raw = await this.prisma.entregador.findUnique({
            where: { cpf }
        });

        if (!raw) return null;

        return PrismaEntregadorMapper.toDomain(raw);
    }

    async save(entregador: Entregador): Promise<void> {
        const data = PrismaEntregadorMapper.toPersistence(entregador);

        await this.prisma.entregador.update({
            where: { id: entregador.id },
            data
        });
    }
}