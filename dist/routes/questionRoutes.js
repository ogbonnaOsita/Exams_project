"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const multer_1 = __importDefault(require("../utils/multer"));
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const questionRouter = express_1.default.Router();
questionRouter.get("/", questionController_1.getQuestions);
questionRouter.post("/", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, multer_1.default.single("image"), questionController_1.createQuestion);
questionRouter.get("/:id", questionController_1.getQuestion);
questionRouter.patch("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, multer_1.default.single("image"), questionController_1.updateQuestion);
questionRouter.delete("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, questionController_1.deleteQuestion);
questionRouter.get("/exam/:id", questionController_1.getQuestionsByExam);
questionRouter.get("/subject/:id", questionController_1.getQuestionsBySubject);
questionRouter.get("/topic/:id", questionController_1.getQuestionsByTopic);
exports.default = questionRouter;
