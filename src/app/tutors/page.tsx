import type { Metadata } from "next";
import { Suspense } from "react";

import { TutorsPageContent } from "@/components/tutors/tutors-page-content";
import { parseTutorFilters } from "@/services/tutors";

export const metadata: Metadata = {
  title: "Find Tutors",
  description:
    "Search and filter expert tutors by subject, hourly rate, experience, rating, availability, and city.",
};

interface TutorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TutorsPage({ searchParams }: TutorsPageProps) {
  const params = await searchParams;
  const filters = parseTutorFilters(params);

  return (
    <Suspense fallback={<TutorsPageSkeleton />}>
      <TutorsPageContent filters={filters} />
    </Suspense>
  );
}

function TutorsPageSkeleton() {
  return (
    <div className="section-container py-12">
      <div className="bg-muted mb-8 h-10 w-64 animate-pulse rounded-xl" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-80 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
