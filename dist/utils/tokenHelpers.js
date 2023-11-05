"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secret = process.env.JWT_SECRET || "anykey";
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: "5d" });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            return false;
        }
        else {
            return decoded;
        }
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenHelpers.js.map