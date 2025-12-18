import { AppError } from "./app-error";

/**
 * Recurso não permitido (retorna 403 (Forbidden))
 */
export class ResourceNotAllowedError extends AppError {
    constructor(resourceName: string = 'Recurso') {
        super(`${resourceName} não tem permissão para está ação.`, 403, 'resource_not_allowed_error');
    }
}