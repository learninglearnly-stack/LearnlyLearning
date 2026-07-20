"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createBooking,
  getAllBookings,
  getBookingsForStudent,
  loadStudentProfile,
  saveStudentProfile,
  updateBookingStatus,
} from "@/lib/booking-storage";
import type { Booking, BookingStatus, StudentProfile } from "@/types";
import type { BookingRequestFormValues } from "@/lib/validations/booking";

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile>({ full_name: "", email: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadStudentProfile());
    setIsLoaded(true);
  }, []);

  const updateProfile = useCallback((data: StudentProfile) => {
    const saved = saveStudentProfile(data);
    setProfile(saved);
    return saved;
  }, []);

  return { profile, updateProfile, isLoaded };
}

export function useStudentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { profile } = useStudentProfile();

  const refresh = useCallback(() => {
    if (profile.email) {
      setBookings(getBookingsForStudent(profile.email));
    } else {
      setBookings([]);
    }
    setIsLoaded(true);
  }, [profile.email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const requestBooking = useCallback(
    (
      tutor: {
        id: string;
        full_name: string;
        avatar_url: string;
        hourly_rate: number;
        subjects: { slug: string; name: string }[];
      },
      data: BookingRequestFormValues,
    ) => {
      const subject = tutor.subjects.find((s) => s.slug === data.subject_slug);
      const booking = createBooking({
        tutor_id: tutor.id,
        tutor_name: tutor.full_name,
        tutor_avatar: tutor.avatar_url,
        student_name: data.student_name,
        student_email: data.student_email,
        subject_slug: data.subject_slug,
        subject_name: subject?.name ?? data.subject_slug,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        duration_minutes: data.duration_minutes,
        message: data.message,
        hourly_rate: tutor.hourly_rate,
      });
      refresh();
      return booking;
    },
    [refresh],
  );

  const cancelBooking = useCallback(
    (id: string) => {
      updateBookingStatus(id, "cancelled");
      refresh();
    },
    [refresh],
  );

  const completeBooking = useCallback(
    (id: string) => {
      updateBookingStatus(id, "completed");
      refresh();
    },
    [refresh],
  );

  return {
    bookings,
    isLoaded,
    refresh,
    requestBooking,
    cancelBooking,
    completeBooking,
    hasStudentProfile: Boolean(profile.email),
  };
}

export function useTutorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setBookings(getAllBookings());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const respondToBooking = useCallback(
    (id: string, status: BookingStatus, message?: string) => {
      if (status !== "accepted" && status !== "rejected") return null;
      const updated = updateBookingStatus(id, status, message ?? null);
      refresh();
      return updated;
    },
    [refresh],
  );

  const completeBooking = useCallback(
    (id: string) => {
      updateBookingStatus(id, "completed");
      refresh();
    },
    [refresh],
  );

  return { bookings, isLoaded, refresh, respondToBooking, completeBooking };
}
