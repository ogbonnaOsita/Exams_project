import AsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { hashPassword, isPassMatched } from "../utils/passwordHelpers";
import { checkIfAdminExists, checkIfEmailIsCorrect } from "../utils/pgHandlers";
import { generateToken } from "../utils/tokenHelpers";
import { AppError } from "../middlewares/globalErrHandlers";
import knex from "../config/knex";

export const getAdmins = AsyncHandler(async (req: Request, res: Response) => {
  const admins = await knex("admins");
  if (!admins) throw new AppError("No admin found", 404);
  res.status(200).json({
    status: "success",
    data: admins,
  });
});

export const getAdmin = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const admin = await knex("admins").where({ id }).first();
  if (!admin) {
    throw new AppError("Admin ID is invalid", 401);
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
    });
  }
});

export const updateAdmin = AsyncHandler(async (req: Request, res: Response) => {
  const { first_name, last_name } = req.body;
  const updateObject: {
    first_name?: string;
    last_name?: string;
  } = {};

  if (!first_name && !last_name)
    throw new AppError("Missing required field(s)", 404);
  if (first_name) updateObject.first_name = first_name;
  if (last_name) updateObject.last_name = last_name;

  const updated_admin = await knex("admins")
    .where({ id: req.admin?.id })
    .update(updateObject, "*");
  res.status(200).json({
    status: "sucess",
    data: updated_admin,
  });
});

export const changeAdminPassword = AsyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      throw new AppError("missing required field(s)", 404);
    const admin = await knex("admins").where({ id: req.admin?.id }).first();
    if (!admin) {
      throw new AppError("Admin not found", 404);
    } else {
      const isMatched = await isPassMatched(oldPassword, admin.password);
      if (isMatched) {
        const hashedPassword = await hashPassword(newPassword);
        const updated_admin = await knex("admins")
          .where({ id: req.admin?.id })
          .update({ password: hashedPassword }, "*");
        res.status(200).json({
          status: "success",
          data: updated_admin,
        });
      } else {
        throw new AppError("Incorrect password", 401);
      }
    }
  }
);

export const getAdminProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const admin = await knex("admins").where({ id: req.admin?.id }).first();
    if (!admin) throw new AppError("Admin not found", 404);
    res.status(200).json({
      status: "success",
      data: admin,
    });
  }
);

export const registerAdmin = AsyncHandler(
  async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password || !role)
      throw new AppError("Missing required field(s)", 404);
    checkIfEmailIsCorrect(email);
    const existingAdmin = await knex("admins")
      .where("email", "=", email)
      .first();
    if (existingAdmin) throw new AppError("Email address already taken", 409);
    const hashedPassword = await hashPassword(password);
    const admin = await knex("admins").insert(
      [{ first_name, last_name, email, password: hashedPassword, role }],
      "*"
    );

    res.status(201).json({
      status: "success",
      data: admin,
    });
  }
);

export const loginAdmin = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError("Please provide email and password", 404);
  checkIfEmailIsCorrect(email);
  const admin = await knex("admins").where("email", "=", email).first();
  if (!admin) throw new AppError("Invalid email or password", 404);

  const isMatched = await isPassMatched(password, admin.password);
  if (!isMatched) {
    throw new AppError("Invalid email or password", 401);
  } else {
    if (admin.role !== "admin") {
      throw new AppError("You are not authorized!", 403);
    } else {
      res.status(200).json({
        status: "success",
        token: generateToken(admin.id),
        data: {
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          role: admin.role,
        },
      });
    }
  }
});

export const loginEditor = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError("Please provide email and password", 404);
  checkIfEmailIsCorrect(email);
  const admin = await knex("admins").where("email", "=", email).first();
  if (!admin) throw new AppError("Invalid email or password", 404);

  const isMatched = await isPassMatched(password, admin.password);
  if (!isMatched) {
    throw new AppError("Invalid email or password", 401);
  } else {
    if (admin.role !== "editor") {
      throw new AppError("You are not authorized!", 403);
    } else {
      res.status(200).json({
        status: "success",
        token: generateToken(admin.id),
        data: {
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          role: admin.role,
        },
      });
    }
  }
});

export const updateAdminProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfAdminExists(id);
    const admin = await knex("admins").where({ id }).first();
    if (admin && admin.role === "admin")
      throw new AppError("You cannot edit an admin's account", 403);
    const { first_name, email, last_name, role } = req.body;
    const updateObject: {
      first_name?: string;
      last_name?: string;
      email?: string;
      role?: string;
    } = {};

    if (!first_name && !last_name && !email && !role)
      throw new AppError("Missing required field(s)", 404);
    if (first_name) updateObject.first_name = first_name;
    if (last_name) updateObject.last_name = last_name;
    if (email) updateObject.email = email;
    if (role) updateObject.role = role;

    const updated_admin = await knex("admins")
      .where({ id })
      .update(updateObject, "*");
    res.status(200).json({
      status: "sucess",
      data: updated_admin,
    });
  }
);

export const changeAdminPasswordProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const id: number = Number(req.params.id);
    if (!password) throw new AppError("missing required field(s)", 404);
    await checkIfAdminExists(id);
    const admin = await knex("admins").where({ id }).first();
    if (admin && admin.role === "admin")
      throw new AppError("You cannot change an admin's password", 403);
    const hashedPassword = await hashPassword(password);
    const updated_admin = await knex("admins")
      .where({ id })
      .update({ password: hashedPassword }, "*");
    res.status(200).json({
      status: "success",
      data: updated_admin,
    });
  }
);

export const deleteAdminProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfAdminExists(id);
    const admin = await knex("admins").where({ id }).first();
    if (admin && admin.role === "admin")
      throw new AppError("You cannot delete an admin's account", 403);
    if (id === req.admin?.id)
      throw new AppError("You cannot delete your own account", 403);
    await knex("admins").where({ id }).delete();
    res.status(200).json({
      status: "success",
      data: "Admin deleted successfully",
    });
  }
);

export const suspendAdminProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfAdminExists(id);
    if (id === req.admin?.id)
      throw new AppError("You cannot suspend your own account", 403);
    const admin = await knex("admins").where({ id }).first();
    if (admin && admin.role === "admin")
      throw new AppError("You cannot suspend/unsuspend an admin", 403);
    const updated_admin = await knex("admins")
      .where({ id })
      .update({ status: "suspended" }, "*");
    res.status(200).json({
      status: "success",
      data: updated_admin,
    });
  }
);

export const unsuspendAdminProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfAdminExists(id);
    if (id === req.admin?.id)
      throw new AppError("You cannot unsuspend your own account", 403);
    const admin = await knex("admins").where({ id }).first();
    if (admin && admin.role === "admin")
      throw new AppError("You cannot suspend/unsuspend an admin", 403);
    const updated_admin = await knex("admins")
      .where({ id })
      .update({ status: "active" }, "*");
    res.status(200).json({
      status: "success",
      data: updated_admin,
    });
  }
);

export const logoutAdmin = AsyncHandler(
  async (req: Request, res: Response) => {}
);
