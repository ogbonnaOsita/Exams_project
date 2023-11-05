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
exports.isNotSuspended = exports.isAdminOrEditor = exports.isAdmin = exports.isLoggedIn = void 0;
const tokenHelpers_1 = require("../utils/tokenHelpers");
const knex_1 = __importDefault(require("../knex_src/config/knex"));
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //get token from header
    const headerObj = req.headers;
    const token = ((_a = headerObj === null || headerObj === void 0 ? void 0 : headerObj.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
    //verify token
    const verifiedToken = (0, tokenHelpers_1.verifyToken)(token);
    if (verifiedToken) {
        const admin = yield (0, knex_1.default)("admins")
            .where({ id: verifiedToken["id"] })
            .select("id", "first_name", "last_name", "email", "role")
            .first();
        // save the admin in req.obj
        req.admin = admin;
        next();
    }
    else {
        const err = new Error("Token expired / Invalid");
        next(err);
    }
});
exports.isLoggedIn = isLoggedIn;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const adminID = (_b = req.admin) === null || _b === void 0 ? void 0 : _b.id;
    const admin = yield (0, knex_1.default)("admins").where({ id: adminID }).first();
    if ((admin === null || admin === void 0 ? void 0 : admin.role) === "admin") {
        next();
    }
    else {
        next(new Error("Access Denied, admin only"));
    }
});
exports.isAdmin = isAdmin;
const isAdminOrEditor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const adminID = (_c = req.admin) === null || _c === void 0 ? void 0 : _c.id;
    const admin = yield (0, knex_1.default)("admins").where({ id: adminID }).first();
    if ((admin === null || admin === void 0 ? void 0 : admin.role) === "admin" || (admin === null || admin === void 0 ? void 0 : admin.role) === "editor") {
        next();
    }
    else {
        next(new Error("Access Denied, admins and editors only"));
    }
});
exports.isAdminOrEditor = isAdminOrEditor;
const isNotSuspended = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const adminID = (_d = req.admin) === null || _d === void 0 ? void 0 : _d.id;
    const admin = yield (0, knex_1.default)("admins").where({ id: adminID }).first();
    if ((admin === null || admin === void 0 ? void 0 : admin.role) === "active") {
        next();
    }
    else {
        next(new Error("Access Denied: your account is suspend, contact an admin"));
    }
});
exports.isNotSuspended = isNotSuspended;
//# sourceMappingURL=authMiddlewares.js.map