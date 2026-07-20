import { BookOpen, Users } from "lucide-react";
import Link from "next/link";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSubjectsByCategory } from "@/services/subjects";

export async function SubjectsPageContent() {
  const grouped = await getSubjectsByCategory();

  return (
    <MarketingLayout>
      <section className="bg-muted/30 border-b py-10">
        <div className="section-container">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse Subjects</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Explore subjects and find expert tutors in every field — from STEM to languages and
            arts.
          </p>
        </div>
      </section>

      <section className="section-container py-8 lg:py-12">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-muted-foreground text-center">No subjects available yet.</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, subjects]) => (
              <div key={category}>
                <h2 className="mb-6 text-xl font-semibold">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject) => (
                    <Link key={subject.id} href={`/subjects/${subject.slug}`}>
                      <Card className="hover:border-primary/30 group h-full transition-all hover:-translate-y-1 hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors group-hover:text-white">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="group-hover:text-primary font-semibold transition-colors">
                                {subject.name}
                              </h3>
                              {subject.description && (
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                  {subject.description}
                                </p>
                              )}
                              <Badge variant="secondary" className="mt-3 gap-1">
                                <Users className="h-3 w-3" />
                                {subject.tutor_count} tutor{subject.tutor_count !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MarketingLayout>
  );
}
