import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";
import { getAllSubjectSlugs } from "@/services/subjects";
import { getAllTutorIds } from "@/services/tutors";

const staticRoutes = [
  "",
  "/about",
  "/tutors",
  "/subjects",
  "/how-it-works",
  "/faq",
  "/contact",
  "/become-a-tutor",
  "/tutor",
  "/tutor/profile",
  "/tutor/availability",
  "/dashboard",
  "/dashboard/bookings",
  "/login",
  "/signup",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const tutorEntries: MetadataRoute.Sitemap = getAllTutorIds().map((id) => ({
    url: absoluteUrl(`/tutors/${id}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const subjectEntries: MetadataRoute.Sitemap = getAllSubjectSlugs().map((slug) => ({
    url: absoluteUrl(`/subjects/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...tutorEntries, ...subjectEntries];
}
