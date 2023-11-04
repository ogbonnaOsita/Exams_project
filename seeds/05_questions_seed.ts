import { faker } from "@faker-js/faker";
import { Knex } from "knex";
import { Question } from "../src/types";

const SEED_COUNT = 200;

const options = ["optionA", "optionB", "optionC", "optionD"];

const createQuestion = (
  topics_count: number,
  subjects_count: number,
  exams_count: number
): Partial<Question> => ({
  question: faker.lorem.lines({ min: 1, max: 3 }),
  options: {
    optionA: faker.lorem.words({ min: 2, max: 5 }),
    optionB: faker.lorem.words({ min: 2, max: 5 }),
    optionC: faker.lorem.words({ min: 2, max: 5 }),
    optionD: faker.lorem.words({ min: 2, max: 5 }),
  },
  correctAnswer: options[Math.floor(Math.random() * options.length)],
  year: faker.datatype.number({ min: 2010, max: 2023 }),
  image_url: faker.image.url(),
  topic_id: faker.datatype.number({ min: 1, max: topics_count }),
  subject_id: faker.datatype.number({ min: 1, max: subjects_count }),
  exam_id: faker.datatype.number({ min: 1, max: exams_count }),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("questions").del();

  const subjects_count = (await knex("subjects").count().first())?.count;
  const topics_count = (await knex("topics").count().first())?.count;
  const exams_count = (await knex("examTypes").count().first())?.count;
  const questions = Array(SEED_COUNT)
    .fill(null)
    .map(() =>
      createQuestion(
        Number(topics_count),
        Number(subjects_count),
        Number(exams_count)
      )
    );

  // Inserts seed entries
  await knex("questions").insert(questions);
}
