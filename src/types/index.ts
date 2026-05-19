export type { Database } from "./database";
export type {
  Question,
  UserAnswer,
  ExamSession,
  ExamResult,
  CategoryResult,
  ReadinessScore,
} from "./exam";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: "starter" | "ready" | "workforce";
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
