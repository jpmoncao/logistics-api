import { BaseUseCase } from "../../core/base/usecase";
import { Hasher } from "../cryptography/hasher";

import { DestinatarioRepository } from "../../domain/repositories/destinatario.repository";
import { Destinatario } from "../../domain/entities/destinatario.entity";

import { ResourceAlreadyExistsError } from "../../core/errors/resource-already-exists.error";

interface CreateDestinatarioRequest {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    senha: string;
}

interface CreateDestinatarioResponse {
    destinatarioId: string;
}

export class CreateDestinatarioUseCase extends BaseUseCase<CreateDestinatarioRequest, CreateDestinatarioResponse> {
    constructor(private destinatarioRepository: DestinatarioRepository, private hasher: Hasher) { super() }

    async execute({ nome, cpf, telefone, email, senha }: CreateDestinatarioRequest): Promise<CreateDestinatarioResponse> {
        const destinatarioEmailAlreadyExists = await this.destinatarioRepository.findByEmail(email);
        if (destinatarioEmailAlreadyExists)
            throw new ResourceAlreadyExistsError('Destinatario', { email });

        const destinatarioCPFAlreadyExists = await this.destinatarioRepository.findByCPF(cpf);
        if (destinatarioCPFAlreadyExists)
            throw new ResourceAlreadyExistsError('Destinatario', { cpf });

        const destinatarioTelefoneAlreadyExists = await this.destinatarioRepository.findByTelefone(telefone);
        if (destinatarioTelefoneAlreadyExists)
            throw new ResourceAlreadyExistsError('Destinatario', { telefone });

        const passwordHash = await this.hasher.hash(senha);

        const destinatario = new Destinatario({
            nome,
            cpf,
            telefone,
            email,
            senha: passwordHash
        });

        await this.destinatarioRepository.create(destinatario);

        return { destinatarioId: destinatario.id }
    }
}