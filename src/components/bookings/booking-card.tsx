"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  view: "student" | "tutor";
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onAccept?: (id: string, message?: string) => void;
  onReject?: (id: string, message?: string) => void;
}

export function BookingCard({
  booking,
  view,
  onCancel,
  onComplete,
  onAccept,
  onReject,
}: BookingCardProps) {
  const estimatedCost = formatCurrency(
    Math.round((booking.hourly_rate * booking.duration_minutes) / 60),
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            {view === "student" ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={booking.tutor_avatar}
                  alt={booking.tutor_name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                <User className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">
                  {view === "student" ? (
                    <Link href={`/tutors/${booking.tutor_id}`} className="hover:text-primary">
                      {booking.tutor_name}
                    </Link>
                  ) : (
                    booking.student_name
                  )}
                </h3>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-muted-foreground text-sm">{booking.subject_name}</p>
              {view === "tutor" && (
                <p className="text-muted-foreground text-xs">{booking.student_email}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{estimatedCost}</p>
            <p className="text-muted-foreground text-xs">
              {booking.duration_minutes} min · {formatCurrency(booking.hourly_rate)}/hr
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatDate(booking.preferred_date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            {formatTime(booking.preferred_time)} · {booking.duration_minutes} min
          </div>
        </div>

        {booking.message && (
          <div className="bg-muted/50 mt-4 rounded-xl p-3">
            <p className="mb-1 flex items-center gap-1 text-xs font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              {view === "student" ? "Your message" : "Student message"}
            </p>
            <p className="text-muted-foreground text-sm">{booking.message}</p>
          </div>
        )}

        {booking.tutor_response_message && (
          <div className="bg-primary/5 mt-3 rounded-xl p-3">
            <p className="mb-1 text-xs font-medium">Tutor response</p>
            <p className="text-muted-foreground text-sm">{booking.tutor_response_message}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {view === "student" && booking.status === "pending" && onCancel && (
            <Button variant="outline" size="sm" onClick={() => onCancel(booking.id)}>
              <XCircle className="h-4 w-4" />
              Cancel Request
            </Button>
          )}

          {view === "student" && booking.status === "accepted" && (
            <>
              <Button variant="outline" size="sm" disabled>
                <MessageSquare className="h-4 w-4" />
                Chat (Phase 6)
              </Button>
              {onComplete && (
                <Button size="sm" onClick={() => onComplete(booking.id)}>
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </>
          )}

          {view === "student" && booking.status === "completed" && (
            <Button variant="outline" size="sm" disabled>
              Leave Review (Phase 7)
            </Button>
          )}

          {view === "tutor" && booking.status === "pending" && (
            <>
              {onAccept && (
                <Button size="sm" onClick={() => onAccept(booking.id)}>
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </Button>
              )}
              {onReject && (
                <Button variant="outline" size="sm" onClick={() => onReject(booking.id)}>
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              )}
            </>
          )}

          {view === "tutor" && booking.status === "accepted" && onComplete && (
            <Button size="sm" onClick={() => onComplete(booking.id)}>
              <CheckCircle className="h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          Requested {formatRelativeDate(booking.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
