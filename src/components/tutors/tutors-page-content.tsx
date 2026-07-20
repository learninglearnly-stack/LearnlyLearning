import { Suspense } from "react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { EmptyState } from "@/components/tutors/empty-state";
import { TutorCard } from "@/components/tutors/tutor-card";
import { TutorFilters } from "@/components/tutors/tutor-filters";
import { TutorsPagination } from "@/components/tutors/tutors-pagination";
import { getSubjects } from "@/services/subjects";
import { getTutors } from "@/services/tutors";
import type { PaginatedResult, Tutor, TutorFilters as TutorFiltersType } from "@/types";

interface TutorsGridProps {
  filters: TutorFiltersType;
  result: PaginatedResult<Tutor>;
}

function TutorsGrid({ filters, result }: TutorsGridProps) {
  if (result.data.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <p className="text-muted-foreground mb-6 text-sm">
        {result.total} tutor{result.total !== 1 ? "s" : ""} found
      </p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {result.data.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
      <Suspense fallback={null}>
        <TutorsPagination page={result.page} totalPages={result.totalPages} total={result.total} />
      </Suspense>
    </>
  );
}

interface TutorsPageContentProps {
  filters: TutorFiltersType;
}

export async function TutorsPageContent({ filters }: TutorsPageContentProps) {
  const [subjects, result] = await Promise.all([
    getSubjects(),
    getTutors(filters),
  ]);

  const subjectOptions = subjects.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <MarketingLayout>
      <section className="bg-muted/30 border-b py-10">
        <div className="section-container">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find Your Tutor</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Browse expert tutors, filter by subject, rate, and availability. Book lessons and
            arrange payment directly.
          </p>
        </div>
      </section>

      <section className="section-container py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="bg-muted h-96 animate-pulse rounded-2xl" />}>
              <TutorFilters subjects={subjectOptions} />
            </Suspense>
          </aside>
          <div className="lg:col-span-3">
            <TutorsGrid filters={filters} result={result} />
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
