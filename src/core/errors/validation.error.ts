import { AppError } from "./app-error";

interface ValidationIssue {
    field: string;
    message: string;
}

interface ValidationExtensions {
    errors: ValidationIssue[];
}

/**
 * Dados inválidos na requisição (retorna 400 (Bad Request))
 */
export class ValidationError extends AppError<ValidationExtensions> {
    constructor(errors: ValidationIssue[]) {
        super({
            status: 400,
            title: 'Validation Error',
            detail: 'The request contains invalid parameters.',
            type: "/errors/validation-error",
            extensionMembers: {
                errors
            }
        });
    }
}