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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema
            .createTable("examTypes", (table) => {
            table.increments("id").primary();
            table.text("title").notNullable();
            table.timestamps(true, true);
        })
            .createTable("subjects", (table) => {
            table.increments("id").primary();
            table.text("title").notNullable();
            table.timestamps(true, true);
        })
            .createTable("subjectAndExams", (table) => {
            table.increments("id").primary();
            table
                .integer("exam_id")
                .references("id")
                .inTable("examTypes")
                .notNullable();
            table
                .integer("subject_id")
                .references("id")
                .inTable("subjects")
                .notNullable();
            table.timestamps(true, true);
        })
            .createTable("topics", (table) => {
            table.increments("id").primary();
            table.text("title").notNullable();
            table.integer("subject_id").references("subjects.id").notNullable();
            table.timestamps(true, true);
        })
            .createTable("questions", (table) => {
            table.increments("id").primary();
            table.text("question").notNullable();
            table.json("options").notNullable();
            table.string("correctAnswer").notNullable();
            table.integer("year").notNullable();
            table.string("image_url").nullable();
            table.string("cloudinary_id").nullable();
            table.integer("topic_id").references("topics.id").notNullable();
            table.integer("subject_id").references("subjects.id").notNullable();
            table.integer("exam_id").references("examTypes.id").notNullable();
            table.timestamps(true, true);
        })
            .createTable("admins", (table) => {
            table.increments("id").primary();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("email").notNullable();
            table.text("password").notNullable();
            table.enu("role", ["admin", "editor"]).defaultTo("editor").notNullable();
            table
                .enu("status", ["active", "suspended"])
                .defaultTo("active")
                .notNullable();
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema
            .dropTable("questions")
            .dropTable("topics")
            .dropTable("subjectAndExams")
            .dropTable("subjects")
            .dropTable("examTypes")
            .dropTable("admins");
    });
}
exports.down = down;
//# sourceMappingURL=20231031130619_first_migration.js.map