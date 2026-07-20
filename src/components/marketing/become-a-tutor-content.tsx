import { Award, CheckCircle, Clock, DollarSign, Users } from "lucide-react";
import Link from "next/link";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BECOME_TUTOR_STEPS, TUTOR_BENEFITS } from "@/lib/constants/tutor-dashboard";

const BENEFIT_ICONS = {
  "dollar-sign": DollarSign,
  clock: Clock,
  users: Users,
  award: Award,
};

export function BecomeATutorContent() {
  return (
    <MarketingLayout>
      <section className="gradient-hero py-16 lg:py-24">
        <div className="section-container text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Share Your Knowledge.{" "}
            <span className="text-primary">Grow Your Practice.</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            Join Learnly as a tutor. Set your own rates, manage your schedule, and connect with
            students — with zero platform commission.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/tutor/profile">Start Your Profile</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tutor">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="section-container">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Teach on Learnly?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TUTOR_BENEFITS.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon];
              return (
                <Card key={benefit.title} className="border-transparent bg-card/50">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16 lg:py-20">
        <div className="section-container">
          <h2 className="mb-12 text-center text-3xl font-bold">How to Get Started</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {BECOME_TUTOR_STEPS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="section-container">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="flex flex-col items-center p-10 text-center sm:p-16">
              <CheckCircle className="mb-4 h-12 w-12 opacity-80" />
              <h2 className="text-3xl font-bold">Ready to Start Teaching?</h2>
              <p className="text-primary-foreground/80 mt-4 max-w-lg">
                Create your profile in minutes. No payment processing on the platform — you arrange
                fees directly with students.
              </p>
              <Button size="lg" variant="accent" className="mt-8" asChild>
                <Link href="/tutor/profile">Create Your Tutor Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
}
