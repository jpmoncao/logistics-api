import { AppError } from "./app-error";

/**
 * Token inválido (retorna 401 (Unauthorized))
 */
export class InvalidTokenError extends AppError<{ token: string }> {
    constructor(token?: string) {
        super({
            status: 401,
            title: "Invalid token for authentication",
            detail: "The token provided is not valid.",
            type: "/errors/invalid-token",
            extensionMembers: {
                token: token ?? ''
            }
        });
    }
}