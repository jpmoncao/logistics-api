import jwt, { SignOptions } from 'jsonwebtoken';
import { Encrypter } from '../../application/cryptography/encrypter';

export class JwtEncrypter implements Encrypter {
    private secret = process.env.API_JWT_SECRET || 'default_secret';
    private expiresIn = process.env.API_JWT_EXPIRES_IN || '1d';

    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn
        } as SignOptions);
    }
}