import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("questions")
    .dropTable("topics")
    .dropTable("subjectAndExams")
    .dropTable("subjects")
    .dropTable("examTypes")
    .dropTable("admins");
}
