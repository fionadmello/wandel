import { format } from "date-fns";

import { buildCalendarGrid } from "@/constants/calendarGrid";
import type {
  BreakObservationWithEmotions,
  BuildObservation,
  Habit,
} from "@/types/database";

import { DayCell } from "./DayCell";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  year: number;
  month: number;
  engineActivityDates: string[];
  breakHabits: Habit[];
  breakObs: BreakObservationWithEmotions[];
  buildObs: BuildObservation[];
  onDayTap: (date: string) => void;
}

export function CalendarGrid({
  year,
  month,
  engineActivityDates,
  breakHabits,
  breakObs,
  buildObs,
  onDayTap,
}: CalendarGridProps) {
  const weeks = buildCalendarGrid(year, month);
  const today = format(new Date(), "yyyy-MM-dd");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const activitySet = new Set(engineActivityDates);

  // Dates where the break habit was used (an observation was logged)
  const breakUsedByDate = new Map<string, Set<string>>();
  breakObs.forEach((o) => {
    const date = o.logged_at.slice(0, 10);
    if (!breakUsedByDate.has(date)) breakUsedByDate.set(date, new Set());
    breakUsedByDate.get(date)!.add(o.habit_id);
  });

  // Habits eligible to show clean-day dots (active or paused, not deactivated or scheduled)
  const eligibleBreakHabits = breakHabits.filter(
    (h) => h.status !== "deactivated" && h.status !== "scheduled",
  );

  // Dates where a build observation was logged (excluding no-longer-valid slip marks)
  const buildHabitsByDate = new Map<string, Set<string>>();
  buildObs.forEach((o) => {
    if (!buildHabitsByDate.has(o.date))
      buildHabitsByDate.set(o.date, new Set());
    buildHabitsByDate.get(o.date)!.add(o.habit_id);
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
                hasEngineActivity={activitySet.has(cell.date)}
                breakCount={
                  eligibleBreakHabits.filter(
                    (h) =>
                      h.created_at.slice(0, 10) <= cell.date &&
                      !breakUsedByDate.get(cell.date)?.has(h.id),
                  ).length
                }
                buildCount={buildHabitsByDate.get(cell.date)?.size ?? 0}
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
