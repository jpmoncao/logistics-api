import { Entrega } from "../entities/entrega.entity";

export interface EntregaRepository {
    create(entrega: Entrega): Promise<void>;
    findById(id: string): Promise<Entrega | null>;
    findAllByEntregadorId(entregadorId: string): Promise<Entrega[]>;
    findManyByIds(ids: string[]): Promise<Entrega[]>;
    save(entrega: Entrega): Promise<void>;
    saveMany(entregas: Entrega[]): Promise<void>;
}