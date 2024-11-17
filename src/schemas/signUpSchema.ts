import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(20, "username must be no more  than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters " }),
});
