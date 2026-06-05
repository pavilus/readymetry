import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/refund",
    "/accessibility",
    "/exam-disclaimer",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" ? 0.9 : 0.5,
  }));
}
