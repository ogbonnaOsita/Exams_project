import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
  getQuestionsByExam,
  getQuestionsBySubject,
  getQuestionsByTopic,
  getQuestionsMock,
  getQuestionsPractice,
  updateQuestion,
} from "../controllers/questionController";
import upload from "../utils/multer";
import { isAdminOrEditor, isLoggedIn } from "../middlewares/authMiddlewares";

const questionRouter = express.Router();

questionRouter.get("/", getQuestions);
questionRouter.post(
  "/",
  isLoggedIn,
  isAdminOrEditor,
  upload.single("image"),
  createQuestion
);
questionRouter.get("/mock", getQuestionsMock);
questionRouter.get("/practice", getQuestionsPractice);
questionRouter.get("/:id", getQuestion);
questionRouter.patch(
  "/:id",
  isLoggedIn,
  isAdminOrEditor,
  upload.single("image"),
  updateQuestion
);
questionRouter.delete("/:id", isLoggedIn, isAdminOrEditor, deleteQuestion);
questionRouter.get("/exam/:id", getQuestionsByExam);
questionRouter.get("/subject/:id", getQuestionsBySubject);
questionRouter.get("/topic/:id", getQuestionsByTopic);

export default questionRouter;
