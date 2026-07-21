import { Calendar, MessageSquare, Shield, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BENEFITS } from "@/lib/constants";

const ICON_MAP = {
  users: Users,
  calendar: Calendar,
  shield: Shield,
  message: MessageSquare,
} as const;

export function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Learn With {process.env.NEXT_PUBLIC_APP_NAME ?? "StudySpark Tutors"}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            A modern platform built for real learning — discover tutors, book lessons, and grow at
            your own pace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon];
            return (
              <Card
                key={benefit.title}
                className="hover:shadow-md border-transparent bg-card/50 transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <div
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
