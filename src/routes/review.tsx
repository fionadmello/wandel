import { createFileRoute } from "@tanstack/react-router";

import { ReviewScreen } from "@/features/review/ReviewScreen";

export const Route = createFileRoute("/review")({
  component: ReviewScreen,
});
