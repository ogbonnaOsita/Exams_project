import AsyncHandler from "express-async-handler";
import knex from "../config/knex";
import { Request, Response } from "express";
import {
  checkIfExamExists,
  getExamQuestionsList,
  getExamSubjectsList,
} from "../utils/pgHandlers";
import { AppError } from "../middlewares/globalErrHandlers";

export const getExams = AsyncHandler(async (req: Request, res: Response) => {
  const exams = await knex
    .select(
      "examTypes.id as examID",
      "examTypes.title",
      "examTypes.created_at",
      "examTypes.updated_at",
      knex.raw("COUNT(DISTINCT questions.id) as questions_count")
    )
    .countDistinct("subjects.id as subjects_count")
    .from("examTypes")
    .leftJoin("subjectAndExams as se", "examTypes.id", "se.exam_id")
    .leftJoin("subjects", "se.subject_id", "subjects.id")
    .leftJoin("questions", "examTypes.id", "questions.exam_id")
    .groupBy("examTypes.id", "examTypes.title")
    .orderBy("examTypes.id");
  if (!exams) {
    throw new AppError("No exam type found", 404);
  } else {
    res.status(200).json({
      status: "success",
      data: exams,
    });
  }
});

export const getExam = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await checkIfExamExists(id);
  // const exam = (await knex("examTypes").where({ id }).first())?.title;
  // const noOfSubjects = (await getExamSubjectsList(id)).length;
  // const noOfQuestions = (await getExamQuestionsList(id)).length;
  const exam = await knex
    .select(
      "et.id as examID",
      "et.title",
      "et.created_at",
      "et.updated_at",
      knex.raw("COUNT(DISTINCT q.id) as questions_count"),
      knex.raw("COUNT(DISTINCT s.id) as subjects_count")
    )
    .from("examTypes as et")
    .leftJoin("subjectAndExams as se", "et.id", "se.exam_id")
    .leftJoin("subjects as s", "se.subject_id", "s.id")
    .leftJoin("questions as q", "et.id", "q.exam_id")
    .where("et.id", id)
    .groupBy("et.id", "et.title");
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

export const createExam = AsyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    throw new AppError("Missing required field", 404);
  } else {
    const exam = await knex("examTypes").where("title", "=", title).first();
    if (exam) {
      throw new AppError("Exam already exists", 409);
    } else {
      const exam = await knex("examTypes").insert([{ title }], "*");
      res.status(201).json({
        status: "success",
        data: exam[0],
      });
    }
  }
});

export const updateExam = AsyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  const id: number = Number(req.params.id);
  if (!title) {
    throw new AppError("Missing required field(s)", 404);
  }
  const exam = await knex("examTypes").where("title", "=", title).first();
  if (exam) {
    throw new AppError("Exam already exists", 409);
  } else {
    await checkIfExamExists(id);

    const exam = await knex("examTypes").where({ id }).update({ title }, "*");
    res.status(200).json({
      status: "success",
      data: exam[0],
    });
  }
});

export const deleteExam = AsyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await checkIfExamExists(id);

  //check if exam has questions
  const count_result = await knex("questions")
    .where({ exam_id: id })
    .count()
    .first();

  const questions_count = Number(count_result?.count);
  if (questions_count > 0) throw new AppError("This exam has questions", 403);
  //check if it has subjects
  const has_subjects = await knex("subjectAndExams").where({ exam_id: id });
  if (has_subjects) {
    await knex("subjectAndExams").where({ exam_id: id }).delete();
  }
  await knex("examTypes").where({ id }).delete();
  res.status(200).json({
    status: "success",
    message: "Exam deleted successfully",
  });
});

//=============Exam subject List functions=============
export const getExamSubjectList = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfExamExists(id);
    const list = await getExamSubjectsList(id);
    if (list.length > 0) {
      res.status(200).json({
        status: "success",
        data: list,
      });
    } else {
      throw new AppError("No Subject for this exam type", 404);
    }
  }
);
