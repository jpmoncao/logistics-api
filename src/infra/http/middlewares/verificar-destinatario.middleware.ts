import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../../core/types/user-role";
import { AccessDeniedError } from "../../../core/errors/access-denied.error";

const verificarDestinatarioMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.DESTINATARIO)
        throw new AccessDeniedError(req.user.role, UserRole.DESTINATARIO)

    next();
}

export { verificarDestinatarioMiddleware };
