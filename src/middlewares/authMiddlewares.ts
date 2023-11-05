import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHelpers";
import knex from "../config/knex";
import { AppError } from "./globalErrHandlers";

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

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get token from header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1] || "";
  //verify token
  const verifiedToken = await verifyToken(token)
    .then((decoded) => {
      return decoded;
    })
    .catch(() => {
      return null;
    });

  if (verifiedToken !== null) {
    const admin = await knex("admins")
      .where({ id: verifiedToken["id"] })
      .select("id", "first_name", "last_name", "email", "role")
      .first();
    req.admin = admin;
    next();
  } else {
    const err = new AppError("Token expired / Invalid", 498);
    next(err);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminID = req.admin?.id;
  const admin = await knex("admins").where({ id: adminID }).first();
  if (admin?.role === "admin") {
    next();
  } else {
    next(new AppError("Access Denied, admin only", 403));
  }
};

export const isAdminOrEditor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminID = req.admin?.id;
  const admin = await knex("admins").where({ id: adminID }).first();
  if (admin?.role === "admin" || admin?.role === "editor") {
    next();
  } else {
    next(new AppError("Access Denied, admins and editors only", 498));
  }
};

export const isNotSuspended = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminID = req.admin?.id;
  const admin = await knex("admins").where({ id: adminID }).first();
  if (admin?.role === "active") {
    next();
  } else {
    next(new AppError("Access Denied: your account is suspend, contact an admin", 403));
  }
};
