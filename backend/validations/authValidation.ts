import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long")
    .regex(/^[A-Za-z]{3,}(?:[ '-][A-Za-z]+)*$/, "Invalid name format"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254)
    .transform((email) => email.toLowerCase())
    .refine((email) => !email.includes(".."), {
      message: "Email cannot contain consecutive dots",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254)
    .transform((email) => email.toLowerCase())
    .refine((email) => !email.includes(".."), {
      message: "Email cannot contain consecutive dots",
    }),
});
