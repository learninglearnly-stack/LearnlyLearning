import type { Metadata } from "next";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export const metadata: Metadata = {
  title: "Reviews",
  description: "View reviews from your students.",
};

export default function TutorReviewsPage() {
  return (
    <DashboardPlaceholder
      title="Reviews"
      description="Student reviews will appear here once the review system is built in Phase 7."
    />
  );
}
