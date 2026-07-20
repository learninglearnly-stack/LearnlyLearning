import type { Metadata } from "next";

import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your student profile.",
};

export default function StudentProfilePage() {
  return (
    <StudentDashboardShell title="Profile" description="Your student profile">
      <DashboardPlaceholderContent
        description="Student profile management will be available after Supabase authentication in Phase 2."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    </StudentDashboardShell>
  );
}
