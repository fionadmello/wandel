import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { EngineScreen } from "@/features/engine/EngineScreen";

export const Route = createFileRoute("/engine")({
  validateSearch: z.object({
    date: z.string().optional(),
  }),
  component: EngineScreen,
});
