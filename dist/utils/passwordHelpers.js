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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPassMatched = exports.hashPassword = void 0;
const bcrypt = require("bcryptjs");
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(10);
    const hash = yield bcrypt.hash(password, salt);
    return hash;
});
exports.hashPassword = hashPassword;
const isPassMatched = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt.compare(password, hash);
});
exports.isPassMatched = isPassMatched;
