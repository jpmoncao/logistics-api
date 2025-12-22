import { BaseUseCase } from "../../core/base/usecase";
import { UserRole } from "../../core/types/user-role";
import { InvalidCredentialsError } from "../../core/errors/invalid-credentials";

import { Encrypter } from "../cryptography/encrypter";
import { Hasher } from "../cryptography/hasher";

import { DestinatarioRepository } from "../../domain/repositories/destinatario.repository";

interface AutenticarDestinatarioRequest {
    email: string;
    senha: string;
}
interface AutenticarDestinatarioResponse {
    token: string;
}

export class AutenticarDestinatarioUseCase extends BaseUseCase<AutenticarDestinatarioRequest, AutenticarDestinatarioResponse> {
    constructor(private destinatarioRepository: DestinatarioRepository, private encrypter: Encrypter, private hasher: Hasher) { super() }

    async execute(request: AutenticarDestinatarioRequest): Promise<AutenticarDestinatarioResponse> {
        const destinatario = await this.destinatarioRepository.findByEmail(request.email);
        if (!destinatario)
            throw new InvalidCredentialsError();

        const senhaValida = await this.hasher.compare(request.senha, destinatario.senha);
        if (!senhaValida)
            throw new InvalidCredentialsError();

        const token = await this.encrypter.encrypt({
            sub: destinatario.id,
            role: UserRole.DESTINATARIO
        });

        return { token };
    }
}