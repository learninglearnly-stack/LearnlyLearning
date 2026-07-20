"use client";

import { Award, Clock, DollarSign, Users } from "lucide-react";
import Link from "next/link";

import { TutorDashboardShell } from "@/components/dashboard/tutor-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTutorAvailability, useTutorProfile } from "@/hooks/use-tutor-profile";
import { calculateProfileCompletion } from "@/lib/tutor-storage";
import { formatCurrency } from "@/lib/utils";

const BENEFIT_ICONS = {
  "dollar-sign": DollarSign,
  clock: Clock,
  users: Users,
  award: Award,
};

export function TutorOverview() {
  const { profile, isLoaded: profileLoaded } = useTutorProfile();
  const { availability, isLoaded: availLoaded } = useTutorAvailability();

  if (!profileLoaded || !availLoaded) {
    return (
      <TutorDashboardShell title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
          ))}
        </div>
      </TutorDashboardShell>
    );
  }

  const completion = calculateProfileCompletion(profile);
  const uniqueDays = new Set(availability.map((s) => s.day)).size;

  const stats = [
    {
      label: "Profile Completion",
      value: `${completion}%`,
      description: completion === 100 ? "Profile is complete" : "Complete your profile",
    },
    {
      label: "Hourly Rate",
      value: profile.hourly_rate > 0 ? formatCurrency(profile.hourly_rate) : "—",
      description: "per hour",
    },
    {
      label: "Subjects",
      value: String(profile.subject_slugs.length),
      description: "subjects listed",
    },
    {
      label: "Available Days",
      value: String(uniqueDays),
      description: "days per week",
    },
  ];

  const checklist = [
    { label: "Basic info (name, headline, bio)", done: profile.full_name && profile.headline && profile.bio },
    { label: "Subjects & languages", done: profile.subject_slugs.length > 0 && profile.languages.length > 0 },
    { label: "Location & rate", done: profile.city && profile.country && profile.hourly_rate >= 5 },
    { label: "Education & experience", done: profile.education.length > 0 && profile.experience.length > 0 },
    { label: "Weekly availability", done: availability.length > 0 },
  ];

  return (
    <TutorDashboardShell title="Overview" description="Your tutor dashboard at a glance">
      <div className="space-y-8">
        {completion < 100 && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold">Complete your profile to get discovered</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Students can&apos;t find you until your profile is complete. You&apos;re{" "}
                  {completion}% done.
                </p>
              </div>
              <Button asChild>
                <Link href="/tutor/profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Checklist</CardTitle>
              <CardDescription>Steps to launch your tutoring profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                      item.done
                        ? "bg-emerald-500 text-white"
                        : "border-muted-foreground/30 border-2"
                    }`}
                  >
                    {item.done && "✓"}
                  </div>
                  <span className={item.done ? "text-muted-foreground line-through" : ""}>
                    {item.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your tutoring presence</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/tutor/profile">Edit Profile</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/tutor/availability">Set Availability</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/tutors">Browse Tutor Listings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TutorDashboardShell>
  );
}
