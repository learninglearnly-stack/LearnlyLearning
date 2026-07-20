import type { Metadata } from "next";

import { StudentOverview } from "@/components/dashboard/student-overview";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Manage your lesson bookings and learning progress.",
};

export default function DashboardPage() {
  return <StudentOverview />;
}
