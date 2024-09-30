import { z } from "zod";

const achivementSchema = z.object({
  title: z.string().min(3, "Title should be at least of 3 Characters long"),
  description: z
    .string()
    .min(10, "Description should be at least of 10 Character"),
  bedgeUrl: z.string().url("Invalid Bedge Url"),
  awardedAt: z.date().optional(),
});

export default achivementSchema;
