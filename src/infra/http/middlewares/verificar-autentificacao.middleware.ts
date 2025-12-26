import z from "zod";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../../core/types/user-role";
import { InvalidTokenError } from "../../../core/errors/invalid-token";

import { JwtEncrypter } from '../../cryptography/jwt-encrypter';

interface JwtTokenPayload extends JwtPayload {
    sub: string;
    role?: UserRole;
}

const JwtTokenParser = z.object({
    sub: z.string(),
    role: z.enum(UserRole).optional()
});

const verificarAutentificacaoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization)
        throw new InvalidTokenError();

    const token = authorization.split('Bearer ')[1];
    if (!token)
        throw new InvalidTokenError();

    try {
        const encrypter = new JwtEncrypter();
        const payload = await encrypter.decrypt<JwtTokenPayload>(token);

        if (!payload)
            throw new InvalidTokenError(token);

        const { sub, role } = JwtTokenParser.parse(payload);

        req.user = { id: sub, role };
    } catch (error) {
        throw new InvalidTokenError(token);
    }

    next();
}

export { verificarAutentificacaoMiddleware };
