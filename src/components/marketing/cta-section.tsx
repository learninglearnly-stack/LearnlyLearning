import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 mx-auto mt-4 max-w-xl text-lg">
              Join thousands of students finding expert tutors. Create your free account and book
              your first lesson today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/become-a-tutor">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
