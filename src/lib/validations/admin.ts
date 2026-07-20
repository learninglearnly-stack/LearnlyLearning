import { z } from "zod";

export const createStudentSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name is required"),
});

export const createTutorSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name is required"),
  headline: z.string().optional(),
  hourly_rate: z.coerce.number().min(0).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type CreateTutorInput = z.infer<typeof createTutorSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
