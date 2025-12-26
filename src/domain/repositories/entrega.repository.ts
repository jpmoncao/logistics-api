import { Entrega } from "../aggregate/entrega.entity";

export interface EntregaRepository {
    create(entrega: Entrega): Promise<void>;
    findById(id: string): Promise<Entrega | null>;
    findAllByEntregadorId(entregadorId: string): Promise<Entrega[]>;
    findManyByIds(ids: string[]): Promise<Entrega[]>;
    save(entrega: Entrega): Promise<void>;
    saveMany(entregas: Entrega[]): Promise<void>;
}

export interface EntregaCacheRepository {
    findAllByEntregadorId(entregadorId: string): Promise<Entrega[] | null>;
    saveManyByEntregadorId(entregadorId: string, entregas: Entrega[]): Promise<void>;
    clearByEntregadorId(entregadorid: string): Promise<void>;
}