import express from "express";
import {
  addSubjectExamsList,
  createSubject,
  deleteSubject,
  deleteSubjectExamList,
  getSubject,
  getSubjectExamsList,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController";
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares";

const subjectRouter = express.Router();

subjectRouter.get("/", getSubjects);
subjectRouter.get("/:id", getSubject);
subjectRouter.post("/", createSubject);
subjectRouter.patch("/:id", isLoggedIn, isAdmin, updateSubject);
subjectRouter.delete("/:id", isLoggedIn, isAdmin, deleteSubject);
subjectRouter.get("/exams/:id", getSubjectExamsList);
subjectRouter.post("/exams/:id", isLoggedIn, isAdmin, addSubjectExamsList);
subjectRouter.delete("/exams/:id", isLoggedIn, isAdmin, deleteSubjectExamList);

export default subjectRouter;
