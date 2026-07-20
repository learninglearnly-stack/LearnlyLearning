import type { Booking, BookingStatus, StudentProfile } from "@/types";

export const BOOKINGS_STORAGE_KEY = "learnly_bookings";
export const STUDENT_PROFILE_STORAGE_KEY = "learnly_student_profile";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  full_name: "",
  email: "",
};

export function generateBookingId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Booking[];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): Booking[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }
  return bookings;
}

export function loadStudentProfile(): StudentProfile {
  if (typeof window === "undefined") return DEFAULT_STUDENT_PROFILE;

  try {
    const stored = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!stored) return DEFAULT_STUDENT_PROFILE;
    return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(stored) } as StudentProfile;
  } catch {
    return DEFAULT_STUDENT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): StudentProfile {
  if (typeof window !== "undefined") {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export function createBooking(
  data: Omit<Booking, "id" | "status" | "tutor_response_message" | "created_at" | "updated_at">,
): Booking {
  const bookings = loadBookings();
  const booking: Booking = {
    ...data,
    id: generateBookingId(),
    status: "pending",
    tutor_response_message: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveBookings([booking, ...bookings]);
  saveStudentProfile({ full_name: data.student_name, email: data.student_email });

  return booking;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  tutorResponseMessage?: string | null,
): Booking | null {
  const bookings = loadBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const updated: Booking = {
    ...bookings[index],
    status,
    tutor_response_message:
      tutorResponseMessage !== undefined ? tutorResponseMessage : bookings[index].tutor_response_message,
    updated_at: new Date().toISOString(),
  };

  bookings[index] = updated;
  saveBookings(bookings);
  return updated;
}

export function getBookingsForStudent(email: string): Booking[] {
  return loadBookings()
    .filter((b) => b.student_email.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllBookings(): Booking[] {
  return loadBookings().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getBookingStats(bookings: Booking[]) {
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};
