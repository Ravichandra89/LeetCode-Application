import { z } from "zod";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least of 4 Characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be atleast of 8 character long"),
    confirmPassword: z.string().min(8),
  })
  .refine((it) => it.password === it.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signUpSchema;
