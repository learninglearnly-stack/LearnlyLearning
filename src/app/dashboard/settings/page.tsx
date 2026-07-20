import type { Metadata } from "next";

import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account settings.",
};

export default function StudentSettingsPage() {
  return (
    <StudentDashboardShell title="Settings" description="Account settings">
      <DashboardPlaceholderContent
        description="Account settings and notification preferences will be available after Supabase authentication in Phase 2."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    </StudentDashboardShell>
  );
}
