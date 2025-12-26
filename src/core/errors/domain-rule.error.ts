import { AppError } from "./app-error";

/**
 * Regras de negócio violadas (retorna 400 (Bad Request))
 */
export class DomainRuleError extends AppError {
    constructor(title: string = "Domain rule error", message: string = 'There was a business rule error.', type: string = 'generic-domain-rule', extensionMembers?: Record<string, any>) {
        super({
            status: 400,
            title,
            detail: message,
            type: "/errors/" + type,
            extensionMembers
        });
    }
}