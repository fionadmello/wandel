import { z } from "zod";

export const emailPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type EmailPasswordFormData = z.infer<typeof emailPasswordSchema>;
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
