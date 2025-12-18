import { hash } from 'bcryptjs';
import { Encrypter } from '../../application/cryptography/encrypter';

export class BcryptEncrypter implements Encrypter {
    private HASH_SALT_LENGTH = 8;

    async encrypt<T>(payload: T): Promise<string> {
        return hash(payload as string, this.HASH_SALT_LENGTH);
    }
}