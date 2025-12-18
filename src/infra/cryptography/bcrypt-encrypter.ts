import { hash } from 'bcryptjs';
import { Encrypter } from '../../application/cryptography/encrypter';

export class BcryptEncrypter implements Encrypter {
    private HASH_SALT_LENGTH = 8;

    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return hash(JSON.stringify(payload), this.HASH_SALT_LENGTH);
    }
}