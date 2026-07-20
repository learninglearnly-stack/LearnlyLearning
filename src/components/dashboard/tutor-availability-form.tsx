"use client";

import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TutorDashboardShell } from "@/components/dashboard/tutor-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTutorAvailability } from "@/hooks/use-tutor-profile";
import { DAYS_OF_WEEK, TIME_OPTIONS } from "@/lib/constants/tutor-dashboard";
import type { AvailabilitySlot, DayOfWeek } from "@/types";

export function TutorAvailabilityForm() {
  const { availability, updateAvailability, isLoaded } = useTutorAvailability();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setSlots(availability);
    }
  }, [isLoaded, availability]);

  const slotsForDay = (day: DayOfWeek) => slots.filter((s) => s.day === day);

  const addSlot = (day: DayOfWeek) => {
    setSlots((prev) => [
      ...prev,
      { day, start_time: "09:00", end_time: "17:00" },
    ]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: "start_time" | "end_time", value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  };

  const handleSave = () => {
    const invalid = slots.some((slot) => {
      const [sh, sm] = slot.start_time.split(":").map(Number);
      const [eh, em] = slot.end_time.split(":").map(Number);
      return sh * 60 + sm >= eh * 60 + em;
    });

    if (invalid) {
      toast.error("End time must be after start time for all slots");
      return;
    }

    setIsSaving(true);
    updateAvailability(slots);
    toast.success("Availability saved successfully");
    setIsSaving(false);
  };

  const copyToAllWeekdays = () => {
    const mondaySlots = slotsForDay("monday");
    if (mondaySlots.length === 0) {
      toast.error("Add Monday slots first, then copy to weekdays");
      return;
    }

    const weekdays: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday"];
    const weekendSlots = slots.filter(
      (s) => s.day === "saturday" || s.day === "sunday",
    );

    const newSlots: AvailabilitySlot[] = [...weekendSlots];
    for (const day of ["monday", ...weekdays] as DayOfWeek[]) {
      for (const slot of mondaySlots) {
        newSlots.push({ ...slot, day });
      }
    }

    setSlots(newSlots);
    toast.success("Copied Monday schedule to all weekdays");
  };

  if (!isLoaded) {
    return (
      <TutorDashboardShell title="Availability">
        <div className="bg-muted h-96 animate-pulse rounded-2xl" />
      </TutorDashboardShell>
    );
  }

  return (
    <TutorDashboardShell
      title="Availability"
      description="Set your weekly teaching schedule"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Add time blocks for each day you&apos;re available to teach
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={copyToAllWeekdays}>
              Copy Mon → Weekdays
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {DAYS_OF_WEEK.map(({ value: day, label }) => {
              const daySlots = slots
                .map((slot, globalIndex) => ({ slot, globalIndex }))
                .filter(({ slot }) => slot.day === day);

              return (
                <div key={day} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{label}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addSlot(day)}
                    >
                      <Plus className="h-4 w-4" />
                      Add slot
                    </Button>
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Not available</p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map(({ slot, globalIndex }) => (
                        <div
                          key={`${day}-${globalIndex}`}
                          className="bg-muted/50 flex items-center gap-3 rounded-xl border p-3"
                        >
                          <div className="grid flex-1 grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">From</Label>
                              <select
                                value={slot.start_time}
                                onChange={(e) =>
                                  updateSlot(globalIndex, "start_time", e.target.value)
                                }
                                className="border-input bg-background mt-1 flex h-10 w-full rounded-xl border px-3 text-sm"
                              >
                                {TIME_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className="text-xs">To</Label>
                              <select
                                value={slot.end_time}
                                onChange={(e) =>
                                  updateSlot(globalIndex, "end_time", e.target.value)
                                }
                                className="border-input bg-background mt-1 flex h-10 w-full rounded-xl border px-3 text-sm"
                              >
                                {TIME_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => removeSlot(globalIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No availability set. Add time slots above.
              </p>
            ) : (
              <div className="space-y-2">
                {DAYS_OF_WEEK.map(({ value: day, label }) => {
                  const daySlots = slotsForDay(day);
                  if (daySlots.length === 0) return null;
                  return (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">
                        {daySlots
                          .map((s) => `${formatTime(s.start_time)} – ${formatTime(s.end_time)}`)
                          .join(", ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Availability"
            )}
          </Button>
        </div>
      </div>
    </TutorDashboardShell>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
