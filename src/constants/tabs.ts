import { BreakIcon } from "@/components/icons/BreakIcon";
import { BuildIcon } from "@/components/icons/BuildIcon";
import { FlameIcon } from "@/components/icons/FlameIcon";
import { HistoryIcon } from "@/components/icons/HistoryIcon";

export const TABS = [
  { id: "engine", label: "Engine", route: "/engine", Icon: FlameIcon },
  { id: "break", label: "Break", route: "/break", Icon: BreakIcon },
  { id: "build", label: "Build", route: "/build", Icon: BuildIcon },
  { id: "history", label: "History", route: "/history", Icon: HistoryIcon },
] as const;
