"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionsByTopic = exports.getQuestionsBySubject = exports.getQuestionsByExam = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestion = exports.getQuestions = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const knex_1 = __importDefault(require("../config/knex"));
require("dotenv/config");
const pgHandlers_1 = require("../utils/pgHandlers");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
exports.getQuestions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const questions = yield knex_1.default
        .select("q.id", "q.question", "q.options", "q.correctAnswer", "q.year", "q.image_url", "q.cloudinary_id", "q.created_at", "q.updated_at", "et.title as exam", "s.title as subject", "t.title as topic")
        .from("questions as q")
        .leftJoin("examTypes as et", "q.exam_id", "et.id")
        .leftJoin("subjects as s", "q.subject_id", "s.id")
        .leftJoin("topics as t", "q.topic_id", "t.id")
        .where("q.question", "like", `%${searchTerm}%`)
        .limit(Number(limit), { skipBinding: skipLimit })
        .offset(Number(offset));
    if (!questions)
        throw new globalErrHandlers_1.AppError("No question found", 404);
    res.status(200).json({
        status: "success",
        data: questions,
    });
}));
exports.getQuestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfQuestionExists)(id);
    const question = yield knex_1.default
        .select("q.id", "q.question", "q.options", "q.correctAnswer", "q.year", "q.image_url", "q.cloudinary_id", "q.created_at", "q.updated_at", "et.title as exam", "s.title as subject", "t.title as topic")
        .from("questions as q")
        .leftJoin("examTypes as et", "q.exam_id", "et.id")
        .leftJoin("subjects as s", "q.subject_id", "s.id")
        .leftJoin("topics as t", "q.topic_id", "t.id")
        .where("q.id", id);
    if (!question)
        throw new globalErrHandlers_1.AppError("No question found", 404);
    res.status(200).json({
        status: "success",
        data: question,
    });
}));
exports.createQuestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //=========Get data from req.body=======================
    const { question, options, correctAnswer, year, topic_id, exam_id, subject_id, } = req.body;
    let image_url = "";
    let cloudinary_id = "";
    //==========Upload to cloudinary if file exists=====================
    if (req.file) {
        const result = yield cloudinary_1.default.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_FOLDER_NAME,
        });
        image_url = result.secure_url;
        cloudinary_id = result.public_id;
    }
    //================== Ensure data field is not empty=====================
    if (!question &&
        !options &&
        !correctAnswer &&
        !year &&
        !topic_id &&
        !exam_id &&
        !subject_id)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    //====================Check if question exists, and confirm exam, subject and topic============================
    const existingQuestion = yield (0, knex_1.default)("questions")
        .where("question", "=", question)
        .first();
    if (existingQuestion)
        throw new globalErrHandlers_1.AppError("Question already exists", 409);
    yield (0, pgHandlers_1.checkIfExamExists)(Number(exam_id));
    yield (0, pgHandlers_1.checkIfSubjectExists)(Number(subject_id));
    yield (0, pgHandlers_1.checkIfTopicExists)(Number(topic_id));
    //======================= Add question to database =========================
    const new_question = yield (0, knex_1.default)("questions").insert([
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
    ], "*");
    res.status(201).json({
        status: "success",
        data: new_question,
    });
}));
exports.updateQuestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    //=================== get data from form ===================
    const { question, options, correctAnswer, year, topic_id, exam_id, subject_id, } = req.body;
    //============== Check if at least one field is present for update ==============
    if (!question &&
        !options &&
        !correctAnswer &&
        !year &&
        !topic_id &&
        !exam_id &&
        !subject_id &&
        !req.file)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    //================ object to contain the updated data =========================
    const updatedObject = {};
    //====================== Checks for data from all fields===============================
    if (question) {
        const existingQuestion = yield (0, knex_1.default)("questions")
            .where("question", "=", question)
            .first();
        if (existingQuestion)
            throw new globalErrHandlers_1.AppError("Question already exists", 409);
        updatedObject.question = question;
    }
    if (options)
        updatedObject.options = options;
    if (correctAnswer)
        updatedObject.correctAnswer = correctAnswer;
    if (year)
        updatedObject.year = year;
    if (subject_id) {
        yield (0, pgHandlers_1.checkIfSubjectExists)(Number(subject_id));
        updatedObject.subject_id = subject_id;
    }
    if (exam_id) {
        yield (0, pgHandlers_1.checkIfExamExists)(Number(exam_id));
        updatedObject.exam_id = exam_id;
    }
    if (topic_id) {
        yield (0, pgHandlers_1.checkIfTopicExists)(Number(topic_id));
        updatedObject.topic_id = topic_id;
    }
    //================ Check if the image is to be updated ===========================
    if (req.file) {
        const question = yield (0, knex_1.default)("questions").where({ id }).first();
        if (question === null || question === void 0 ? void 0 : question.cloudinary_id)
            yield cloudinary_1.default.uploader.destroy(question === null || question === void 0 ? void 0 : question.cloudinary_id);
        const result = yield cloudinary_1.default.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_FOLDER_NAME,
        });
        updatedObject.cloudinary_id = result.public_id;
        updatedObject.image_url = result.secure_url;
    }
    // ====================== update the question in the database =====================
    const updatedQuestion = yield (0, knex_1.default)("questions")
        .where({ id })
        .update(updatedObject, "*");
    res.status(200).json({
        status: "success",
        data: updatedQuestion,
    });
}));
exports.deleteQuestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfQuestionExists)(id);
    const question = yield (0, knex_1.default)("questions").where({ id }).first();
    if (question === null || question === void 0 ? void 0 : question.cloudinary_id)
        yield cloudinary_1.default.uploader.destroy(question === null || question === void 0 ? void 0 : question.cloudinary_id);
    yield (0, knex_1.default)("questions").where({ id }).delete();
    res.status(200).json({
        status: "success",
        data: "Question deleted successfully",
    });
}));
exports.getQuestionsByExam = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exam_id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfExamExists)(exam_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const questions = yield knex_1.default
        .select("q.id", "q.question", "q.options", "q.correctAnswer", "q.year", "q.image_url", "q.created_at", "q.updated_at", "et.title as exam", "s.title as subject", "t.title as topic")
        .from("questions as q")
        .leftJoin("examTypes as et", "q.exam_id", "et.id")
        .leftJoin("subjects as s", "q.subject_id", "s.id")
        .leftJoin("topics as t", "q.topic_id", "t.id")
        .where("q.exam_id", exam_id)
        .andWhere("q.question", "like", `%${searchTerm}%`)
        .limit(Number(limit), { skipBinding: skipLimit })
        .offset(Number(offset));
    if (!questions)
        throw new globalErrHandlers_1.AppError("No question found", 404);
    res.status(200).json({
        status: "success",
        data: questions,
    });
}));
exports.getQuestionsBySubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject_id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfSubjectExists)(subject_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const questions = yield knex_1.default
        .select("q.id", "q.question", "q.options", "q.correctAnswer", "q.year", "q.image_url", "q.created_at", "q.updated_at", "et.title as exam", "s.title as subject", "t.title as topic")
        .from("questions as q")
        .leftJoin("examTypes as et", "q.exam_id", "et.id")
        .leftJoin("subjects as s", "q.subject_id", "s.id")
        .leftJoin("topics as t", "q.topic_id", "t.id")
        .where("q.subject_id", subject_id)
        .andWhere("q.question", "like", `%${searchTerm}%`)
        .limit(Number(limit), { skipBinding: skipLimit })
        .offset(Number(offset));
    if (!questions)
        throw new globalErrHandlers_1.AppError("No question found", 404);
    res.status(200).json({
        status: "success",
        data: questions,
    });
}));
exports.getQuestionsByTopic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic_id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfTopicExists)(topic_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const questions = yield knex_1.default
        .select("q.id", "q.question", "q.options", "q.correctAnswer", "q.year", "q.image_url", "q.created_at", "q.updated_at", "et.title as exam", "s.title as subject", "t.title as topic")
        .from("questions as q")
        .leftJoin("examTypes as et", "q.exam_id", "et.id")
        .leftJoin("subjects as s", "q.subject_id", "s.id")
        .leftJoin("topics as t", "q.topic_id", "t.id")
        .where("q.topic_id", topic_id)
        .andWhere("q.question", "like", `%${searchTerm}%`)
        .limit(Number(limit), { skipBinding: skipLimit })
        .offset(Number(offset));
    if (!questions)
        throw new globalErrHandlers_1.AppError("No question found", 404);
    res.status(200).json({
        status: "success",
        data: questions,
    });
}));
