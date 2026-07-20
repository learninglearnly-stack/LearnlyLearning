import { createClient } from "@/lib/supabase/server";
import type { Subject } from "@/types";

export interface SubjectWithCount extends Subject {
  tutor_count: number;
}

async function getSubjectCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tutor_subjects").select("subject_id, subjects(slug)");

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    const slug = (subject as { slug: string } | null | undefined)?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

function withCount(subject: Subject, counts: Record<string, number>): SubjectWithCount {
  return {
    ...subject,
    tutor_count: counts[subject.slug] ?? 0,
  };
}

export async function getSubjects(): Promise<SubjectWithCount[]> {
  const supabase = await createClient();
  const [subjectsResult, counts] = await Promise.all([
    supabase.from("subjects").select("*").order("name"),
    getSubjectCounts(),
  ]);

  if (subjectsResult.error || !subjectsResult.data) return [];

  return subjectsResult.data
    .map((subject) => withCount(subject as Subject, counts))
    .sort((a, b) => b.tutor_count - a.tutor_count || a.name.localeCompare(b.name));
}

export async function getSubjectBySlug(slug: string): Promise<SubjectWithCount | null> {
  const supabase = await createClient();
  const [subjectResult, counts] = await Promise.all([
    supabase.from("subjects").select("*").eq("slug", slug).maybeSingle(),
    getSubjectCounts(),
  ]);

  if (subjectResult.error || !subjectResult.data) return null;

  return withCount(subjectResult.data as Subject, counts);
}

export async function getAllSubjectSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("subjects").select("slug").order("name");

  if (error || !data) return [];
  return data.map((row) => row.slug);
}

export async function getSubjectsByCategory(): Promise<Record<string, SubjectWithCount[]>> {
  const subjects = await getSubjects();
  const grouped: Record<string, SubjectWithCount[]> = {};

  for (const subject of subjects) {
    const category = subject.category ?? "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(subject);
  }

  return grouped;
}
