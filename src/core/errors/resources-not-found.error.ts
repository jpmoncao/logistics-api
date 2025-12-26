import { AppError } from "./app-error";

/**
 * Recursos não encontrados (retorna 404 (Not Found))
 */
export class ResourcesNotFoundError extends AppError {
    constructor(resource: string, ids?: string[]) {
        super({
            status: 404,
            title: "Resources Not Found",
            detail: ids
                ? `The ${resource.toLowerCase()} with IDs [${ids.join(',')}] were not found.`
                : `The requested ${resource.toLowerCase()} were not found.`,
            type: "/errors/resources-not-found"
        });
    }
}