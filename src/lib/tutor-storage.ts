import type { AvailabilitySlot, TutorProfileDraft } from "@/types";

export const TUTOR_PROFILE_STORAGE_KEY = "learnly_tutor_profile";
export const TUTOR_AVAILABILITY_STORAGE_KEY = "learnly_tutor_availability";

export const DEFAULT_TUTOR_PROFILE: TutorProfileDraft = {
  full_name: "",
  avatar_url: "",
  headline: "",
  bio: "",
  hourly_rate: 40,
  experience_years: 0,
  is_online: true,
  city: "",
  country: "",
  subject_slugs: [],
  languages: [],
  specialties: [],
  education: [],
  experience: [],
  profile_complete: false,
  updated_at: new Date().toISOString(),
};

export function getDefaultAvailability(): AvailabilitySlot[] {
  return [
    { day: "monday", start_time: "09:00", end_time: "17:00" },
    { day: "wednesday", start_time: "09:00", end_time: "17:00" },
    { day: "friday", start_time: "09:00", end_time: "17:00" },
  ];
}

export function calculateProfileCompletion(profile: TutorProfileDraft): number {
  const checks = [
    profile.full_name.length >= 2,
    profile.headline.length >= 10,
    profile.bio.length >= 50,
    profile.hourly_rate >= 5,
    profile.city.length > 0,
    profile.country.length > 0,
    profile.subject_slugs.length > 0,
    profile.languages.length > 0,
    profile.education.length > 0,
    profile.experience.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function isProfileComplete(profile: TutorProfileDraft): boolean {
  return calculateProfileCompletion(profile) === 100;
}

export function loadTutorProfile(): TutorProfileDraft {
  if (typeof window === "undefined") return DEFAULT_TUTOR_PROFILE;

  try {
    const stored = localStorage.getItem(TUTOR_PROFILE_STORAGE_KEY);
    if (!stored) return DEFAULT_TUTOR_PROFILE;
    return { ...DEFAULT_TUTOR_PROFILE, ...JSON.parse(stored) } as TutorProfileDraft;
  } catch {
    return DEFAULT_TUTOR_PROFILE;
  }
}

export function saveTutorProfile(profile: TutorProfileDraft): TutorProfileDraft {
  const updated: TutorProfileDraft = {
    ...profile,
    profile_complete: isProfileComplete(profile),
    updated_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(TUTOR_PROFILE_STORAGE_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function loadTutorAvailability(): AvailabilitySlot[] {
  if (typeof window === "undefined") return getDefaultAvailability();

  try {
    const stored = localStorage.getItem(TUTOR_AVAILABILITY_STORAGE_KEY);
    if (!stored) return getDefaultAvailability();
    return JSON.parse(stored) as AvailabilitySlot[];
  } catch {
    return getDefaultAvailability();
  }
}

export function saveTutorAvailability(slots: AvailabilitySlot[]): AvailabilitySlot[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(TUTOR_AVAILABILITY_STORAGE_KEY, JSON.stringify(slots));
  }
  return slots;
}

export function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
