import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { MorningScreen } from "@/features/morning/MorningScreen";

export const Route = createFileRoute("/morning")({
  validateSearch: z.object({
    date: z.string().optional(),
  }),
  component: MorningScreen,
});
