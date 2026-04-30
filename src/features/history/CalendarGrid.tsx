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
  const smokingDates = new Set(breakObs.map((o) => o.logged_at.slice(0, 10)));
  const exerciseDates = new Set(
    buildObs.filter((o) => o.mark_type !== "slip").map((o) => o.date),
  );
  const slipDates = new Set(
    buildObs.filter((o) => o.mark_type === "slip").map((o) => o.date),
  );

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
                hasSmoking={smokingDates.has(cell.date)}
                hasExercise={exerciseDates.has(cell.date)}
                hasSlip={slipDates.has(cell.date)}
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
