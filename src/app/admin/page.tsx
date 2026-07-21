import type { Metadata } from "next";

import { AdminOverview } from "@/components/dashboard/admin-overview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage the StudySpark Tutors tutoring marketplace.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
