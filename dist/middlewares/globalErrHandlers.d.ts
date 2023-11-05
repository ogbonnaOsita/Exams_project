import { NextFunction, Request, Response } from "express";
export declare const globalErrHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly status: string;
    constructor(message: string, statusCode: number);
}
export declare const notFoundErr: (req: Request, res: Response, next: NextFunction) => void;
