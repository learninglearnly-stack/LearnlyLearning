import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SubjectNotFound() {
  return (
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold">Subject Not Found</h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        The subject you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/subjects">Browse All Subjects</Link>
      </Button>
    </div>
  );
}
