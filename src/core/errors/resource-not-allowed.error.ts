import { AppError } from "./app-error";

/**
 * Recurso não permitido (retorna 403 (Forbidden))
 */
export class ResourceNotAllowedError extends AppError<Record<string, any>> {
    constructor(resource: string, data?: Record<string, any>) {
        super({
            status: 403,
            title: "Resource Not Allowed",
            detail: data?.id
                ? `The "${resource.toLowerCase()}" with ID "${data.id}" was not allowed.`
                : `The requested "${resource.toLowerCase()}" was not allowed.`,
            type: "/errors/resource-not-allowed",
            extensionMembers: data
        });
    }
}