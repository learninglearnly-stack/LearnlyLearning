import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSubjects } from "@/services/subjects";

export function SubjectsSection() {
  const subjects = getSubjects().slice(0, 8);

  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="section-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Popular Subjects
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-lg">
              From STEM to languages and arts — find expert tutors in every field.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/subjects">
              View All Subjects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject) => (
            <Link key={subject.slug} href={`/subjects/${subject.slug}`}>
              <Card className="hover:border-primary/30 group h-full transition-all hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors group-hover:text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{subject.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {subject.tutor_count} tutor{subject.tutor_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
