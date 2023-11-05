"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
require("dotenv/config");
// const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
const { DB_HOST_PROD, DB_PORT_PROD, DB_USER_PROD, DB_PASSWORD_PROD, DB_DATABASE_PROD, } = process.env;
const knex = (0, knex_1.default)({
    client: "postgresql",
    connection: {
        host: DB_HOST_PROD,
        port: Number(DB_PORT_PROD),
        user: DB_USER_PROD,
        password: DB_PASSWORD_PROD,
        database: DB_DATABASE_PROD,
        ssl: true,
    },
    pool: {
        min: 2,
        max: 10,
    },
});
exports.default = knex;
