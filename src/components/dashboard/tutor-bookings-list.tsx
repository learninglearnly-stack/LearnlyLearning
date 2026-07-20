"use client";

import Link from "next/link";
import { toast } from "sonner";

import { BookingCard } from "@/components/bookings/booking-card";
import { TutorDashboardShell } from "@/components/dashboard/tutor-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTutorBookings } from "@/hooks/use-bookings";
import { getBookingStats } from "@/lib/booking-storage";

export function TutorBookingsList() {
  const { bookings, isLoaded, respondToBooking, completeBooking } = useTutorBookings();

  const handleAccept = (id: string) => {
    respondToBooking(id, "accepted", "Looking forward to our lesson! I'll send you meeting details shortly.");
    toast.success("Booking accepted");
  };

  const handleReject = (id: string) => {
    respondToBooking(id, "rejected", "Sorry, I'm not available at that time. Please try another slot.");
    toast.info("Booking rejected");
  };

  const handleComplete = (id: string) => {
    completeBooking(id);
    toast.success("Lesson marked as complete");
  };

  if (!isLoaded) {
    return (
      <TutorDashboardShell title="Bookings">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      </TutorDashboardShell>
    );
  }

  const stats = getBookingStats(bookings);
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <TutorDashboardShell
      title="Bookings"
      description="Manage lesson requests from students"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {pending.length > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <CardContent className="p-4">
              <p className="text-sm font-medium">
                You have {pending.length} pending request{pending.length !== 1 ? "s" : ""} awaiting
                your response.
              </p>
            </CardContent>
          </Card>
        )}

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
              <p className="mb-2 text-lg font-semibold">No booking requests yet</p>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                When students request lessons, they&apos;ll appear here for you to accept or reject.
              </p>
              <Button variant="outline" asChild>
                <Link href="/tutor/profile">Complete Your Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                view="tutor"
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </TutorDashboardShell>
  );
}
