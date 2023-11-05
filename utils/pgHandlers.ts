import knex from "../knex_src/config/knex";

//============Exams util functions===================

export const checkIfExamExists = async (id?: number) => {
  if (!id) throw new Error("Exam ID is required");
  const exam = await knex("examTypes").where({ id }).first();
  if (!exam) {
    throw new Error("Exam ID is invalid");
  }
};

export const getExamById = async (id: number) => {
  const exam = await knex("examTypes").where({ id }).first();
  return exam;
};

export const getExamSubjectsList = async (id: number) => {
  const subjectList = await knex("subjectAndExams")
    .select("subject_id")
    .where({ exam_id: id });
  let subject_result: string[] = [];
  await Promise.all(
    subjectList.map(async (subject) => {
      const data = await getSubjectById(subject.subject_id);
      if (data) subject_result.push(data.title);
    })
  );
  return subject_result;
};

export const getExamQuestionsList = async (id: number) => {
  const questionsList = await knex("questions").where({ exam_id: id });
  return questionsList;
};

//================Subjects util functions=======================

export const getSubjectById = async (id: number) => {
  const subject = await knex("subjects").where({ id }).first();
  return subject;
};

export const checkIfSubjectExists = async (id?: number) => {
  if (!id) throw new Error("Subject ID is required");
  const subject = await knex("subjects").where({ id }).first();
  if (!subject) {
    throw new Error("Subject ID is invalid");
  }
};

export const getSubjectExamList = async (id: number) => {
  const examsList = await knex("subjectAndExams")
    .select("exam_id")
    .where({ subject_id: id });
  let exams_result: string[] = [];
  await Promise.all(
    examsList.map(async (exam) => {
      const data = await getExamById(exam.exam_id);
      if (data) exams_result.push(data.title);
    })
  );
  return exams_result;
};

export const removeSubjectExamType = async (
  exam_id: number,
  subject_id: number
) => {
  await checkIfExamSubjectInTable(exam_id, subject_id);
  await knex("subjectAndExams")
    .where({ subject_id })
    .andWhere({ exam_id })
    .delete();
  return true;
};

//============Topics Util Functions===============
export const getTopicById = async (id: number) => {
  const topic = await knex("topics").where({ id }).first();
  return topic;
};

export const checkIfTopicExists = async (id?: number) => {
  if (!id) throw new Error("Topic ID is required");
  const topic = await knex("topics").where({ id }).first();
  if (!topic) {
    throw new Error("Topic ID is invalid");
  }
};

//============Topics Util Functions===============
export const getQuestionById = async (id: number) => {
  const question = await knex("questions").where({ id }).first();
  return question;
};

export const checkIfQuestionExists = async (id?: number) => {
  if (!id) throw new Error("Question ID is required");
  const question = await knex("questions").where({ id }).first();
  if (!question) {
    throw new Error("Question ID is invalid");
  }
};

//==========UTIL FUNCTIONS======================
export const checkIfExamSubjectInTable = async (
  exam_id?: number,
  subject_id?: number
) => {
  if (!exam_id) throw new Error("Exam ID is required");
  if (!subject_id) throw new Error("Subject ID is required");
  const subjectAndExam = await knex("subjectAndExams")
    .where({ exam_id })
    .andWhere({ subject_id })
    .first();
  if (!subjectAndExam) {
    throw new Error("Record does not exist");
  }
};

//=====================Admin Functions================
export const checkIfEmailIsCorrect = (email: string) => {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegexp.test(email)) throw new Error("Invalid email address");
};

export const checkIfAdminExists = async (id?: number) => {
  if (!id) throw new Error("Admin ID is required");
  const admin = await knex("admins").where({ id }).first();
  if (!admin) {
    throw new Error("Admin profile not found");
  }
};
