import { compare } from 'bcryptjs';
import { Comparer } from '../../application/cryptography/comparer';

export class BcryptComparer implements Comparer {
    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash);
    }
}