import type { Metadata } from "next";

import { TutorBookingsList } from "@/components/dashboard/tutor-bookings-list";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Manage lesson booking requests from students.",
};

export default function TutorBookingsPage() {
  return <TutorBookingsList />;
}
