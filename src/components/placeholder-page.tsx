import { Construction } from "lucide-react";
import Link from "next/link";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <MarketingLayout>
      <section className="section-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Construction className="text-muted-foreground h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-4 max-w-md text-lg">{description}</p>
        <Button className="mt-8" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </section>
    </MarketingLayout>
  );
}
