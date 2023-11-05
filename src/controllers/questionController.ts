import AsyncHandler from "express-async-handler";
import knex from "../config/knex";
import { Request, Response } from "express";
import "dotenv/config";
import {
  checkIfExamExists,
  checkIfQuestionExists,
  checkIfSubjectExists,
  checkIfTopicExists,
} from "../utils/pgHandlers";
import cloudinary from "../utils/cloudinary";
import { AppError } from "../middlewares/globalErrHandlers";

export const getQuestions = AsyncHandler(
  async (req: Request, res: Response) => {
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit) skipLimit = false;
    const questions = await knex
      .select(
        "q.id",
        "q.question",
        "q.options",
        "q.correctAnswer",
        "q.year",
        "q.image_url",
        "q.cloudinary_id",
        "q.created_at",
        "q.updated_at",
        "et.title as exam",
        "s.title as subject",
        "t.title as topic"
      )
      .from("questions as q")
      .leftJoin("examTypes as et", "q.exam_id", "et.id")
      .leftJoin("subjects as s", "q.subject_id", "s.id")
      .leftJoin("topics as t", "q.topic_id", "t.id")
      .where("q.question", "like", `%${searchTerm}%`)
      .limit(Number(limit), { skipBinding: skipLimit })
      .offset(Number(offset));

    if (!questions) throw new AppError("No question found", 404);
    res.status(200).json({
      status: "success",
      data: questions,
    });
  }
);

export const getQuestion = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await checkIfQuestionExists(id);
  const question = await knex
    .select(
      "q.id",
      "q.question",
      "q.options",
      "q.correctAnswer",
      "q.year",
      "q.image_url",
      "q.cloudinary_id",
      "q.created_at",
      "q.updated_at",
      "et.title as exam",
      "s.title as subject",
      "t.title as topic"
    )
    .from("questions as q")
    .leftJoin("examTypes as et", "q.exam_id", "et.id")
    .leftJoin("subjects as s", "q.subject_id", "s.id")
    .leftJoin("topics as t", "q.topic_id", "t.id")
    .where("q.id", id);
  if (!question) throw new AppError("No question found", 404);
  res.status(200).json({
    status: "success",
    data: question,
  });
});

export const createQuestion = AsyncHandler(
  async (req: Request, res: Response) => {
    //=========Get data from req.body=======================
    const {
      question,
      options,
      correctAnswer,
      year,
      topic_id,
      exam_id,
      subject_id,
    } = req.body;
    let image_url = "";
    let cloudinary_id = "";
    //==========Upload to cloudinary if file exists=====================
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
      });
      image_url = result.secure_url;
      cloudinary_id = result.public_id;
    }
    //================== Ensure data field is not empty=====================
    if (
      !question &&
      !options &&
      !correctAnswer &&
      !year &&
      !topic_id &&
      !exam_id &&
      !subject_id
    )
      throw new AppError("Missing required field(s)", 404);
    //====================Check if question exists, and confirm exam, subject and topic============================
    const existingQuestion = await knex("questions")
      .where("question", "=", question)
      .first();
    if (existingQuestion) throw new AppError("Question already exists", 409);
    await checkIfExamExists(Number(exam_id));
    await checkIfSubjectExists(Number(subject_id));
    await checkIfTopicExists(Number(topic_id));
    //======================= Add question to database =========================
    const new_question = await knex("questions").insert(
      [
        req.file
          ? {
              question,
              options,
              correctAnswer,
              year,
              image_url,
              cloudinary_id,
              topic_id,
              exam_id,
              subject_id,
            }
          : {
              question,
              options,
              correctAnswer,
              year,
              topic_id,
              exam_id,
              subject_id,
            },
      ],
      "*"
    );
    res.status(201).json({
      status: "success",
      data: new_question,
    });
  }
);

