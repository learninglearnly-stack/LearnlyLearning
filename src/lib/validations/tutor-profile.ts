import { z } from "zod";

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  year: z
    .number({ error: "Year is required" })
    .min(1950, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export const experienceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  start_year: z
    .number({ error: "Start year is required" })
    .min(1950, "Invalid year")
    .max(new Date().getFullYear(), "Invalid year"),
  end_year: z.number().nullable(),
  description: z.string().min(1, "Description is required"),
});

export const tutorProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z
    .string()
    .refine(
      (val) =>
        val === "" || val.startsWith("data:image/") || z.string().url().safeParse(val).success,
      { message: "Enter a valid image URL" },
    ),
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters")
    .max(120, "Headline must be under 120 characters"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(2000, "Bio must be under 2000 characters"),
  hourly_rate: z
    .number({ error: "Hourly rate is required" })
    .min(5, "Minimum rate is $5/hr")
    .max(500, "Maximum rate is $500/hr"),
  experience_years: z
    .number({ error: "Experience is required" })
    .min(0, "Cannot be negative")
    .max(50, "Maximum 50 years"),
  is_online: z.boolean(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  subject_slugs: z.array(z.string()).min(1, "Select at least one subject"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  specialties: z.array(z.string()),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
});

export type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

export const availabilitySlotSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
});

export const availabilitySchema = z
  .array(availabilitySlotSchema)
  .refine(
    (slots) =>
      slots.every((slot) => {
        const [sh, sm] = slot.start_time.split(":").map(Number);
        const [eh, em] = slot.end_time.split(":").map(Number);
        return sh * 60 + sm < eh * 60 + em;
      }),
    { message: "End time must be after start time" },
  );

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;
