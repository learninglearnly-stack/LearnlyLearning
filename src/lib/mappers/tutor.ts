import type { AvailabilitySlot, DayOfWeek, Education, Experience, Review, Subject, Tutor } from "@/types";

type DbSubject = Subject;

type DbTutorRow = {
  id: string;
  profile_id: string;
  headline: string | null;
  bio: string | null;
  hourly_rate: number | string;
  experience_years: number;
  is_online: boolean;
  is_verified: boolean;
  rating_avg: number | string;
  rating_count: number;
  city: string | null;
  country: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  tutor_subjects?: { subjects: DbSubject | null }[];
  tutor_education?: Education[];
  tutor_experience?: Experience[];
  availability?: {
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
  }[];
  reviews?: {
    id: string;
    tutor_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
};

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function defaultAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

export function mapDbTutor(row: DbTutorRow): Tutor {
  const fullName = row.profiles?.full_name?.trim() || "Tutor";

  const subjects: Subject[] =
    row.tutor_subjects
      ?.map((entry) => entry.subjects)
      .filter((subject): subject is DbSubject => subject !== null) ?? [];

  const availability: AvailabilitySlot[] =
    row.availability?.map((slot) => ({
      day: slot.day_of_week,
      start_time: formatTime(slot.start_time),
      end_time: formatTime(slot.end_time),
    })) ?? [];

  const reviews: Review[] =
    row.reviews?.map((review) => ({
      id: review.id,
      tutor_id: review.tutor_id,
      student_name: review.profiles?.full_name?.trim() || "Student",
      student_avatar: review.profiles?.avatar_url ?? null,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
    })) ?? [];

  return {
    id: row.id,
    profile_id: row.profile_id,
    full_name: fullName,
    avatar_url: row.profiles?.avatar_url || defaultAvatar(fullName),
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    hourly_rate: Number(row.hourly_rate),
    experience_years: row.experience_years,
    is_online: row.is_online,
    is_verified: row.is_verified,
    rating_avg: Number(row.rating_avg),
    rating_count: row.rating_count,
    city: row.city ?? "",
    country: row.country ?? "",
    subjects,
    languages: row.languages ?? [],
    education: row.tutor_education ?? [],
    experience: row.tutor_experience ?? [],
    availability,
    specialties: row.specialties ?? [],
    reviews,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const TUTOR_SELECT = `
  *,
  profiles:profile_id (full_name, avatar_url),
  tutor_subjects (subjects (*)),
  tutor_education (*),
  tutor_experience (*),
  availability (*),
  reviews (*, profiles:student_id (full_name, avatar_url))
`;
