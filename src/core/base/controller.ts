import { Request, Response } from 'express';
import { ZodError } from 'zod';

import HttpStatusCode from '../../infra/http/utils/status-code';

export abstract class BaseController {
    abstract handle(req: Request, res: Response): Promise<Response | void>;

    protected analyzeError(res: Response, error: unknown) {
        let errorMessage = 'Unknown error';
        if (error instanceof ZodError)
            errorMessage = JSON.parse(error.message)[0].message;
        else if (error instanceof Error)
            errorMessage = error.message;

        return res.status(HttpStatusCode.BAD_REQUEST).json({
            error: errorMessage
        })
    }

    protected ok<T>(res: Response, message: string, dto?: T) {
        if (!!dto) {
            return res.status(200).json({
                message,
                data: dto ?? []
            });
        } else {
            return res.sendStatus(200);
        }
    }

    protected created<T>(res: Response, message: string, dto?: T) {
        return res.sendStatus(201).json({
            message,
            data: dto ?? []
        });
    }

    protected clientError(res: Response, message?: string) {
        return res.status(400).json({ message: message || 'Bad request' });
    }

    protected notFound(res: Response, message?: string) {
        return res.status(404).json({ message: message || 'Not found' });
    }

    protected fail(res: Response, error: Error | string) {
        console.error(error);
        return res.status(500).json({ message: error.toString() });
    }
}