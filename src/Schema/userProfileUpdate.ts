import { z } from "zod";

const userProfileUpdateSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Invalid Email Address").optional(),
  profilePhoto: z.string().url("Invalid photo Url").optional(),
});

export default userProfileUpdateSchema;
