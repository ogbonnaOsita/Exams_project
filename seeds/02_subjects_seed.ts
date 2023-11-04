import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("subjects").del();

  const subjects: { title: string }[] = [
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
  await knex("subjects").insert(subjects);
}
