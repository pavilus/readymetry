export const APP_NAME = "Readymetry";
export const APP_TAGLINE = "Certification Readiness Engine";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://readymetry.com";

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  exams: "/exams",
  analytics: "/analytics",
  settings: "/settings",
  exam: (examId: string) => `/exams/${examId}`,
  examSession: (examId: string) => `/exams/${examId}/session`,
  results: (sessionId: string) => `/results/${sessionId}`,
} as const;

export const READINESS_THRESHOLDS = {
  ready: 80,
  almost: 65,
  inProgress: 50,
} as const;

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    priceLabel: "Free",
    description: "Get a feel for the platform",
    features: [
      "5 practice questions per day",
      "Basic readiness score",
      "1 certification track",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    id: "ready",
    name: "Ready",
    price: 29,
    priceLabel: "$29/mo",
    description: "Full exam prep for individuals",
    features: [
      "Unlimited practice exams",
      "Full readiness analytics",
      "Pass probability prediction",
      "Weakness identification",
      "Timed simulations",
      "All certification tracks",
    ],
    cta: "Start 7-Day Free Trial",
    highlight: true,
  },
  {
    id: "workforce",
    name: "Workforce",
    price: null,
    priceLabel: "Custom",
    description: "For teams, schools, and organizations",
    features: [
      "Everything in Ready",
      "Organization dashboard",
      "Employee readiness tracking",
      "Certification compliance reports",
      "Bulk seat management",
      "Priority support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
] as const;

export const CERT_CATEGORIES = [
  {
    id: "cwi",
    code: "AWS CWI",
    name: "Certified Welding Inspector",
    body: "American Welding Society",
    questionCount: 150,
    examDuration: 180,
    available: true,
  },
  {
    id: "api-570",
    code: "API 570",
    name: "Piping Inspector",
    body: "API",
    questionCount: 70,
    examDuration: 90,
    available: false,
  },
  {
    id: "cweng",
    code: "AWS CWEng",
    name: "Certified Welding Engineer",
    body: "American Welding Society",
    questionCount: 200,
    examDuration: 240,
    available: false,
  },
] as const;
