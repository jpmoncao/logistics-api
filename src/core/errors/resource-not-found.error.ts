import { AppError } from "./app-error";

/**
 * Recurso não encontrado (retorna 404 (Not Found))
 */
export class ResourceNotFoundError extends AppError {
    constructor(resource: string, id?: string) {
        super({
            status: 404,
            title: "Resource Not Found",
            detail: id
                ? `The "${resource.toLowerCase()}" with ID '${id}' was not found.`
                : `The requested "${resource.toLowerCase()}" was not found.`,
            type: "/errors/resource-not-found"
        });
    }
}