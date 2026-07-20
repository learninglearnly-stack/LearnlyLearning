import { MOCK_TUTORS } from "@/data/mock/tutors";
import type { PaginatedResult, Tutor, TutorFilters, TutorSortOption } from "@/types";

const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const WEEKENDS = ["saturday", "sunday"];

function matchesAvailability(tutor: Tutor, availability?: string): boolean {
  if (!availability) return true;

  return tutor.availability.some((slot) => {
    const startHour = parseInt(slot.start_time.split(":")[0], 10);

    switch (availability) {
      case "weekdays":
        return WEEKDAYS.includes(slot.day);
      case "weekends":
        return WEEKENDS.includes(slot.day);
      case "evenings":
        return startHour >= 17;
      case "mornings":
        return startHour < 12;
      default:
        return true;
    }
  });
}

function sortTutors(tutors: Tutor[], sort: TutorSortOption = "rating"): Tutor[] {
  const sorted = [...tutors];

  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating_avg - a.rating_avg || b.rating_count - a.rating_count);
    case "reviews":
      return sorted.sort((a, b) => b.rating_count - a.rating_count);
    case "rate_low":
      return sorted.sort((a, b) => a.hourly_rate - b.hourly_rate);
    case "rate_high":
      return sorted.sort((a, b) => b.hourly_rate - a.hourly_rate);
    case "experience":
      return sorted.sort((a, b) => b.experience_years - a.experience_years);
    default:
      return sorted;
  }
}

function filterTutors(tutors: Tutor[], filters: TutorFilters): Tutor[] {
  const query = filters.q?.toLowerCase().trim();

  return tutors.filter((tutor) => {
    if (query) {
      const searchable = [
        tutor.full_name,
        tutor.headline,
        tutor.bio,
        tutor.city,
        ...tutor.subjects.map((s) => s.name),
        ...tutor.languages,
        ...tutor.specialties,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    if (filters.subject && !tutor.subjects.some((s) => s.slug === filters.subject)) {
      return false;
    }

    if (filters.language && !tutor.languages.includes(filters.language)) {
      return false;
    }

    if (filters.minRate !== undefined && tutor.hourly_rate < filters.minRate) {
      return false;
    }

    if (filters.maxRate !== undefined && tutor.hourly_rate > filters.maxRate) {
      return false;
    }

    if (filters.minExperience !== undefined && tutor.experience_years < filters.minExperience) {
      return false;
    }

    if (filters.minRating !== undefined && tutor.rating_avg < filters.minRating) {
      return false;
    }

    if (filters.online === true && !tutor.is_online) {
      return false;
    }

    if (filters.city && tutor.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    if (!matchesAvailability(tutor, filters.availability)) {
      return false;
    }

    return true;
  });
}

export function getTutors(filters: TutorFilters = {}): PaginatedResult<Tutor> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = filters.limit ?? 9;
  const sort = filters.sort ?? "rating";

  const filtered = sortTutors(filterTutors(MOCK_TUTORS, filters), sort);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
  };
}

export function getTutorById(id: string): Tutor | null {
  return MOCK_TUTORS.find((t) => t.id === id) ?? null;
}

export function getAllTutorIds(): string[] {
  return MOCK_TUTORS.map((t) => t.id);
}

export function getTutorsBySubjectSlug(
  slug: string,
  filters: Omit<TutorFilters, "subject"> = {},
): PaginatedResult<Tutor> {
  return getTutors({ ...filters, subject: slug });
}

export function getTutorCountBySubject(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const tutor of MOCK_TUTORS) {
    for (const subject of tutor.subjects) {
      counts[subject.slug] = (counts[subject.slug] ?? 0) + 1;
    }
  }

  return counts;
}

export function parseTutorFilters(searchParams: Record<string, string | string[] | undefined>): TutorFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const num = (key: string) => {
    const value = get(key);
    return value ? Number(value) : undefined;
  };

  const bool = (key: string) => get(key) === "true";

  return {
    q: get("q"),
    subject: get("subject"),
    language: get("language"),
    minRate: num("minRate"),
    maxRate: num("maxRate"),
    minExperience: num("minExperience"),
    minRating: num("minRating"),
    online: bool("online") ? true : undefined,
    city: get("city"),
    availability: get("availability"),
    page: num("page") ?? 1,
    sort: (get("sort") as TutorSortOption) ?? "rating",
  };
}
