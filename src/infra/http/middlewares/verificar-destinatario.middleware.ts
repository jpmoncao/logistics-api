import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../../core/types/user-role";

import { verificarAutentificacaoMiddleware } from "./verificar-autentificacao.middleware";

const verificarDestinatarioMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    await verificarAutentificacaoMiddleware(req, res, () => { });

    if (req.user?.role !== UserRole.DESTINATARIO)
        return res.status(403).json({ message: "Acesso restrito ao usuário." });

    next();
}

export { verificarDestinatarioMiddleware };
