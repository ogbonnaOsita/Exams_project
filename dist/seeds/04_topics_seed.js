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
const SEED_COUNT = 100;
const createTopic = (subjects_count) => ({
    title: faker_1.faker.lorem.words(3),
    subject_id: faker_1.faker.datatype.number({ min: 1, max: subjects_count }),
});
function seed(knex) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex("topics").del();
        const subjects_count = (_a = (yield knex("subjects").count().first())) === null || _a === void 0 ? void 0 : _a.count;
        const topics = Array(SEED_COUNT)
            .fill(null)
            .map(() => createTopic(Number(subjects_count)));
        yield knex("topics").insert(topics);
    });
}
exports.seed = seed;
//# sourceMappingURL=04_topics_seed.js.map