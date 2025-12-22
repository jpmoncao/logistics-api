import { Destinatario } from "../entities/destinatario.entity.js";

export interface DestinatarioRepository {
    create(destinatario: Destinatario): Promise<void>,
    findById(id: string): Promise<Destinatario | null>,
    findByEmail(email: string): Promise<Destinatario | null>,
    findByCPF(cpf: string): Promise<Destinatario | null>,
    findByTelefone(telefone: string): Promise<Destinatario | null>,
    save(destinatario: Destinatario): Promise<void>
}