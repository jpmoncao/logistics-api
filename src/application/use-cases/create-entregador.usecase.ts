import { BaseUseCase } from "../../core/base/usecase";
import { Hasher } from "../cryptography/hasher";

import { EntregadorRepository } from "../../domain/repositories/entregador.repository";
import { Entregador } from "../../domain/entities/entregador.entity";

import { ResourceAlreadyExistsError } from "../../core/errors/resource-already-exists.error";

interface CreateEntregadorRequest {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    senha: string;
}

interface CreateEntregadorResponse {
    entregadorId: string;
}

export class CreateEntregadorUseCase extends BaseUseCase<CreateEntregadorRequest, CreateEntregadorResponse> {
    constructor(private entregadorRepository: EntregadorRepository, private hasher: Hasher) { super() }

    async execute({ nome, cpf, telefone, email, senha }: CreateEntregadorRequest): Promise<CreateEntregadorResponse> {
        const entregadorEmailAlreadyExists = await this.entregadorRepository.findByEmail(email);
        if (entregadorEmailAlreadyExists)
            throw new ResourceAlreadyExistsError('Entregador', { email });

        const entregadorCPFAlreadyExists = await this.entregadorRepository.findByCPF(cpf);
        if (entregadorCPFAlreadyExists)
            throw new ResourceAlreadyExistsError('Entregador', { cpf });

        const entregadorTelefoneAlreadyExists = await this.entregadorRepository.findByTelefone(telefone);
        if (entregadorTelefoneAlreadyExists)
            throw new ResourceAlreadyExistsError('Entregador', { telefone });

        const passwordHash = await this.hasher.hash(senha);

        const entregador = new Entregador({
            nome,
            cpf,
            telefone,
            email,
            senha: passwordHash
        });

        await this.entregadorRepository.create(entregador);

        return { entregadorId: entregador.id }
    }
}