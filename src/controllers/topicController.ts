import AsyncHandler from "express-async-handler";
import knex from "../config/knex";
import { Request, Response } from "express";
import { checkIfSubjectExists, checkIfTopicExists } from "../utils/pgHandlers";
import { AppError } from "../middlewares/globalErrHandlers";

export const getTopics = AsyncHandler(async (req: Request, res: Response) => {
  const searchTerm = req.query.search || "";
  const limit = req.query.limit;
  const offset = req.query.offset || 0;
  let skipLimit = true;
  if (limit) skipLimit = false;
  const topics = await knex
    .select("t.id", "t.title", "t.created_at", "t.updated_at")
    .countDistinct("q.id as questions_count")
    .select("s.title as subject")
    .from("topics as t")
    .leftJoin("questions as q", "t.id", "q.topic_id")
    .leftJoin("subjects as s", "t.subject_id", "s.id")
    .where("t.title", "like", `%${searchTerm}%`)
    .limit(Number(limit), { skipBinding: skipLimit })
    .offset(Number(offset))
    .groupBy("t.id", "t.title", "s.title")
    .orderBy("t.id");

  if (!topics) {
    throw new AppError("No topic found", 404);
  } else {
    res.status(200).json({
      status: "success",
      data: topics,
    });
  }
});

export const getTopic = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await checkIfTopicExists(id);
  const topic = await knex
    .select("t.id", "t.title", "t.created_at", "t.updated_at")
    .countDistinct("q.id as questions_count")
    .select("s.title as subject")
    .from("topics as t")
    .leftJoin("questions as q", "t.id", "q.topic_id")
    .leftJoin("subjects as s", "t.subject_id", "s.id")
    .where("t.id", id)
    .groupBy("t.id", "t.title", "s.title")
    .orderBy("t.id");

  if (!topic) {
    throw new AppError("No topic found", 404);
  } else {
    res.status(200).json({
      status: "success",
      data: topic,
    });
  }
});

export const createTopic = AsyncHandler(async (req: Request, res: Response) => {
  const { title, subject_id } = req.body;
  if (!title || !subject_id)
    throw new AppError("Missing required field(s)", 404);
  const topic = await knex("topics").where("title", "=", title).first();
  if (topic) {
    throw new AppError("Topic already exists", 409);
  } else {
    await checkIfSubjectExists(Number(subject_id));
    const topic = await knex("topics").insert([{ title, subject_id }], "*");
    res.status(201).json({
      status: "success",
      data: topic,
    });
  }
});

export const updateTopic = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const { title, subject_id } = req.body;
  const updatedObject: { title?: string; subject_id?: number } = {};
  if (!title && !subject_id)
    throw new AppError("Missing required field(s)", 404);
  if (title) {
    const topic = await knex("topics").where("title", "=", title).first();
    if (topic) throw new AppError("Topic already exists", 409);
    updatedObject.title = title;
  }
  if (subject_id) {
    await checkIfSubjectExists(Number(subject_id));
    updatedObject.subject_id = subject_id;
  }
  const updated_topic = await knex("topics")
    .where({ id })
    .update(updatedObject, "*");

  res.status(200).json({
    status: "success",
    data: updated_topic,
  });
});

export const deleteTopic = AsyncHandler(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  await checkIfTopicExists(id);
  const questions_count = await knex("questions")
    .where({ topic_id: id })
    .count()
    .first();
  const questions_result = Number(questions_count?.count);
  if (questions_result > 0) throw new AppError("This topic has questions", 403);
  await knex("topics").where({ id }).delete();
  res.status(200).json({
    status: "success",
    data: "Topic deleted successfully",
  });
});

export const getTopicsBySubject = AsyncHandler(
  async (req: Request, res: Response) => {
    const subject_id: number = Number(req.params.id);
    await checkIfSubjectExists(subject_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit) skipLimit = false;
    const topics = await knex
      .select("t.id", "t.title", "t.created_at", "t.updated_at")
      .countDistinct("q.id as questions_count")
      .select("s.title as subject")
      .from("topics as t")
      .leftJoin("questions as q", "t.id", "q.topic_id")
      .leftJoin("subjects as s", "t.subject_id", "s.id")
      .where("t.subject_id", subject_id)
      .andWhere("t.title", "like", `%${searchTerm}%`)
      .limit(Number(limit), { skipBinding: skipLimit })
      .offset(Number(offset))
      .groupBy("t.id", "t.title", "s.title")
      .orderBy("t.id");

    if (!topics) throw new AppError("No topic found for this subject", 404);
    res.status(200).json({
      status: "success",
      data: topics,
    });
  }
);
