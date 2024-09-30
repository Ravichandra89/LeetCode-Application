import { z } from "zod";

const problemSubmmisionSchema = z.object({
  code: z.string().min(10, "code must be at least 10 Character long"),
  problemId: z.string(),
  userId: z.string(),
  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ),
});

export default problemSubmmisionSchema;
