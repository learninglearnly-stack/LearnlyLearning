import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface DashboardPlaceholderContentProps {
  description: string;
  backHref?: string;
  backLabel?: string;
}

export function DashboardPlaceholderContent({
  description,
  backHref = "/tutor",
  backLabel = "Back to Overview",
}: DashboardPlaceholderContentProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        <Button variant="outline" asChild>
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
