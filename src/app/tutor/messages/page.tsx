import type { Metadata } from "next";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export const metadata: Metadata = {
  title: "Messages",
  description: "Chat with students in real time.",
};

export default function TutorMessagesPage() {
  return (
    <DashboardPlaceholder
      title="Messages"
      description="Real-time messaging with Supabase will be built in Phase 6. Chat with students before and after booking."
    />
  );
}
