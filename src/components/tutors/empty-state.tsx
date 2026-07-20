import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No tutors found",
  description = "Try adjusting your filters or search terms to find more tutors.",
  actionLabel = "Clear filters",
  actionHref = "/tutors",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
        <SearchX className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      <Button className="mt-6" variant="outline" asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
