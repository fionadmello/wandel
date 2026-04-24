import { getDay,getDaysInMonth } from "date-fns";

export interface CalendarDay {
  date: string; // "yyyy-MM-dd"
  day: number; // 1–31
}

export type CalendarCell = CalendarDay | null;

// Returns weeks (rows) of 7 cells, Mon-first. Null = empty leading/trailing cell.
export function buildCalendarGrid(
  year: number,
  month: number,
): CalendarCell[][] {
  const totalDays = getDaysInMonth(new Date(year, month - 1, 1));
  const pad = (n: number) => String(n).padStart(2, "0");
  const monthStr = pad(month);

  // getDay() returns 0=Sun...6=Sat. Convert to Mon-first (Mon=0...Sun=6).
  const firstDow = getDay(new Date(year, month - 1, 1));
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1;

  const cells: CalendarCell[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      return { date: `${year}-${monthStr}-${pad(day)}`, day };
    }),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
