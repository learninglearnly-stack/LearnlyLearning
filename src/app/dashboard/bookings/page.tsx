import type { Metadata } from "next";

import { StudentBookingsList } from "@/components/dashboard/student-bookings-list";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your lesson booking requests.",
};

export default function StudentBookingsPage() {
  return <StudentBookingsList />;
}
