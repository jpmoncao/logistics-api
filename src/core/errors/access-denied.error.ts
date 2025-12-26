import { UserRole } from "../types/user-role";
import { AppError } from "./app-error";

/**
 * Acesso negado ao usuário (retorna 403 (Forbidden))
 */
export class AccessDeniedError extends AppError<{ currentRole: UserRole }> {
    constructor(userRole: UserRole, allowedRole: UserRole) {
        super({
            status: 403,
            title: "Access Denied",
            detail: `The logged-in user does not have access as ${allowedRole.toLowerCase()}.`,
            type: "/errors/user-not-have-access",
            extensionMembers: {
                currentRole: userRole
            }
        });
    }
}