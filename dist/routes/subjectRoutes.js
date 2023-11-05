"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const subjectRouter = express_1.default.Router();
subjectRouter.get("/", subjectController_1.getSubjects);
subjectRouter.get("/:id", subjectController_1.getSubject);
subjectRouter.post("/", subjectController_1.createSubject);
subjectRouter.patch("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, subjectController_1.updateSubject);
subjectRouter.delete("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, subjectController_1.deleteSubject);
subjectRouter.get("/exams/:id", subjectController_1.getSubjectExamsList);
subjectRouter.post("/exams/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, subjectController_1.addSubjectExamsList);
subjectRouter.delete("/exams/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, subjectController_1.deleteSubjectExamList);
exports.default = subjectRouter;
//# sourceMappingURL=subjectRoutes.js.map