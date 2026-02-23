import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "name must me more than 3 characters"),
  email: z.string().email()
});

export const loginSchema = z.object({
    email: z.string().email()
});
