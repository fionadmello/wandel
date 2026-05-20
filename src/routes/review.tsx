import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ReviewScreen } from "@/features/review/ReviewScreen";

export const Route = createFileRoute("/review")({
  validateSearch: z.object({ weekEnding: z.string().optional() }),
  component: ReviewScreen,
});
