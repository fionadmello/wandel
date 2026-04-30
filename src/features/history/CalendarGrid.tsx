import { format } from "date-fns";

import { buildCalendarGrid } from "@/constants/calendarGrid";
import type {
  BreakObservationWithEmotions,
  BuildObservation,
  EngineMark,
} from "@/types/database";

import { DayCell } from "./DayCell";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  year: number;
  month: number;
  engineMarks: EngineMark[];
  breakObs: BreakObservationWithEmotions[];
  buildObs: BuildObservation[];
  onDayTap: (date: string) => void;
}

export function CalendarGrid({
  year,
  month,
  engineMarks,
  breakObs,
  buildObs,
  onDayTap,
}: CalendarGridProps) {
  const weeks = buildCalendarGrid(year, month);
  const today = format(new Date(), "yyyy-MM-dd");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const markDates = new Set(engineMarks.map((m) => m.date));

  const breakHabitsByDate = new Map<string, Set<string>>();
  breakObs.forEach((o) => {
    const date = o.logged_at.slice(0, 10);
    if (!breakHabitsByDate.has(date)) breakHabitsByDate.set(date, new Set());
    breakHabitsByDate.get(date)!.add(o.habit_id);
  });

  const buildHabitsByDate = new Map<string, Set<string>>();
  buildObs
    .filter((o) => o.mark_type !== "slip")
    .forEach((o) => {
      if (!buildHabitsByDate.has(o.date))
        buildHabitsByDate.set(o.date, new Set());
      buildHabitsByDate.get(o.date)!.add(o.habit_id);
    });

  const slipHabitsByDate = new Map<string, Set<string>>();
  buildObs
    .filter((o) => o.mark_type === "slip")
    .forEach((o) => {
      if (!slipHabitsByDate.has(o.date))
        slipHabitsByDate.set(o.date, new Set());
      slipHabitsByDate.get(o.date)!.add(o.habit_id);
    });

  return (
    <div className="flex flex-col gap-1 px-4">
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <p
            key={d}
            className="font-sans text-[10px] text-muted text-center py-1"
          >
            {d}
          </p>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1">
          {week.map((cell, di) =>
            cell ? (
              <DayCell
                key={cell.date}
                date={cell.date}
                day={cell.day}
                hasMirror={markDates.has(cell.date)}
                breakCount={breakHabitsByDate.get(cell.date)?.size ?? 0}
                buildCount={buildHabitsByDate.get(cell.date)?.size ?? 0}
                slipCount={slipHabitsByDate.get(cell.date)?.size ?? 0}
                isFuture={
                  year > currentYear ||
                  (year === currentYear &&
                    month === currentMonth &&
                    cell.date > today)
                }
                onTap={() => onDayTap(cell.date)}
              />
            ) : (
              <div key={di} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}
