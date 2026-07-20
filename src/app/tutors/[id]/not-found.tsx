import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function TutorNotFound() {
  return (
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold">Tutor Not Found</h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        The tutor you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/tutors">Browse All Tutors</Link>
      </Button>
    </div>
  );
}
