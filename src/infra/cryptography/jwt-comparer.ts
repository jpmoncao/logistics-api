import jwt, { JwtPayload } from 'jsonwebtoken';
import { Comparer } from '../../application/cryptography/comparer';

interface JwtTokenPayload extends JwtPayload {
    sub: string;
    role?: string;
}

export class JwtComparer implements Comparer {
    async compare<JwtTokenPayload>(plain: string, hash: string): Promise<boolean | JwtTokenPayload> {
        return jwt.verify(plain, hash) as JwtTokenPayload;
    }
}