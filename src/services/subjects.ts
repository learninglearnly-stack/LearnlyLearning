import { MOCK_SUBJECTS, SUBJECT_BY_SLUG } from "@/data/mock/subjects";
import { getTutorCountBySubject } from "@/services/tutors";
import type { Subject } from "@/types";

export interface SubjectWithCount extends Subject {
  tutor_count: number;
}

export function getSubjects(): SubjectWithCount[] {
  const counts = getTutorCountBySubject();

  return MOCK_SUBJECTS.map((subject) => ({
    ...subject,
    tutor_count: counts[subject.slug] ?? 0,
  })).sort((a, b) => b.tutor_count - a.tutor_count);
}

export function getSubjectBySlug(slug: string): SubjectWithCount | null {
  const subject = SUBJECT_BY_SLUG[slug];
  if (!subject) return null;

  const counts = getTutorCountBySubject();

  return {
    ...subject,
    tutor_count: counts[slug] ?? 0,
  };
}

export function getAllSubjectSlugs(): string[] {
  return MOCK_SUBJECTS.map((s) => s.slug);
}

export function getSubjectsByCategory(): Record<string, SubjectWithCount[]> {
  const subjects = getSubjects();
  const grouped: Record<string, SubjectWithCount[]> = {};

  for (const subject of subjects) {
    const category = subject.category ?? "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(subject);
  }

  return grouped;
}
