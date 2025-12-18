import { BaseUseCase } from "../../core/base/usecase";
import { Encrypter } from "../cryptography/encrypter";

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
    constructor(private entregadorRepository: EntregadorRepository, private encrypter: Encrypter) { super() }

    async execute({ nome, cpf, telefone, email, senha }: CreateEntregadorRequest): Promise<CreateEntregadorResponse> {
        const entregadorEmailAlreadyExists = await this.entregadorRepository.findByEmail(email);
        if (entregadorEmailAlreadyExists)
            throw new ResourceAlreadyExistsError('Entregador');

        const entregadorCPFAlreadyExists = await this.entregadorRepository.findByCPF(cpf);
        if (entregadorCPFAlreadyExists)
            throw new ResourceAlreadyExistsError('Entregador');

        const passwordHash = await this.encrypter.hash(senha);

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