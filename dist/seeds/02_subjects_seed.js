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
        yield knex("subjects").del();
        const subjects = [
            { title: "mathematics" },
            { title: "english" },
            { title: "physics" },
            { title: "biology" },
            { title: "chemistry" },
            { title: "geography" },
            { title: "government" },
            { title: "civic education" },
            { title: "economics" },
            { title: "agricultural science" },
        ];
        // Inserts seed entries
        yield knex("subjects").insert(subjects);
    });
}
exports.seed = seed;
//# sourceMappingURL=02_subjects_seed.js.map