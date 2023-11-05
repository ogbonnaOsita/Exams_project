import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("subjectAndExams").del();

  const subjects: { subject_id: number; exam_id: number }[] = [
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
  await knex("subjectAndExams").insert(subjects);
}
