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
exports.getExamSubjectList = exports.deleteExam = exports.updateExam = exports.createExam = exports.getExam = exports.getExams = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const knex_1 = __importDefault(require("../knex_src/config/knex"));
const pgHandlers_1 = require("../utils/pgHandlers");
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
exports.getExams = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exams = yield knex_1.default
        .select("examTypes.id as examID", "examTypes.title", "examTypes.created_at", "examTypes.updated_at", knex_1.default.raw("COUNT(DISTINCT questions.id) as questions_count"))
        .countDistinct("subjects.id as subjects_count")
        .from("examTypes")
        .leftJoin("subjectAndExams as se", "examTypes.id", "se.exam_id")
        .leftJoin("subjects", "se.subject_id", "subjects.id")
        .leftJoin("questions", "examTypes.id", "questions.exam_id")
        .groupBy("examTypes.id", "examTypes.title")
        .orderBy("examTypes.id");
    if (!exams) {
        throw new globalErrHandlers_1.AppError("No exam type found", 404);
    }
    else {
        res.status(200).json({
            status: "success",
            data: exams,
        });
    }
}));
exports.getExam = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfExamExists)(id);
    // const exam = (await knex("examTypes").where({ id }).first())?.title;
    // const noOfSubjects = (await getExamSubjectsList(id)).length;
    // const noOfQuestions = (await getExamQuestionsList(id)).length;
    const exam = yield knex_1.default
        .select("et.id as examID", "et.title", "et.created_at", "et.updated_at", knex_1.default.raw("COUNT(DISTINCT q.id) as questions_count"), knex_1.default.raw("COUNT(DISTINCT s.id) as subjects_count"))
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
}));
exports.createExam = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    if (!title) {
        throw new globalErrHandlers_1.AppError("Missing required field", 404);
    }
    else {
        const exam = yield (0, knex_1.default)("examTypes").where("title", "=", title).first();
        if (exam) {
            throw new globalErrHandlers_1.AppError("Exam already exists", 409);
        }
        else {
            const exam = yield (0, knex_1.default)("examTypes").insert([{ title }], "*");
            res.status(201).json({
                status: "success",
                data: exam[0],
            });
        }
    }
}));
exports.updateExam = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const id = Number(req.params.id);
    if (!title) {
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    }
    const exam = yield (0, knex_1.default)("examTypes").where("title", "=", title).first();
    if (exam) {
        throw new globalErrHandlers_1.AppError("Exam already exists", 409);
    }
    else {
        yield (0, pgHandlers_1.checkIfExamExists)(id);
        const exam = yield (0, knex_1.default)("examTypes").where({ id }).update({ title }, "*");
        res.status(200).json({
            status: "success",
            data: exam[0],
        });
    }
}));
exports.deleteExam = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfExamExists)(id);
    //check if exam has questions
    const count_result = yield (0, knex_1.default)("questions")
        .where({ exam_id: id })
        .count()
        .first();
    const questions_count = Number(count_result === null || count_result === void 0 ? void 0 : count_result.count);
    if (questions_count > 0)
        throw new globalErrHandlers_1.AppError("This exam has questions", 403);
    //check if it has subjects
    const has_subjects = yield (0, knex_1.default)("subjectAndExams").where({ exam_id: id });
    if (has_subjects) {
        yield (0, knex_1.default)("subjectAndExams").where({ exam_id: id }).delete();
    }
    yield (0, knex_1.default)("examTypes").where({ id }).delete();
    res.status(200).json({
        status: "success",
        message: "Exam deleted successfully",
    });
}));
//=============Exam subject List functions=============
exports.getExamSubjectList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfExamExists)(id);
    const list = yield (0, pgHandlers_1.getExamSubjectsList)(id);
    if (list.length > 0) {
        res.status(200).json({
            status: "success",
            data: list,
        });
    }
    else {
        throw new globalErrHandlers_1.AppError("No Subject for this exam type", 404);
    }
}));
//# sourceMappingURL=examController.js.map