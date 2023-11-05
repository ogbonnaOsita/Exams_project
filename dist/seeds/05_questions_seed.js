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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const faker_1 = require("@faker-js/faker");
const SEED_COUNT = 200;
const options = ["optionA", "optionB", "optionC", "optionD"];
const createQuestion = (topics_count, subjects_count, exams_count) => ({
    question: faker_1.faker.lorem.lines({ min: 1, max: 3 }),
    options: {
        optionA: faker_1.faker.lorem.words({ min: 2, max: 5 }),
        optionB: faker_1.faker.lorem.words({ min: 2, max: 5 }),
        optionC: faker_1.faker.lorem.words({ min: 2, max: 5 }),
        optionD: faker_1.faker.lorem.words({ min: 2, max: 5 }),
    },
    correctAnswer: options[Math.floor(Math.random() * options.length)],
    year: faker_1.faker.datatype.number({ min: 2010, max: 2023 }),
    image_url: faker_1.faker.image.url(),
    topic_id: faker_1.faker.datatype.number({ min: 1, max: topics_count }),
    subject_id: faker_1.faker.datatype.number({ min: 1, max: subjects_count }),
    exam_id: faker_1.faker.datatype.number({ min: 1, max: exams_count }),
});
function seed(knex) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex("questions").del();
        const subjects_count = (_a = (yield knex("subjects").count().first())) === null || _a === void 0 ? void 0 : _a.count;
        const topics_count = (_b = (yield knex("topics").count().first())) === null || _b === void 0 ? void 0 : _b.count;
        const exams_count = (_c = (yield knex("examTypes").count().first())) === null || _c === void 0 ? void 0 : _c.count;
        const questions = Array(SEED_COUNT)
            .fill(null)
            .map(() => createQuestion(Number(topics_count), Number(subjects_count), Number(exams_count)));
        // Inserts seed entries
        yield knex("questions").insert(questions);
    });
}
exports.seed = seed;
