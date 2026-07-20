export type UserRole = "guest" | "student" | "tutor" | "admin";

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface Booking {
  id: string;
  tutor_id: string;
  tutor_name: string;
  tutor_avatar: string;
  student_name: string;
  student_email: string;
  subject_slug: string;
  subject_name: string;
  preferred_date: string;
  preferred_time: string;
  duration_minutes: number;
  message: string;
  status: BookingStatus;
  hourly_rate: number;
  tutor_response_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  full_name: string;
  email: string;
}

export type TutorSortOption = "rating" | "rate_low" | "rate_high" | "experience" | "reviews";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  city: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  icon: string | null;
  description?: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: number;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  start_year: number;
  end_year: number | null;
  description: string;
}

export interface Review {
  id: string;
  tutor_id: string;
  student_name: string;
  student_avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AvailabilitySlot {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  start_time: string;
  end_time: string;
}

export interface Tutor {
  id: string;
  profile_id: string;
  full_name: string;
  avatar_url: string;
  headline: string;
  bio: string;
  hourly_rate: number;
  experience_years: number;
  is_online: boolean;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  city: string;
  country: string;
  subjects: Subject[];
  languages: string[];
  education: Education[];
  experience: Experience[];
  availability: AvailabilitySlot[];
  specialties: string[];
  reviews: Review[];
  created_at: string;
  updated_at: string;
}

export interface TutorFilters {
  q?: string;
  subject?: string;
  language?: string;
  minRate?: number;
  maxRate?: number;
  minExperience?: number;
  minRating?: number;
  online?: boolean;
  city?: string;
  availability?: string;
  page?: number;
  limit?: number;
  sort?: TutorSortOption;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TutorProfileDraft {
  full_name: string;
  avatar_url: string;
  headline: string;
  bio: string;
  hourly_rate: number;
  experience_years: number;
  is_online: boolean;
  city: string;
  country: string;
  subject_slugs: string[];
  languages: string[];
  specialties: string[];
  education: Education[];
  experience: Experience[];
  profile_complete: boolean;
  updated_at: string;
}

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}
