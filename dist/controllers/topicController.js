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
exports.getTopicsBySubject = exports.deleteTopic = exports.updateTopic = exports.createTopic = exports.getTopic = exports.getTopics = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const knex_1 = __importDefault(require("../knex_src/config/knex"));
const pgHandlers_1 = require("../utils/pgHandlers");
const globalErrHandlers_1 = require("../middlewares/globalErrHandlers");
exports.getTopics = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const topics = yield knex_1.default
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
        throw new globalErrHandlers_1.AppError("No topic found", 404);
    }
    else {
        res.status(200).json({
            status: "success",
            data: topics,
        });
    }
}));
exports.getTopic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfTopicExists)(id);
    const topic = yield knex_1.default
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
        throw new globalErrHandlers_1.AppError("No topic found", 404);
    }
    else {
        res.status(200).json({
            status: "success",
            data: topic,
        });
    }
}));
exports.createTopic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subject_id } = req.body;
    if (!title || !subject_id)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    const topic = yield (0, knex_1.default)("topics").where("title", "=", title).first();
    if (topic) {
        throw new globalErrHandlers_1.AppError("Topic already exists", 409);
    }
    else {
        yield (0, pgHandlers_1.checkIfSubjectExists)(Number(subject_id));
        const topic = yield (0, knex_1.default)("topics").insert([{ title, subject_id }], "*");
        res.status(201).json({
            status: "success",
            data: topic,
        });
    }
}));
exports.updateTopic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { title, subject_id } = req.body;
    const updatedObject = {};
    if (!title && !subject_id)
        throw new globalErrHandlers_1.AppError("Missing required field(s)", 404);
    if (title) {
        const topic = yield (0, knex_1.default)("topics").where("title", "=", title).first();
        if (topic)
            throw new globalErrHandlers_1.AppError("Topic already exists", 409);
        updatedObject.title = title;
    }
    if (subject_id) {
        yield (0, pgHandlers_1.checkIfSubjectExists)(Number(subject_id));
        updatedObject.subject_id = subject_id;
    }
    const updated_topic = yield (0, knex_1.default)("topics")
        .where({ id })
        .update(updatedObject, "*");
    res.status(200).json({
        status: "success",
        data: updated_topic,
    });
}));
exports.deleteTopic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfTopicExists)(id);
    const questions_count = yield (0, knex_1.default)("questions")
        .where({ topic_id: id })
        .count()
        .first();
    const questions_result = Number(questions_count === null || questions_count === void 0 ? void 0 : questions_count.count);
    if (questions_result > 0)
        throw new globalErrHandlers_1.AppError("This topic has questions", 403);
    yield (0, knex_1.default)("topics").where({ id }).delete();
    res.status(200).json({
        status: "success",
        data: "Topic deleted successfully",
    });
}));
exports.getTopicsBySubject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject_id = Number(req.params.id);
    yield (0, pgHandlers_1.checkIfSubjectExists)(subject_id);
    const searchTerm = req.query.search || "";
    const limit = req.query.limit;
    const offset = req.query.offset || 0;
    let skipLimit = true;
    if (limit)
        skipLimit = false;
    const topics = yield knex_1.default
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
    if (!topics)
        throw new globalErrHandlers_1.AppError("No topic found for this subject", 404);
    res.status(200).json({
        status: "success",
        data: topics,
    });
}));
//# sourceMappingURL=topicController.js.map