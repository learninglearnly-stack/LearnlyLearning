import type { Metadata } from "next";

import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved tutors.",
};

export default function StudentFavoritesPage() {
  return (
    <StudentDashboardShell title="Favorites" description="Tutors you've saved">
      <DashboardPlaceholderContent
        description="Save favorite tutors to quickly find them later. This feature will be built in Phase 7."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    </StudentDashboardShell>
  );
}
