import { NextFunction, Request, Response } from "express";

export const globalErrHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    status,
    message,
  });
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

//Not found
export const notFoundErr = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  next(err);
};
