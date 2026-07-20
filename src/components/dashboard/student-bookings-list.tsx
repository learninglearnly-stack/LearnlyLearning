"use client";

import Link from "next/link";

import { BookingCard } from "@/components/bookings/booking-card";
import { StudentDashboardShell } from "@/components/dashboard/student-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStudentBookings } from "@/hooks/use-bookings";
import { getBookingStats } from "@/lib/booking-storage";

export function StudentBookingsList() {
  const { bookings, isLoaded, cancelBooking, completeBooking } = useStudentBookings();

  if (!isLoaded) {
    return (
      <StudentDashboardShell title="My Bookings">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      </StudentDashboardShell>
    );
  }

  const stats = getBookingStats(bookings);

  return (
    <StudentDashboardShell title="My Bookings" description="Track your lesson requests and bookings">
      <div className="mx-auto max-w-3xl space-y-6">
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pending", value: stats.pending },
              { label: "Accepted", value: stats.accepted },
              { label: "Completed", value: stats.completed },
              { label: "Total", value: stats.total },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <p className="mb-2 text-lg font-semibold">No bookings yet</p>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                Find a tutor and send a lesson request. Your bookings will appear here.
              </p>
              <Button asChild>
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                view="student"
                onCancel={cancelBooking}
                onComplete={completeBooking}
              />
            ))}
          </div>
        )}
      </div>
    </StudentDashboardShell>
  );
}
