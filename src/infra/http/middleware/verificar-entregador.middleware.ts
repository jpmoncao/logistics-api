import z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../../core/types/user-role";

import { JwtDecrypter } from '../../cryptography/jwt-decrypter';

interface JwtTokenPayload extends JwtPayload {
    sub: string;
    role?: UserRole;
}

const JwtTokenParser = z.object({
    sub: z.string(),
    role: z.enum(UserRole).optional()
});

const INVALID_TOKEN_MESSAGE = 'Token de autenticação inválido.';

const verificarEntregadorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: INVALID_TOKEN_MESSAGE });

    const token = authorization.split('Bearer ')[1];
    if (!token)
        return res.status(401).json({ message: INVALID_TOKEN_MESSAGE });

    try {
        const decrypter = new JwtDecrypter();
        const payload = await decrypter.decrypt<JwtTokenPayload>(token);

        if (!payload)
            return res.status(401).json({ message: INVALID_TOKEN_MESSAGE });

        const { sub, role } = JwtTokenParser.parse(payload);

        req.user = { id: sub, role };
    } catch (error) {
        return res.status(401).json({ message: INVALID_TOKEN_MESSAGE });
    }

    next();
}

export { verificarEntregadorMiddleware };
