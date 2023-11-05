import { faker } from "@faker-js/faker";
import { Knex } from "knex";
import { Topic } from "index";

const SEED_COUNT = 100;

const createTopic = (subjects_count: number): Partial<Topic> => ({
  title: faker.lorem.words(3),
  subject_id: faker.datatype.number({ min: 1, max: subjects_count }),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("topics").del();

  const subjects_count = (await knex("subjects").count().first())?.count;
  const topics = Array(SEED_COUNT)
    .fill(null)
    .map(() => createTopic(Number(subjects_count)));
  await knex("topics").insert(topics);
}
