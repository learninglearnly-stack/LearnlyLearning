import { z } from "zod";

export const bookingRequestSchema = z.object({
  student_name: z.string().min(2, "Name must be at least 2 characters"),
  student_email: z.string().email("Enter a valid email"),
  subject_slug: z.string().min(1, "Select a subject"),
  preferred_date: z.string().min(1, "Select a date"),
  preferred_time: z.string().regex(/^\d{2}:\d{2}$/, "Select a time"),
  duration_minutes: z
    .number({ error: "Duration is required" })
    .min(30, "Minimum 30 minutes")
    .max(180, "Maximum 3 hours"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be under 500 characters"),
});

export type BookingRequestFormValues = z.infer<typeof bookingRequestSchema>;

export const tutorResponseSchema = z.object({
  message: z.string().max(300, "Message must be under 300 characters").optional(),
});

export type TutorResponseFormValues = z.infer<typeof tutorResponseSchema>;
