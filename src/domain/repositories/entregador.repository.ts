import { Entregador } from "../entities/entregador.entity";

export interface EntregadorRepository {
    create(entregador: Entregador): Promise<void>,
    findById(id: string): Promise<Entregador | null>,
    findByEmail(email: string): Promise<Entregador | null>,
    findByCPF(cpf: string): Promise<Entregador | null>,
    save(entregador: Entregador): Promise<void>
}