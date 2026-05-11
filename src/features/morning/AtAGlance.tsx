import { Divider } from "@/components/ui/Divider";
import { Label } from "@/components/ui/Label";
import type { TrackType } from "@/types/database";

interface HabitEntry {
  id: string;
  name: string;
  category: "break" | "build";
}

interface AtAGlanceProps {
  activeBreakHabits: HabitEntry[];
  activeBuildHabits: HabitEntry[];
  breakObsCount: number;
  hasBuildObs: boolean;
  onSlip: (habitId: string, trackType: TrackType, trackName: string) => void;
}

export function AtAGlance({
  activeBreakHabits,
  activeBuildHabits,
  breakObsCount,
  hasBuildObs,
  onSlip,
}: AtAGlanceProps) {
  return (
    <>
      <Divider className="my-0" />
      <div className="flex flex-col gap-3 pb-2">
        <Label>Today at a glance</Label>

        {activeBuildHabits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber shrink-0" />
              <span className="font-sans text-[13px] text-plum">
                {hasBuildObs ? habit.name : habit.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSlip(habit.id, "build", habit.name)}
              className="font-sans text-[11px] text-muted bg-transparent border-none cursor-pointer"
            >
              I slipped
            </button>
          </div>
        ))}

        {activeBreakHabits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
              <span className="font-sans text-[13px] text-plum">
                {breakObsCount > 0
                  ? `${breakObsCount} ${breakObsCount === 1 ? "log" : "logs"}`
                  : habit.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSlip(habit.id, "break", habit.name)}
              className="font-sans text-[11px] text-muted bg-transparent border-none cursor-pointer"
            >
              I slipped
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
