"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const examRoutes_1 = __importDefault(require("../routes/examRoutes"));
const topicRoutes_1 = __importDefault(require("../routes/topicRoutes"));
const subjectRoutes_1 = __importDefault(require("../routes/subjectRoutes"));
const questionRoutes_1 = __importDefault(require("../routes/questionRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
const app = (0, express_1.default)();
//=======Middlewares===========
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
//========Router================
app.use("/api/v1/exams", examRoutes_1.default);
app.use("/api/v1/topics", topicRoutes_1.default);
app.use("/api/v1/subjects", subjectRoutes_1.default);
app.use("/api/v1/questions", questionRoutes_1.default);
app.use("/api/v1/admins", adminRoutes_1.default);
//===========Error middlewares==============
app.use(globalErrHandlers_1.notFoundErr);
app.use(globalErrHandlers_1.globalErrHandler);
exports.default = app;
