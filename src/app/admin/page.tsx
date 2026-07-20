import type { Metadata } from "next";

import { AdminOverview } from "@/components/dashboard/admin-overview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage the Learnly tutoring marketplace.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
