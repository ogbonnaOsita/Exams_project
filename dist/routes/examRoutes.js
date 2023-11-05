"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examController_1 = require("../controllers/examController");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const examRouter = express_1.default.Router();
examRouter.get("/", examController_1.getExams);
examRouter.get("/:id", examController_1.getExam);
examRouter.post("/", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, examController_1.createExam);
examRouter.patch("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, examController_1.updateExam);
examRouter.delete("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, examController_1.deleteExam);
examRouter.get("/subject_list/:id", examController_1.getExamSubjectList);
exports.default = examRouter;
//# sourceMappingURL=examRoutes.js.map