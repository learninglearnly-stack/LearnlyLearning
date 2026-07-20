import type { Metadata } from "next";

import { TutorAvailabilityForm } from "@/components/dashboard/tutor-availability-form";

export const metadata: Metadata = {
  title: "Availability",
  description: "Set your weekly teaching schedule and available time slots.",
};

export default function TutorAvailabilityPage() {
  return <TutorAvailabilityForm />;
}
