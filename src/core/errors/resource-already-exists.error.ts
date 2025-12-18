import { AppError } from "./app-error";

/**
 * Recurso já existente (retorna 409 (Conflict))
 */
export class ResourceAlreadyExistsError extends AppError {
    constructor(resourceName: string = 'Recurso') {
        super(`${resourceName} já existe.`, 409, 'resource_already_exists_error');
    }
}