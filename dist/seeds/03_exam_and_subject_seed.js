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
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex("subjectAndExams").del();
        const subjects = [
            { subject_id: 1, exam_id: 1 },
            { subject_id: 2, exam_id: 1 },
            { subject_id: 3, exam_id: 1 },
            { subject_id: 4, exam_id: 1 },
            { subject_id: 5, exam_id: 1 },
            { subject_id: 6, exam_id: 1 },
            { subject_id: 7, exam_id: 1 },
            { subject_id: 8, exam_id: 1 },
            { subject_id: 9, exam_id: 1 },
            { subject_id: 10, exam_id: 1 },
            { subject_id: 3, exam_id: 2 },
            { subject_id: 4, exam_id: 2 },
            { subject_id: 5, exam_id: 2 },
            { subject_id: 6, exam_id: 2 },
            { subject_id: 7, exam_id: 2 },
            { subject_id: 8, exam_id: 2 },
        ];
        // Inserts seed entries
        yield knex("subjectAndExams").insert(subjects);
    });
}
exports.seed = seed;
