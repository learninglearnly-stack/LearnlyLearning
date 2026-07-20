"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_TUTOR_PROFILE,
  loadTutorAvailability,
  loadTutorProfile,
  saveTutorAvailability,
  saveTutorProfile,
} from "@/lib/tutor-storage";
import type { AvailabilitySlot, TutorProfileDraft } from "@/types";

export function useTutorProfile() {
  const [profile, setProfile] = useState<TutorProfileDraft>(DEFAULT_TUTOR_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadTutorProfile());
    setIsLoaded(true);
  }, []);

  const updateProfile = useCallback((data: TutorProfileDraft) => {
    const saved = saveTutorProfile(data);
    setProfile(saved);
    return saved;
  }, []);

  return { profile, updateProfile, isLoaded };
}

export function useTutorAvailability() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAvailability(loadTutorAvailability());
    setIsLoaded(true);
  }, []);

  const updateAvailability = useCallback((slots: AvailabilitySlot[]) => {
    const saved = saveTutorAvailability(slots);
    setAvailability(saved);
    return saved;
  }, []);

  return { availability, updateAvailability, isLoaded };
}
