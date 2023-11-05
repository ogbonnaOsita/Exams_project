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
exports.checkIfAdminExists = exports.checkIfEmailIsCorrect = exports.checkIfExamSubjectInTable = exports.checkIfQuestionExists = exports.getQuestionById = exports.checkIfTopicExists = exports.getTopicById = exports.removeSubjectExamType = exports.getSubjectExamList = exports.checkIfSubjectExists = exports.getSubjectById = exports.getExamQuestionsList = exports.getExamSubjectsList = exports.getExamById = exports.checkIfExamExists = void 0;
const knex_1 = __importDefault(require("../config/knex"));
//============Exams util functions===================
const checkIfExamExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Exam ID is required");
    const exam = yield (0, knex_1.default)("examTypes").where({ id }).first();
    if (!exam) {
        throw new Error("Exam ID is invalid");
    }
});
exports.checkIfExamExists = checkIfExamExists;
const getExamById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield (0, knex_1.default)("examTypes").where({ id }).first();
    return exam;
});
exports.getExamById = getExamById;
const getExamSubjectsList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subjectList = yield (0, knex_1.default)("subjectAndExams")
        .select("subject_id")
        .where({ exam_id: id });
    let subject_result = [];
    yield Promise.all(subjectList.map((subject) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, exports.getSubjectById)(subject.subject_id);
        if (data)
            subject_result.push(data.title);
    })));
    return subject_result;
});
exports.getExamSubjectsList = getExamSubjectsList;
const getExamQuestionsList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const questionsList = yield (0, knex_1.default)("questions").where({ exam_id: id });
    return questionsList;
});
exports.getExamQuestionsList = getExamQuestionsList;
//================Subjects util functions=======================
const getSubjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = yield (0, knex_1.default)("subjects").where({ id }).first();
    return subject;
});
exports.getSubjectById = getSubjectById;
const checkIfSubjectExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Subject ID is required");
    const subject = yield (0, knex_1.default)("subjects").where({ id }).first();
    if (!subject) {
        throw new Error("Subject ID is invalid");
    }
});
exports.checkIfSubjectExists = checkIfSubjectExists;
const getSubjectExamList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const examsList = yield (0, knex_1.default)("subjectAndExams")
        .select("exam_id")
        .where({ subject_id: id });
    let exams_result = [];
    yield Promise.all(examsList.map((exam) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, exports.getExamById)(exam.exam_id);
        if (data)
            exams_result.push(data.title);
    })));
    return exams_result;
});
exports.getSubjectExamList = getSubjectExamList;
const removeSubjectExamType = (exam_id, subject_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.checkIfExamSubjectInTable)(exam_id, subject_id);
    yield (0, knex_1.default)("subjectAndExams")
        .where({ subject_id })
        .andWhere({ exam_id })
        .delete();
    return true;
});
exports.removeSubjectExamType = removeSubjectExamType;
//============Topics Util Functions===============
const getTopicById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield (0, knex_1.default)("topics").where({ id }).first();
    return topic;
});
exports.getTopicById = getTopicById;
const checkIfTopicExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Topic ID is required");
    const topic = yield (0, knex_1.default)("topics").where({ id }).first();
    if (!topic) {
        throw new Error("Topic ID is invalid");
    }
});
exports.checkIfTopicExists = checkIfTopicExists;
//============Topics Util Functions===============
const getQuestionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield (0, knex_1.default)("questions").where({ id }).first();
    return question;
});
exports.getQuestionById = getQuestionById;
const checkIfQuestionExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Question ID is required");
    const question = yield (0, knex_1.default)("questions").where({ id }).first();
    if (!question) {
        throw new Error("Question ID is invalid");
    }
});
exports.checkIfQuestionExists = checkIfQuestionExists;
//==========UTIL FUNCTIONS======================
const checkIfExamSubjectInTable = (exam_id, subject_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exam_id)
        throw new Error("Exam ID is required");
    if (!subject_id)
        throw new Error("Subject ID is required");
    const subjectAndExam = yield (0, knex_1.default)("subjectAndExams")
        .where({ exam_id })
        .andWhere({ subject_id })
        .first();
    if (!subjectAndExam) {
        throw new Error("Record does not exist");
    }
});
exports.checkIfExamSubjectInTable = checkIfExamSubjectInTable;
//=====================Admin Functions================
const checkIfEmailIsCorrect = (email) => {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email))
        throw new Error("Invalid email address");
};
exports.checkIfEmailIsCorrect = checkIfEmailIsCorrect;
const checkIfAdminExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Admin ID is required");
    const admin = yield (0, knex_1.default)("admins").where({ id }).first();
    if (!admin) {
        throw new Error("Admin profile not found");
    }
});
exports.checkIfAdminExists = checkIfAdminExists;
