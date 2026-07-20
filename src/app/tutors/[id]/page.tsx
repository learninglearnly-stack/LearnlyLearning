import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { TutorProfileView } from "@/components/tutors/tutor-profile-view";
import { absoluteUrl } from "@/lib/utils";
import { getAllTutorIds, getTutorById } from "@/services/tutors";

interface TutorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllTutorIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: TutorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const tutor = getTutorById(id);

  if (!tutor) {
    return { title: "Tutor Not Found" };
  }

  return {
    title: `${tutor.full_name} — ${tutor.subjects.map((s) => s.name).join(", ")} Tutor`,
    description: tutor.headline,
    openGraph: {
      title: `${tutor.full_name} | Tutor Profile`,
      description: tutor.headline,
      url: absoluteUrl(`/tutors/${tutor.id}`),
      images: [{ url: tutor.avatar_url, alt: tutor.full_name }],
    },
  };
}

export default async function TutorDetailPage({ params }: TutorDetailPageProps) {
  const { id } = await params;
  const tutor = getTutorById(id);

  if (!tutor) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tutor.full_name,
    description: tutor.headline,
    image: tutor.avatar_url,
    jobTitle: "Tutor",
    knowsAbout: tutor.subjects.map((s) => s.name),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tutor.rating_avg,
      reviewCount: tutor.rating_count,
    },
  };

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TutorProfileView tutor={tutor} />
    </MarketingLayout>
  );
}
