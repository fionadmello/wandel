import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { HabitScreen } from "@/features/break/HabitScreen";

export const Route = createFileRoute("/break/$habitId")({
  validateSearch: z.object({
    date: z.string().optional(),
  }),
  component: HabitScreen,
});
