import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: number;
                first_name: string;
                last_name: string;
                email: string;
                role: string;
            };
        }
    }
}
export declare const isLoggedIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdminOrEditor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const isNotSuspended: (req: Request, res: Response, next: NextFunction) => Promise<void>;
