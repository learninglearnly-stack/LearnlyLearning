"use client";

import Link from "next/link";

import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentBookings } from "@/hooks/use-bookings";
import { getBookingStats } from "@/lib/booking-storage";

export function StudentOverview() {
  const { bookings, isLoaded } = useStudentBookings();
  const stats = getBookingStats(bookings);

  if (!isLoaded) {
    return (
      <StudentDashboardShell title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
          ))}
        </div>
      </StudentDashboardShell>
    );
  }

  return (
    <StudentDashboardShell title="Overview" description="Your learning dashboard">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Bookings", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Upcoming", value: stats.accepted },
            { label: "Completed", value: stats.completed },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild>
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/bookings">View My Bookings</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/subjects">Browse Subjects</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Booking Works</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2 text-sm">
              <p>1. Find a tutor and click <strong>Request Lesson</strong></p>
              <p>2. Wait for the tutor to accept or reject</p>
              <p>3. Arrange payment directly with your tutor</p>
              <p>4. After the lesson, mark it complete and leave a review</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentDashboardShell>
  );
}
