export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          subscription_tier: "starter" | "ready" | "workforce";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
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
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["exam_sessions"]["Row"], "id" | "started_at">;
        Update: Partial<Database["public"]["Tables"]["exam_sessions"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["user_answers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["user_answers"]["Insert"]>;
      };
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
        Insert: Omit<Database["public"]["Tables"]["certifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["certifications"]["Insert"]>;
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
        Returns: Array<{
          category: string;
          accuracy: number;
          question_count: number;
        }>;
      };
    };
    Enums: Record<string, never>;
  };
}
