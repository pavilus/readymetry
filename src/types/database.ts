export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      certifications: {
        Row: {
          id: string;
          code: string;
          name: string;
          body: string;
          description: string | null;
          question_count: number;
          exam_duration_minutes: number;
          passing_score: number;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          body: string;
          description?: string | null;
          question_count?: number;
          exam_duration_minutes?: number;
          passing_score?: number;
          available?: boolean;
        };
        Update: Partial<{
          code: string;
          name: string;
          body: string;
          description: string | null;
          question_count: number;
          exam_duration_minutes: number;
          passing_score: number;
          available: boolean;
        }>;
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          subscription_tier: "starter" | "ready" | "workforce";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          subscription_tier?: "starter" | "ready" | "workforce";
        };
        Update: Partial<{
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          subscription_tier: "starter" | "ready" | "workforce";
        }>;
      };
      user_certifications: {
        Row: {
          id: string;
          user_id: string;
          certification_id: string;
          exam_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          certification_id: string;
          exam_date?: string | null;
        };
        Update: Partial<{
          exam_date: string | null;
        }>;
      };
      questions: {
        Row: {
          id: string;
          certification_id: string;
          category: string;
          subcategory: string | null;
          body: string;
          options: Json;
          correct_answer: string;
          explanation: string | null;
          difficulty: "easy" | "medium" | "hard";
          reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certification_id: string;
          category: string;
          subcategory?: string | null;
          body: string;
          options: Json;
          correct_answer: string;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          reference?: string | null;
        };
        Update: Partial<{
          category: string;
          subcategory: string | null;
          body: string;
          options: Json;
          correct_answer: string;
          explanation: string | null;
          difficulty: "easy" | "medium" | "hard";
          reference: string | null;
        }>;
      };
      exam_sessions: {
        Row: {
          id: string;
          user_id: string;
          certification_id: string;
          exam_type: "practice" | "timed_simulation";
          status: "in_progress" | "completed" | "abandoned";
          score: number | null;
          total_questions: number;
          correct_answers: number | null;
          time_taken_seconds: number | null;
          categories: string[] | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          certification_id: string;
          exam_type?: "practice" | "timed_simulation";
          status?: "in_progress" | "completed" | "abandoned";
          score?: number | null;
          total_questions: number;
          correct_answers?: number | null;
          time_taken_seconds?: number | null;
          categories?: string[] | null;
          completed_at?: string | null;
        };
        Update: Partial<{
          status: "in_progress" | "completed" | "abandoned";
          score: number | null;
          correct_answers: number | null;
          time_taken_seconds: number | null;
          completed_at: string | null;
        }>;
      };
      user_answers: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          time_spent_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          time_spent_seconds?: number | null;
        };
        Update: Partial<{
          selected_answer: string;
          is_correct: boolean;
          time_spent_seconds: number | null;
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_readiness_score: {
        Args: { p_user_id: string; p_certification_id: string };
        Returns: number;
      };
      get_category_breakdown: {
        Args: { p_user_id: string; p_certification_id: string };
        Returns: Array<{ category: string; accuracy: number; question_count: number }>;
      };
    };
    Enums: Record<string, never>;
  };
}