export const updateQuestion = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    //=================== get data from form ===================
    const {
      question,
      options,
      correctAnswer,
      year,
      topic_id,
      exam_id,
      subject_id,
    } = req.body;

    //============== Check if at least one field is present for update ==============
    if (
      !question &&
      !options &&
      !correctAnswer &&
      !year &&
      !topic_id &&
      !exam_id &&
      !subject_id &&
      !req.file
    )
      throw new AppError("Missing required field(s)", 404);

    //================ object to contain the updated data =========================
    const updatedObject: {
      question?: string;
      options?: object;
      correctAnswer?: string;
      year?: number;
      image_url?: string;
      cloudinary_id?: string;
      topic_id?: number;
      exam_id?: number;
      subject_id?: number;
    } = {};

    //====================== Checks for data from all fields===============================
    if (question) {
      const existingQuestion = await knex("questions")
        .where("question", "=", question)
        .first();
      if (existingQuestion) throw new AppError("Question already exists", 409);

      updatedObject.question = question;
    }
    if (options) updatedObject.options = options;
    if (correctAnswer) updatedObject.correctAnswer = correctAnswer;
    if (year) updatedObject.year = year;

    if (subject_id) {
      await checkIfSubjectExists(Number(subject_id));
      updatedObject.subject_id = subject_id;
    }
    if (exam_id) {
      await checkIfExamExists(Number(exam_id));
      updatedObject.exam_id = exam_id;
    }
    if (topic_id) {
      await checkIfTopicExists(Number(topic_id));
      updatedObject.topic_id = topic_id;
    }

    //================ Check if the image is to be updated ===========================

    if (req.file) {
      const question = await knex("questions").where({ id }).first();
      if (question?.cloudinary_id)
        await cloudinary.uploader.destroy(question?.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
      });
      updatedObject.cloudinary_id = result.public_id;
      updatedObject.image_url = result.secure_url;
    }

    // ====================== update the question in the database =====================
    const updatedQuestion = await knex("questions")
      .where({ id })
      .update(updatedObject, "*");

    res.status(200).json({
      status: "success",
      data: updatedQuestion,
    });
  }
);

export const deleteQuestion = AsyncHandler(
  async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    await checkIfQuestionExists(id);
    const question = await knex("questions").where({ id }).first();
    if (question?.cloudinary_id)
      await cloudinary.uploader.destroy(question?.cloudinary_id);
    await knex("questions").where({ id }).delete();
    res.status(200).json({
      status: "success",
      data: "Question deleted successfully",
    });
  }
);

export const getQuestionsByExam = AsyncHandler(
  async (req: Request, res: Response) => {
    const exam_id: number = Number(req.params.id);
    await checkIfExamExists(exam_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit) skipLimit = false;
    const questions = await knex
      .select(
        "q.id",
        "q.question",
        "q.options",
        "q.correctAnswer",
        "q.year",
        "q.image_url",
        "q.created_at",
        "q.updated_at",
        "et.title as exam",
        "s.title as subject",
        "t.title as topic"
      )
      .from("questions as q")
      .leftJoin("examTypes as et", "q.exam_id", "et.id")
      .leftJoin("subjects as s", "q.subject_id", "s.id")
      .leftJoin("topics as t", "q.topic_id", "t.id")
      .where("q.exam_id", exam_id)
      .andWhere("q.question", "like", `%${searchTerm}%`)
      .limit(Number(limit), { skipBinding: skipLimit })
      .offset(Number(offset));
    if (!questions) throw new AppError("No question found", 404);
    res.status(200).json({
      status: "success",
      data: questions,
    });
  }
);

export const getQuestionsBySubject = AsyncHandler(
  async (req: Request, res: Response) => {
    const subject_id: number = Number(req.params.id);
    await checkIfSubjectExists(subject_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit) skipLimit = false;
    const questions = await knex
      .select(
        "q.id",
        "q.question",
        "q.options",
        "q.correctAnswer",
        "q.year",
        "q.image_url",
        "q.created_at",
        "q.updated_at",
        "et.title as exam",
        "s.title as subject",
        "t.title as topic"
      )
      .from("questions as q")
      .leftJoin("examTypes as et", "q.exam_id", "et.id")
      .leftJoin("subjects as s", "q.subject_id", "s.id")
      .leftJoin("topics as t", "q.topic_id", "t.id")
      .where("q.subject_id", subject_id)
      .andWhere("q.question", "like", `%${searchTerm}%`)
      .limit(Number(limit), { skipBinding: skipLimit })
      .offset(Number(offset));
    if (!questions) throw new AppError("No question found", 404);
    res.status(200).json({
      status: "success",
      data: questions,
    });
  }
);

export const getQuestionsByTopic = AsyncHandler(
  async (req: Request, res: Response) => {
    const topic_id: number = Number(req.params.id);
    await checkIfTopicExists(topic_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit) skipLimit = false;
    const questions = await knex
      .select(
        "q.id",
        "q.question",
        "q.options",
        "q.correctAnswer",
        "q.year",
        "q.image_url",
        "q.created_at",
        "q.updated_at",
        "et.title as exam",
        "s.title as subject",
        "t.title as topic"
      )
      .from("questions as q")
      .leftJoin("examTypes as et", "q.exam_id", "et.id")
      .leftJoin("subjects as s", "q.subject_id", "s.id")
      .leftJoin("topics as t", "q.topic_id", "t.id")
      .where("q.topic_id", topic_id)
      .andWhere("q.question", "like", `%${searchTerm}%`)
      .limit(Number(limit), { skipBinding: skipLimit })
      .offset(Number(offset));
    if (!questions) throw new AppError("No question found", 404);
    res.status(200).json({
      status: "success",
      data: questions,
    });
  }
);
