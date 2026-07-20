import { TutorDashboardShell } from "@/components/dashboard/tutor-dashboard-shell";
import { DashboardPlaceholderContent } from "@/components/dashboard/dashboard-placeholder-content";

interface DashboardPlaceholderProps {
  title: string;
  description: string;
}

export function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps) {
  return (
    <TutorDashboardShell title={title} description={description}>
      <DashboardPlaceholderContent description={description} backHref="/tutor" />
    </TutorDashboardShell>
  );
}
