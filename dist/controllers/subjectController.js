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
exports.deleteSubjectExamList = exports.addSubjectExamsList = exports.getSubjectExamsList = exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubject = exports.getSubjects = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const knex_1 = __importDefault(require("../config/knex"));
const pgHandlers_1 = require("../utils/pgHandlers");
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
exports.getSubjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subjects = yield knex_1.default
        .select("s.id", "s.title", "s.created_at", "s.updated_at")
        .countDistinct("t.id as topics_count")
        .countDistinct("q.id as questions_count")
        .select(knex_1.default.raw("array_remove(array_agg(distinct et.title), null) as exam_types"))
        .from("subjects as s")
        .leftJoin("topics as t", "s.id", "t.subject_id")
        .leftJoin("questions as q", "s.id", "q.subject_id")
        .leftJoin("subjectAndExams as se", "s.id", "se.subject_id")
        .leftJoin("examTypes as et", "se.exam_id", "et.id")
        .groupBy("s.id", "s.title")
        .orderBy("s.id");
    if (!subjects) {
        throw new globalErrHandlers_1.AppError("No subject found", 404);
    }
    else {
        res.status(200).json({
            status: "success",
            data: subjects,
        });
    }
}));
exports.getSubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfSubjectExists)(id);
    const subject = yield knex_1.default
        .select("s.id", "s.title", "s.created_at", "s.updated_at")
        .countDistinct("t.id as topics_count")
        .countDistinct("q.id as questions_count")
        .select(knex_1.default.raw("array_remove(array_agg(distinct et.title), null) as exam_types"))
        .from("subjects as s")
        .leftJoin("topics as t", "s.id", "t.subject_id")
        .leftJoin("questions as q", "s.id", "q.subject_id")
        .leftJoin("subjectAndExams as se", "s.id", "se.subject_id")
        .leftJoin("examTypes as et", "se.exam_id", "et.id")
        .where("s.id", id)
        .groupBy("s.id", "s.title")
        .orderBy("s.id");
    if (!subject) {
        throw new globalErrHandlers_1.AppError("No subject found", 404);
    }
    else {
        res.status(200).json({
            status: "success",
            data: subject,
        });
    }
}));
exports.createSubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, examTypes } = req.body;
    if (!title) {
        throw new globalErrHandlers_1.AppError("Missing required field", 404);
    }
    else if (!examTypes) {
        throw new globalErrHandlers_1.AppError("Subject must belong to an exam type", 404);
    }
    else {
        if (!Array.isArray(examTypes))
            throw new globalErrHandlers_1.AppError("the field examTypes must be an array", 404);
        const exam = yield (0, knex_1.default)("subjects").where("title", "=", title).first();
        if (exam) {
            throw new globalErrHandlers_1.AppError("Subject already exists", 409);
        }
        else {
            const subject = yield (0, knex_1.default)("subjects")
                .insert([{ title }], "*")
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                // to output the exam list for the subject
                let exams = [];
                yield Promise.all(examTypes.map((examType) => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, pgHandlers_1.checkIfExamExists)(Number(examType));
                    yield (0, knex_1.default)("subjectAndExams").insert({
                        subject_id: res[0].id,
                        exam_id: Number(examType),
                    });
                    const exam = yield (0, pgHandlers_1.getExamById)(Number(examType));
                    if (exam)
                        exams.push(exam.title);
                })));
                const data = {
                    subject: res[0],
                    examsList: exams,
                };
                return data;
            }));
            res.status(201).json({
                status: "success",
                data: subject,
            });
        }
    }
}));
exports.updateSubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title)
        throw new globalErrHandlers_1.AppError("Missing required field", 404);
    if (title) {
        const subject = yield (0, knex_1.default)("subjects").where("title", "=", title);
        if (subject.length > 0) {
            throw new globalErrHandlers_1.AppError("Subject already exists", 409);
        }
        else {
            yield (0, pgHandlers_1.checkIfSubjectExists)(id);
            const subject = yield (0, knex_1.default)("subjects")
                .where({ id })
                .update({ title }, "*");
            res.status(201).json({
                status: "success",
                data: subject[0],
            });
        }
    }
}));
exports.deleteSubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfSubjectExists)(id);
    const topics_count = yield (0, knex_1.default)("topics")
        .where({ subject_id: id })
        .count()
        .first();
    const questions_count = yield (0, knex_1.default)("topics")
        .where({ subject_id: id })
        .count()
        .first();
    const topics_result = Number(topics_count === null || topics_count === void 0 ? void 0 : topics_count.count);
    const questions_result = Number(questions_count === null || questions_count === void 0 ? void 0 : questions_count.count);
    if (topics_result > 0)
        throw new globalErrHandlers_1.AppError("This subject has topics", 403);
    if (questions_result > 0)
        throw new globalErrHandlers_1.AppError("This subject has questions", 403);
    yield (0, knex_1.default)("subjectAndExams").where({ subject_id: id }).delete();
    yield (0, knex_1.default)("subjects").where({ id }).delete();
    res.status(200).json({
        status: "success",
        data: "Subject deleted successfully",
    });
}));
// =================Subject Exam List functions=========================
exports.getSubjectExamsList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfSubjectExists)(id);
    const list = yield (0, pgHandlers_1.getSubjectExamList)(id);
    if (list.length > 0) {
        res.status(200).json({
            status: "success",
            data: list,
        });
    }
    else {
        throw new globalErrHandlers_1.AppError("No exam Type for this subject", 404);
    }
}));
exports.addSubjectExamsList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = Number(req.params.id);
    const { exam_id } = req.body;
    if (!exam_id)
        throw new globalErrHandlers_1.AppError("Missing required field", 404);
    yield (0, pgHandlers_1.checkIfSubjectExists)(id);
    yield (0, pgHandlers_1.checkIfExamExists)(Number(exam_id));
    const has_exam = yield (0, knex_1.default)("subjectAndExams")
        .where({ subject_id: id })
        .andWhere({ exam_id });
    if (has_exam.length > 0) {
        throw new globalErrHandlers_1.AppError("Subject already have this exam type", 409);
    }
    else {
        yield (0, knex_1.default)("subjectAndExams").insert({ subject_id: id, exam_id });
        const exam = (_a = (yield (0, pgHandlers_1.getExamById)(Number(exam_id)))) === null || _a === void 0 ? void 0 : _a.title;
        const subject = (_b = (yield (0, pgHandlers_1.getSubjectById)(Number(id)))) === null || _b === void 0 ? void 0 : _b.title;
        res.status(200).json({
            status: "success",
            data: {
                exam,
                subject,
            },
        });
    }
}));
exports.deleteSubjectExamList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject_id = Number(req.params.id);
    const { exam_id } = req.body;
    yield (0, pgHandlers_1.checkIfSubjectExists)(subject_id);
    const noOfExamTypes = yield (0, pgHandlers_1.getSubjectExamList)(subject_id);
    if (noOfExamTypes.length <= 1) {
        throw new globalErrHandlers_1.AppError("Subject must have at least one exam type", 404);
    }
    else {
        const has_questions = yield (0, knex_1.default)("questions")
            .where({ subject_id })
            .andWhere({ exam_id });
        if (has_questions.length > 0) {
            throw new globalErrHandlers_1.AppError("There are questions belonging to this exam type and subject", 403);
        }
        if (subject_id && exam_id) {
            const status = yield (0, pgHandlers_1.removeSubjectExamType)(exam_id, subject_id);
            if (status) {
                res.status(200).json({
                    status: "success",
                    data: "Deleted successfully",
                });
            }
        }
    }
}));
