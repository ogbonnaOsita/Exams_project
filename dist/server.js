"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const api_1 = __importDefault(require("./api"));
require("dotenv/config");
const PORT = Number(process.env.PORT) || 4000;
//server
const server = http_1.default.createServer(api_1.default);
server.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
