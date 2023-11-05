"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundErr = exports.AppError = exports.globalErrHandler = void 0;
const globalErrHandler = (err, req, res, next) => {
    const message = err.message;
    const status = err.status ? err.status : "failed";
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        status,
        message,
    });
};
exports.globalErrHandler = globalErrHandler;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//Not found
const notFoundErr = (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    next(err);
};
exports.notFoundErr = notFoundErr;
//# sourceMappingURL=globalErrHandlers.js.map