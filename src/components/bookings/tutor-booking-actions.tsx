"use client";

import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";

import { BookingRequestDialog } from "@/components/bookings/booking-request-dialog";
import { StarRating } from "@/components/tutors/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";

interface TutorBookingActionsProps {
  tutor: Tutor;
}

export function TutorBookingActions({ tutor }: TutorBookingActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="lg:sticky lg:top-24">
        <CardContent className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold">{formatCurrency(tutor.hourly_rate)}</p>
              <p className="text-muted-foreground text-sm">per hour</p>
            </div>
            <StarRating rating={tutor.rating_avg} size="sm" showValue />
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => setDialogOpen(true)}>
              Request Lesson
            </Button>
            <Button variant="outline" className="w-full" size="lg" disabled>
              <MessageSquare className="h-4 w-4" />
              Message Tutor (after booking)
            </Button>
            <Button variant="ghost" className="w-full" size="lg" disabled>
              <Heart className="h-4 w-4" />
              Save to Favorites
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 text-center text-xs">
            Payment arranged directly with tutor. No platform fees.
          </p>
        </CardContent>
      </Card>

      <BookingRequestDialog tutor={tutor} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
