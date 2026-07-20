import type { Metadata } from "next";

import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Reviews you've left for tutors.",
};

export default function StudentReviewsPage() {
  return (
    <StudentDashboardShell title="Reviews" description="Your tutor reviews">
      <DashboardPlaceholderContent
        description="Leave reviews after completing lessons. The review system will be built in Phase 7."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    </StudentDashboardShell>
  );
}
