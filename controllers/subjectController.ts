import AsyncHandler from "express-async-handler";
import knex from "../knex_src/config/knex";
import { Request, Response } from "express";
import {
  checkIfExamExists,
  checkIfSubjectExists,
  getExamById,
  getSubjectById,
  getSubjectExamList,
  removeSubjectExamType,
} from "../utils/pgHandlers";
import { AppError } from "../middlewares/globalErrHandlers";

export const getSubjects = AsyncHandler(async (req: Request, res: Response) => {
  const subjects = await knex
    .select("s.id", "s.title", "s.created_at", "s.updated_at")
    .countDistinct("t.id as topics_count")
    .countDistinct("q.id as questions_count")
    .select(
      knex.raw("array_remove(array_agg(distinct et.title), null) as exam_types")
    )
    .from("subjects as s")
    .leftJoin("topics as t", "s.id", "t.subject_id")
    .leftJoin("questions as q", "s.id", "q.subject_id")
    .leftJoin("subjectAndExams as se", "s.id", "se.subject_id")
    .leftJoin("examTypes as et", "se.exam_id", "et.id")
    .groupBy("s.id", "s.title")
    .orderBy("s.id");
  if (!subjects) {
    throw new AppError("No subject found", 404);
  } else {
    res.status(200).json({
      status: "success",
      data: subjects,
    });
  }
});

export const getSubject = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await checkIfSubjectExists(id);
  const subject = await knex
    .select("s.id", "s.title", "s.created_at", "s.updated_at")
    .countDistinct("t.id as topics_count")
    .countDistinct("q.id as questions_count")
    .select(
      knex.raw("array_remove(array_agg(distinct et.title), null) as exam_types")
    )
    .from("subjects as s")
    .leftJoin("topics as t", "s.id", "t.subject_id")
    .leftJoin("questions as q", "s.id", "q.subject_id")
    .leftJoin("subjectAndExams as se", "s.id", "se.subject_id")
    .leftJoin("examTypes as et", "se.exam_id", "et.id")
    .where("s.id", id)
    .groupBy("s.id", "s.title")
    .orderBy("s.id");
  if (!subject) {
    throw new AppError("No subject found", 404);
  } else {
    res.status(200).json({
      status: "success",
      data: subject,
    });
  }
});

export const createSubject = AsyncHandler(
  async (req: Request, res: Response) => {
    const { title, examTypes } = req.body;
    if (!title) {
      throw new AppError("Missing required field", 404);
    } else if (!examTypes) {
      throw new AppError("Subject must belong to an exam type", 404);
    } else {
      if (!Array.isArray(examTypes))
        throw new AppError("the field examTypes must be an array", 404);
      const exam = await knex("subjects").where("title", "=", title).first();
      if (exam) {
        throw new AppError("Subject already exists", 409);
      } else {
        const subject = await knex("subjects")
          .insert([{ title }], "*")
          .then(async (res) => {
            // to output the exam list for the subject
            let exams: string[] = [];
            await Promise.all(
              examTypes.map(async (examType) => {
                await checkIfExamExists(Number(examType));
                await knex("subjectAndExams").insert({
                  subject_id: res[0].id,
                  exam_id: Number(examType),
                });
                const exam = await getExamById(Number(examType));
                if (exam) exams.push(exam.title);
              })
            );
            const data = {
              subject: res[0],
              examsList: exams,
            };
            return data;
          });
        res.status(201).json({
          status: "success",
          data: subject,
        });
      }
    }
  }
);

export const updateSubject = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const { title } = req.body;
    if (!title) throw new AppError("Missing required field", 404);
    if (title) {
      const subject = await knex("subjects").where("title", "=", title);
      if (subject.length > 0) {
        throw new AppError("Subject already exists", 409);
      } else {
        await checkIfSubjectExists(id);
        const subject = await knex("subjects")
          .where({ id })
          .update({ title }, "*");
        res.status(201).json({
          status: "success",
          data: subject[0],
        });
      }
    }
  }
);

export const deleteSubject = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfSubjectExists(id);
    const topics_count = await knex("topics")
      .where({ subject_id: id })
      .count()
      .first();
    const questions_count = await knex("topics")
      .where({ subject_id: id })
      .count()
      .first();

    const topics_result = Number(topics_count?.count);
    const questions_result = Number(questions_count?.count);
    if (topics_result > 0) throw new AppError("This subject has topics", 403);
    if (questions_result > 0)
      throw new AppError("This subject has questions", 403);
    await knex("subjectAndExams").where({ subject_id: id }).delete();
    await knex("subjects").where({ id }).delete();
    res.status(200).json({
      status: "success",
      data: "Subject deleted successfully",
    });
  }
);

// =================Subject Exam List functions=========================

export const getSubjectExamsList = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfSubjectExists(id);
    const list = await getSubjectExamList(id);
    if (list.length > 0) {
      res.status(200).json({
        status: "success",
        data: list,
      });
    } else {
      throw new AppError("No exam Type for this subject", 404);
    }
  }
);

export const addSubjectExamsList = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const { exam_id } = req.body;
    if (!exam_id) throw new AppError("Missing required field", 404);
    await checkIfSubjectExists(id);
    await checkIfExamExists(Number(exam_id));
    const has_exam = await knex("subjectAndExams")
      .where({ subject_id: id })
      .andWhere({ exam_id });
    if (has_exam.length > 0) {
      throw new AppError("Subject already have this exam type", 409);
    } else {
      await knex("subjectAndExams").insert({ subject_id: id, exam_id });
      const exam = (await getExamById(Number(exam_id)))?.title;
      const subject = (await getSubjectById(Number(id)))?.title;
      res.status(200).json({
        status: "success",
        data: {
          exam,
          subject,
        },
      });
    }
  }
);

export const deleteSubjectExamList = AsyncHandler(
  async (req: Request, res: Response) => {
    const subject_id: number = Number(req.params.id);
    const { exam_id } = req.body;
    await checkIfSubjectExists(subject_id);
    const noOfExamTypes = await getSubjectExamList(subject_id);
    if (noOfExamTypes.length <= 1) {
      throw new AppError("Subject must have at least one exam type", 404);
    } else {
      if (subject_id && exam_id) {
        const status = await removeSubjectExamType(exam_id, subject_id);
        if (status) {
          res.status(200).json({
            status: "success",
            data: "Deleted successfully",
          });
        }
      }
    }
  }
);
