import { z } from "zod";

export const whyStatementSchema = z.object({
  whyStatement: z.string().min(1, "Please share your why."),
});
