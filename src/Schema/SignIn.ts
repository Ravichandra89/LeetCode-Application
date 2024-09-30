import { z } from "zod";

const signInSchema = z.object({
  username: z.string().min(4, "Username must be at least of 4 Characters long"),
  password: z.string().min(8, "Password must be atleast of 8 character long"),
});

export default signInSchema;
