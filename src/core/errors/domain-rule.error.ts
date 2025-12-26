import { AppError } from "./app-error";

/**
 * Regras de negócio violadas (retorna 400 (Bad Request))
 */
export class DomainRuleError extends AppError {
    constructor(message: string) {
        super({
            status: 400,
            title: "Domain rule error",
            detail: message,
            type: "/errors/generic-domain-rule",
        });
    }
}