import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { BuildHabitScreen } from "@/features/build/BuildHabitScreen";

export const Route = createFileRoute("/build/$habitId")({
  validateSearch: z.object({
    date: z.string().optional(),
  }),
  component: BuildHabitScreen,
});
