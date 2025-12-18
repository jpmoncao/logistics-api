import { Entregador } from "../entities/entregador.entity";

export interface EntregadorRepository {
    create(entregador: Entregador): Promise<void>,
    findById(id: string): Promise<Entregador | null>,
    save(entregador: Entregador): Promise<void>
}