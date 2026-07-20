import type { Metadata } from "next";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your tutor account settings.",
};

export default function TutorSettingsPage() {
  return (
    <DashboardPlaceholder
      title="Settings"
      description="Account settings and notification preferences will be available after Supabase authentication is connected in Phase 2."
    />
  );
}
