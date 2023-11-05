import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("examTypes").del();
  const exams: { title: string }[] = [
    { title: "jamb" },
    { title: "waec" },
  ];

  // Inserts seed entries
  await knex("examTypes").insert(exams);
}
