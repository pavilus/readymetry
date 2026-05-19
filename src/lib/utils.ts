import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function getReadinessLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: "Exam Ready", color: "text-success" };
  if (score >= 65) return { label: "Almost Ready", color: "text-warning" };
  if (score >= 50) return { label: "In Progress", color: "text-info" };
  return { label: "Needs Work", color: "text-danger" };
}
