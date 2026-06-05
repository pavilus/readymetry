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
          account_type: string;
          organization_name: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          purchased_exam_credits: number;
          plan_selected_at: string | null;
          free_exam_consumed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          subscription_tier?: "starter" | "ready" | "workforce";
          account_type?: string;
          organization_name?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          purchased_exam_credits?: number;
          plan_selected_at?: string | null;
          free_exam_consumed?: boolean;
        };
        Update: Partial<{
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          subscription_tier: "starter" | "ready" | "workforce";
          account_type: string;
          organization_name: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          purchased_exam_credits: number;
          plan_selected_at: string | null;
          free_exam_consumed: boolean;
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
          exam_part: "A" | "B" | "C";
          review_status: "draft" | "needs_review" | "published" | "retired";
          source_kind: "official_outline" | "general_reference" | "licensed_standard" | "third_party_reference";
          source_edition: string | null;
          source_url: string | null;
          question_pool: "cwi_core" | "d1_1_2020";
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
          exam_part?: "A" | "B" | "C";
          review_status?: "draft" | "needs_review" | "published" | "retired";
          source_kind?: "official_outline" | "general_reference" | "licensed_standard" | "third_party_reference";
          source_edition?: string | null;
          source_url?: string | null;
          question_pool?: "cwi_core" | "d1_1_2020";
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
          exam_part: "A" | "B" | "C";
          review_status: "draft" | "needs_review" | "published" | "retired";
          source_kind: "official_outline" | "general_reference" | "licensed_standard" | "third_party_reference";
          source_edition: string | null;
          source_url: string | null;
          question_pool: "cwi_core" | "d1_1_2020";
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
          question_ids: string[] | null;
          progress: Json | null;
          remaining_seconds: number | null;
          expires_at: string | null;
          access_type: "free" | "credit" | "workforce";
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
          question_ids?: string[] | null;
          progress?: Json | null;
          remaining_seconds?: number | null;
          expires_at?: string | null;
          access_type?: "free" | "credit" | "workforce";
          completed_at?: string | null;
        };
        Update: Partial<{
          status: "in_progress" | "completed" | "abandoned";
          score: number | null;
          correct_answers: number | null;
          time_taken_seconds: number | null;
          completed_at: string | null;
          question_ids: string[] | null;
          progress: Json | null;
          remaining_seconds: number | null;
          expires_at: string | null;
          access_type: "free" | "credit" | "workforce";
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
          confidence_level: "confident" | "unsure" | "guessing" | null;
          flagged: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          time_spent_seconds?: number | null;
          confidence_level?: "confident" | "unsure" | "guessing" | null;
          flagged?: boolean;
        };
        Update: Partial<{
          selected_answer: string;
          is_correct: boolean;
          time_spent_seconds: number | null;
          confidence_level: "confident" | "unsure" | "guessing" | null;
          flagged: boolean;
        }>;
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_number: number;
          user_id: string;
          subject: string;
          category: "general" | "account" | "exam" | "technical";
          message: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          priority: "low" | "medium" | "high" | "urgent";
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          category?: "general" | "account" | "exam" | "technical";
          message: string;
        };
        Update: never;
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
      consume_exam_access: {
        Args: { p_user_id: string };
        Returns: string;
      };
      refund_exam_access: {
        Args: { p_user_id: string; p_access_type: string };
        Returns: undefined;
      };
      increment_exam_credits: {
        Args: { p_user_id: string; p_amount?: number };
        Returns: undefined;
      };
      fulfill_stripe_purchase: {
        Args: {
          p_event_id: string;
          p_event_type: string;
          p_user_id: string;
          p_product: string;
          p_customer_id?: string | null;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
