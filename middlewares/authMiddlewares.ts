import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHelpers";
import knex from "../knex_src/config/knex";

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
  const verifiedToken = verifyToken(token)!;
  if (verifiedToken) {
    const admin = await knex("admins")
      .where({ id: verifiedToken["id"] })
      .select("id", "first_name", "last_name", "email", "role")
      .first();
    // save the admin in req.obj
    req.admin = admin;
    next();
  } else {
    const err = new Error("Token expired / Invalid");
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
    next(new Error("Access Denied, admin only"));
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
    next(new Error("Access Denied, admins and editors only"));
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
    next(new Error("Access Denied: your account is suspend, contact an admin"));
  }
};
