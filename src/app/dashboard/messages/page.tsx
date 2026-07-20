import type { Metadata } from "next";

import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";

export const metadata: Metadata = {
  title: "Messages",
  description: "Chat with your tutors.",
};

export default function StudentMessagesPage() {
  return (
    <StudentDashboardShell title="Messages" description="Chat with your tutors">
      <DashboardPlaceholderContent
        description="Real-time chat will be built in Phase 6. You'll be able to message tutors after a booking is accepted."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />
    </StudentDashboardShell>
  );
}
