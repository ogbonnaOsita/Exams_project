export interface Exam {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface Subject {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface ExamWithSubject {
  id: number;
  subject_id: number;
  exam_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Topic {
  id: number;
  title: string;
  subject_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: number;
  question: string;
  options: object;
  correctAnswer: string;
  year: number;
  image_url: string;
  cloudinary_id: string;
  topic_id: number;
  exam_id: number;
  subject_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tables {
    examTypes: Exam;
    subjects: Subject;
    subjectAndExams: ExamWithSubject;
    topics: Topic;
    questions: Question;
    admins: Admin;
  }
}
