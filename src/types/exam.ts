export interface Question {
  id: string;
  body: string;
  options: { key: string; text: string }[];
  correct_answer: string;
  explanation: string | null;
  category: string;
  subcategory: string | null;
  difficulty: "easy" | "medium" | "hard";
  reference: string | null;
}

export interface UserAnswer {
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_spent_seconds: number;
}

export interface ExamSession {
  id: string;
  certification_id: string;
  exam_type: "practice" | "timed_simulation";
  questions: Question[];
  answers: UserAnswer[];
  time_limit_seconds: number | null;
  started_at: Date;
}

export interface ExamResult {
  session_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  category_breakdown: CategoryResult[];
  pass_probability: number;
  readiness_delta: number;
}

export interface CategoryResult {
  category: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface ReadinessScore {
  overall: number;
  trend: number;
  sessions_completed: number;
  category_breakdown: CategoryResult[];
  last_updated: string;
}
