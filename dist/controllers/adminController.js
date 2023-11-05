"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.unsuspendAdminProfile = exports.suspendAdminProfile = exports.deleteAdminProfile = exports.changeAdminPasswordProfile = exports.updateAdminProfile = exports.loginAdmin = exports.registerAdmin = exports.getAdminProfile = exports.changeAdminPassword = exports.updateAdmin = exports.getAdmin = exports.getAdmins = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const passwordHelpers_1 = require("../utils/passwordHelpers");
const pgHandlers_1 = require("../utils/pgHandlers");
const tokenHelpers_1 = require("../utils/tokenHelpers");
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
const knex_1 = __importDefault(require("../config/knex"));
exports.getAdmins = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield (0, knex_1.default)("admins");
    if (!admins)
        throw new globalErrHandlers_1.AppError("No admin found", 404);
    res.status(200).json({
        status: "success",
        data: admins,
    });
}));
exports.getAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (!admin) {
        throw new globalErrHandlers_1.AppError("Admin ID is invalid", 401);
    }
    else {
        res.status(200).json({
            status: "success",
            data: admin,
        });
    }
}));
exports.updateAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { first_name, last_name } = req.body;
    const updateObject = {};
    if (!first_name && !last_name)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    if (first_name)
        updateObject.first_name = first_name;
    if (last_name)
        updateObject.last_name = last_name;
    const updated_admin = yield (0, knex_1.default)("admins")
        .where({ id: (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id })
        .update(updateObject, "*");
    res.status(200).json({
        status: "sucess",
        data: updated_admin,
    });
}));
exports.changeAdminPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        throw new globalErrHandlers_1.AppError("missing required field(s)", 404);
    const admin = yield (0, knex_1.default)("admins").where({ id: (_b = req.admin) === null || _b === void 0 ? void 0 : _b.id }).first();
    if (!admin) {
        throw new globalErrHandlers_1.AppError("Admin not found", 404);
    }
    else {
        const isMatched = yield (0, passwordHelpers_1.isPassMatched)(oldPassword, admin.password);
        if (isMatched) {
            const hashedPassword = yield (0, passwordHelpers_1.hashPassword)(newPassword);
            const updated_admin = yield (0, knex_1.default)("admins")
                .where({ id: (_c = req.admin) === null || _c === void 0 ? void 0 : _c.id })
                .update({ password: hashedPassword }, "*");
            res.status(200).json({
                status: "success",
                data: updated_admin,
            });
        }
        else {
            throw new globalErrHandlers_1.AppError("Incorrect password", 401);
        }
    }
}));
exports.getAdminProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const admin = yield (0, knex_1.default)("admins").where({ id: (_d = req.admin) === null || _d === void 0 ? void 0 : _d.id }).first();
    if (!admin)
        throw new globalErrHandlers_1.AppError("Admin not found", 404);
    res.status(200).json({
        status: "success",
        data: admin,
    });
}));
exports.registerAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password || !role)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    (0, pgHandlers_1.checkIfEmailIsCorrect)(email);
    const existingAdmin = yield (0, knex_1.default)("admins")
        .where("email", "=", email)
        .first();
    if (existingAdmin)
        throw new globalErrHandlers_1.AppError("Email address already taken", 409);
    const hashedPassword = yield (0, passwordHelpers_1.hashPassword)(password);
    const admin = yield (0, knex_1.default)("admins").insert([{ first_name, last_name, email, password: hashedPassword, role }], "*");
    res.status(201).json({
        status: "success",
        data: admin,
    });
}));
exports.loginAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        throw new globalErrHandlers_1.AppError("Please provide email and password", 404);
    (0, pgHandlers_1.checkIfEmailIsCorrect)(email);
    const admin = yield (0, knex_1.default)("admins").where("email", "=", email).first();
    if (!admin)
        throw new globalErrHandlers_1.AppError("Invalid email or password", 404);
    const isMatched = yield (0, passwordHelpers_1.isPassMatched)(password, admin.password);
    if (!isMatched) {
        throw new globalErrHandlers_1.AppError("Invalid email or password", 401);
    }
    else {
        res.status(200).json({
            status: "success",
            data: (0, tokenHelpers_1.generateToken)(admin.id),
        });
    }
}));
exports.updateAdminProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfAdminExists)(id);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (admin && admin.role === "admin")
        throw new globalErrHandlers_1.AppError("You cannot edit an admin's account", 403);
    const { first_name, email, last_name, role } = req.body;
    const updateObject = {};
    if (!first_name && !last_name && !email && !role)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    if (first_name)
        updateObject.first_name = first_name;
    if (last_name)
        updateObject.last_name = last_name;
    if (email)
        updateObject.email = email;
    if (role)
        updateObject.role = role;
    const updated_admin = yield (0, knex_1.default)("admins")
        .where({ id })
        .update(updateObject, "*");
    res.status(200).json({
        status: "sucess",
        data: updated_admin,
    });
}));
exports.changeAdminPasswordProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const id = Number(req.params.id);
    if (!password)
        throw new globalErrHandlers_1.AppError("missing required field(s)", 404);
    yield (0, pgHandlers_1.checkIfAdminExists)(id);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (admin && admin.role === "admin")
        throw new globalErrHandlers_1.AppError("You cannot change an admin's password", 403);
    const hashedPassword = yield (0, passwordHelpers_1.hashPassword)(password);
    const updated_admin = yield (0, knex_1.default)("admins")
        .where({ id })
        .update({ password: hashedPassword }, "*");
    res.status(200).json({
        status: "success",
        data: updated_admin,
    });
}));
exports.deleteAdminProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfAdminExists)(id);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (admin && admin.role === "admin")
        throw new globalErrHandlers_1.AppError("You cannot delete an admin's account", 403);
    if (id === ((_e = req.admin) === null || _e === void 0 ? void 0 : _e.id))
        throw new globalErrHandlers_1.AppError("You cannot delete your own account", 403);
    yield (0, knex_1.default)("admins").where({ id }).delete();
    res.status(200).json({
        status: "success",
        data: "Admin deleted successfully",
    });
}));
exports.suspendAdminProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfAdminExists)(id);
    if (id === ((_f = req.admin) === null || _f === void 0 ? void 0 : _f.id))
        throw new globalErrHandlers_1.AppError("You cannot suspend your own account", 403);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (admin && admin.role === "admin")
        throw new globalErrHandlers_1.AppError("You cannot suspend/unsuspend an admin", 403);
    const updated_admin = yield (0, knex_1.default)("admins")
        .where({ id })
        .update({ status: "suspended" }, "*");
    res.status(200).json({
        status: "success",
        data: updated_admin,
    });
}));
exports.unsuspendAdminProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfAdminExists)(id);
    if (id === ((_g = req.admin) === null || _g === void 0 ? void 0 : _g.id))
        throw new globalErrHandlers_1.AppError("You cannot unsuspend your own account", 403);
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (admin && admin.role === "admin")
        throw new globalErrHandlers_1.AppError("You cannot suspend/unsuspend an admin", 403);
    const updated_admin = yield (0, knex_1.default)("admins")
        .where({ id })
        .update({ status: "active" }, "*");
    res.status(200).json({
        status: "success",
        data: updated_admin,
    });
}));
exports.logoutAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
