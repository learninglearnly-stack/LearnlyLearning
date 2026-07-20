import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { EmptyState } from "@/components/tutors/empty-state";
import { TutorCard } from "@/components/tutors/tutor-card";
import { TutorFilters } from "@/components/tutors/tutor-filters";
import { TutorsPagination } from "@/components/tutors/tutors-pagination";
import { Badge } from "@/components/ui/badge";
import { getSubjectBySlug, getSubjects } from "@/services/subjects";
import { getTutorsBySubjectSlug, parseTutorFilters } from "@/services/tutors";

export const dynamic = "force-dynamic";

interface SubjectDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: SubjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return { title: "Subject Not Found" };
  }

  return {
    title: `${subject.name} Tutors`,
    description:
      subject.description ??
      `Find expert ${subject.name} tutors. Compare profiles, rates, and reviews.`,
  };
}

export default async function SubjectDetailPage({ params, searchParams }: SubjectDetailPageProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const rawParams = await searchParams;
  const filters = parseTutorFilters(rawParams);
  const [result, allSubjects] = await Promise.all([
    getTutorsBySubjectSlug(slug, filters),
    getSubjects(),
  ]);
  const subjectOptions = allSubjects.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <MarketingLayout>
      <section className="bg-muted/30 border-b py-10">
        <div className="section-container">
          <Badge variant="secondary" className="mb-3">
            {subject.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{subject.name} Tutors</h1>
          {subject.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">{subject.description}</p>
          )}
          <p className="text-muted-foreground mt-2 text-sm">
            {subject.tutor_count} tutor{subject.tutor_count !== 1 ? "s" : ""} available
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
            {result.data.length === 0 ? (
              <EmptyState
                title={`No ${subject.name} tutors found`}
                description="Try adjusting your filters to see more tutors in this subject."
                actionHref={`/subjects/${slug}`}
              />
            ) : (
              <>
                <p className="text-muted-foreground mb-6 text-sm">
                  {result.total} {subject.name} tutor{result.total !== 1 ? "s" : ""} found
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {result.data.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
                <Suspense fallback={null}>
                  <TutorsPagination
                    page={result.page}
                    totalPages={result.totalPages}
                    total={result.total}
                  />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
