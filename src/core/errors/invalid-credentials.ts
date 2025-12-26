import { AppError } from "./app-error";

/**
 * Credenciais inválidas (retorna 401 (Unauthorized))
 */
export class InvalidCredentialsError extends AppError {
    constructor() {
        super({
            status: 401,
            title: "Unauthorized due to invalid credentials",
            detail: "The credentials provided are not valid.",
            type: "/errors/invalid-credentials",
        });
    }
}