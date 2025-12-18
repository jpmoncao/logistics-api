export abstract class Comparer {
    abstract compare<T>(plain: string, hash: string): Promise<boolean | T>;
}
