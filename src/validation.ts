// src/validation.ts
import { z } from "zod";

export const roleSchema = z.enum(["1", "2", "3", "4", "5", "lecturer_staff"]);

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(254),
  phone: z.string().trim().min(6, "Too short").max(40),
  role: roleSchema,
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),

  // ✅ allow placeholder for now
  turnstileToken: z.string().trim().min(1, "Captcha required"),

  honeypot: z.string().optional()
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
