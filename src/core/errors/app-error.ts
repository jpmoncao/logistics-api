export class AppError extends Error {
    public readonly status: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode: number, status?: string) {
        super(message);
        this.status = status || 'error';
        this.statusCode = statusCode;
        
        Object.setPrototypeOf(this, new.target.prototype);
    }
}