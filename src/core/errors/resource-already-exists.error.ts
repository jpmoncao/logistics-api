import { AppError } from "./app-error";

/**
 * Recurso já existente (retorna 409 (Conflict))
 */
export class ResourceAlreadyExistsError extends AppError {
    constructor(resource: string, data?: Record<string, any>) {
        super({
            status: 409,
            title: "Resource Already Exists",
            detail: data?.id
                ? `The "${resource.toLowerCase()}" with ID "${data.id}" already exists.`
                : `The requested "${resource.toLowerCase()}" already exists.`,
            type: "/errors/resource-already-exists",
            extensionMembers: data
        });
    }
}