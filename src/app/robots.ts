import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/about", "/contact", "/privacy", "/terms", "/cookies", "/refund", "/accessibility", "/exam-disclaimer"],
      disallow: ["/admin", "/dashboard", "/analytics", "/exams", "/results", "/settings", "/checkout", "/api"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
