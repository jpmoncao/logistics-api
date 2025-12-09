import { Entrega } from "../entities/entrega.entity";

export interface EntregaRepository {
    create(entrega: Entrega): Promise<void>,
    findById(id: string): Promise<Entrega | null>,
    save(entrega: Entrega): Promise<void>
}