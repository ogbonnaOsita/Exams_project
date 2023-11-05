import express from "express";
import {
  createExam,
  deleteExam,
  getExam,
  getExamSubjectList,
  getExams,
  updateExam,
} from "../controllers/examController";
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares";

const examRouter = express.Router();

examRouter.get("/", getExams);
examRouter.get("/:id", getExam);
examRouter.post("/", isLoggedIn, isAdmin, createExam);
examRouter.patch("/:id", isLoggedIn, isAdmin, updateExam);
examRouter.delete("/:id", isLoggedIn, isAdmin, deleteExam);
examRouter.get("/subject_list/:id", getExamSubjectList);

export default examRouter;
