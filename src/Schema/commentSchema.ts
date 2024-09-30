import { z } from "zod";

const commentSchema = z.object({
  username: z.string(),
  problemId: z.string(),
  content: z.string().min(5, "Comment should be at least 5 Character long"),
});

export default commentSchema;
