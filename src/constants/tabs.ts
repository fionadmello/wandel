import { BreakIcon } from "@/components/icons/BreakIcon";
import { BuildIcon } from "@/components/icons/BuildIcon";
import { HistoryIcon } from "@/components/icons/HistoryIcon";
import { MorningIcon } from "@/components/icons/MorningIcon";

export const TABS = [
  { id: "morning", label: "Morning", route: "/morning", Icon: MorningIcon },
  { id: "break", label: "Break", route: "/break", Icon: BreakIcon },
  { id: "build", label: "Build", route: "/build", Icon: BuildIcon },
  { id: "history", label: "History", route: "/history", Icon: HistoryIcon },
] as const;
