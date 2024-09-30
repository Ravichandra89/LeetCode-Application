import { z } from "zod";

const addProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 Characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 Characters long"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string().min(1, "At least of 1 Character long")),
  example: z
    .array(
      z.object({
        input: z.string().min(1, "Input is Required"),
        output: z.string().min(1, "Output is Required"),
      })
    )
    .min(1, "At least 1 Example is Required"),
});

export default addProblemSchema;
