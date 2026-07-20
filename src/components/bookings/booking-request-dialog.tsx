"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStudentBookings } from "@/hooks/use-bookings";
import { useUser } from "@/hooks/use-user";
import { DURATION_OPTIONS } from "@/lib/constants/student-dashboard";
import { TIME_OPTIONS } from "@/lib/constants/tutor-dashboard";
import { formatCurrency } from "@/lib/utils";
import {
  bookingRequestSchema,
  type BookingRequestFormValues,
} from "@/lib/validations/booking";
import type { Tutor } from "@/types";

interface BookingRequestDialogProps {
  tutor: Tutor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingRequestDialog({ tutor, open, onOpenChange }: BookingRequestDialogProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();
  const { requestBooking } = useStudentBookings();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const form = useForm<BookingRequestFormValues>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      student_name: "",
      student_email: "",
      subject_slug: tutor.subjects[0]?.slug ?? "",
      preferred_date: minDate,
      preferred_time: "10:00",
      duration_minutes: 60,
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!authLoading && open && !user) {
      onOpenChange(false);
      router.push(`/login?redirect=/tutors/${tutor.id}`);
    }
  }, [authLoading, open, user, onOpenChange, router, tutor.id]);

  useEffect(() => {
    if (!authLoading && open && user) {
      reset({
        student_name: user.profile?.full_name ?? "",
        student_email: user.email,
        subject_slug: tutor.subjects[0]?.slug ?? "",
        preferred_date: minDate,
        preferred_time: "10:00",
        duration_minutes: 60,
        message: "",
      });
    }
  }, [authLoading, open, user, tutor.subjects, reset, minDate]);

  const onSubmit = (data: BookingRequestFormValues) => {
    if (!user) {
      router.push(`/login?redirect=/tutors/${tutor.id}`);
      return;
    }

    requestBooking(tutor, data);

    toast.success("Lesson request sent!", {
      description: `${tutor.full_name} will review your request shortly.`,
    });
    onOpenChange(false);
    router.push("/dashboard/bookings");
  };

  const selectClass =
    "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-11 w-full rounded-xl border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a Lesson</DialogTitle>
          <DialogDescription>
            Send a booking request to {tutor.full_name} at{" "}
            {formatCurrency(tutor.hourly_rate)}/hr. Payment is arranged directly with the tutor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="student_name">Your Name</Label>
              <Input id="student_name" className="mt-1.5" {...register("student_name")} />
              {errors.student_name && (
                <p className="text-destructive mt-1 text-xs">{errors.student_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="student_email">Email</Label>
              <Input id="student_email" type="email" className="mt-1.5" {...register("student_email")} />
              {errors.student_email && (
                <p className="text-destructive mt-1 text-xs">{errors.student_email.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="subject_slug">Subject</Label>
            <select id="subject_slug" className={`${selectClass} mt-1.5`} {...register("subject_slug")}>
              {tutor.subjects.map((subject) => (
                <option key={subject.id} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject_slug && (
              <p className="text-destructive mt-1 text-xs">{errors.subject_slug.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="preferred_date" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Preferred Date
              </Label>
              <Input
                id="preferred_date"
                type="date"
                min={minDate}
                className="mt-1.5"
                {...register("preferred_date")}
              />
              {errors.preferred_date && (
                <p className="text-destructive mt-1 text-xs">{errors.preferred_date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="preferred_time" className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Preferred Time
              </Label>
              <select id="preferred_time" className={`${selectClass} mt-1.5`} {...register("preferred_time")}>
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.preferred_time && (
                <p className="text-destructive mt-1 text-xs">{errors.preferred_time.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="duration_minutes">Lesson Duration</Label>
            <select
              id="duration_minutes"
              className={`${selectClass} mt-1.5`}
              {...register("duration_minutes", { valueAsNumber: true })}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.duration_minutes && (
              <p className="text-destructive mt-1 text-xs">{errors.duration_minutes.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message to Tutor</Label>
            <Textarea
              id="message"
              placeholder="Tell the tutor about your goals, current level, and what you'd like to focus on..."
              className="mt-1.5 min-h-[100px]"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-destructive mt-1 text-xs">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
