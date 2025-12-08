import { Entrega } from "../entities/entrega";

export interface EntregaRepository {
    create(entrega: Entrega): Promise<void>,
    findById(id: string): Promise<Entrega | null>,
    save(entrega: Entrega): Promise<void>
}