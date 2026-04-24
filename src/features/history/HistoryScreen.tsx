import { format } from "date-fns";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import {
  useMonthBreakObservations,
  useMonthBuildObservations,
  useMonthEngineMarks,
} from "@/hooks/useMonthData";
import { useSession } from "@/hooks/useSession";

import { CalendarGrid } from "./CalendarGrid";
import { DaySheet } from "./DaySheet";
import { MonthNav } from "./MonthNav";

interface HistoryContentProps {
  userId: string;
}

function HistoryContent({ userId }: HistoryContentProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const engineMarksQuery = useMonthEngineMarks(userId, year, month);
  const breakObsQuery = useMonthBreakObservations(userId, year, month);
  const buildObsQuery = useMonthBuildObservations(userId, year, month);
  const breakHabitsQuery = useBreakHabits(userId);
  const buildHabitsQuery = useBuildHabits(userId);

  const engineMarks = engineMarksQuery.data ?? [];
  const breakObs = breakObsQuery.data ?? [];
  const buildObs = buildObsQuery.data ?? [];
  const breakHabits = breakHabitsQuery.data ?? [];
  const buildHabits = buildHabitsQuery.data ?? [];

  const today = format(new Date(), "yyyy-MM-dd");
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const goToPrev = () => {
    if (month === 1) {
      setYear((y: number) => y - 1);
      setMonth(12);
    } else setMonth((m: number) => m - 1);
  };

  const goToNext = () => {
    if (year === currentYear && month === currentMonth) return;
    if (month === 12) {
      setYear((y: number) => y + 1);
      setMonth(1);
    } else setMonth((m: number) => m + 1);
  };

  const selectedMark = selectedDate
    ? (engineMarks.find((m) => m.date === selectedDate) ?? null)
    : null;

  const selectedBreakObs = selectedDate
    ? breakObs.filter((o) => o.logged_at.slice(0, 10) === selectedDate)
    : [];

  const selectedBuildObs = selectedDate
    ? buildObs.filter((o) => o.date === selectedDate)
    : [];

  const isFuture = !!selectedDate && selectedDate > today;

  return (
    <ScreenWrap>
      <MonthNav year={year} month={month} onPrev={goToPrev} onNext={goToNext} />

      <CalendarGrid
        year={year}
        month={month}
        engineMarks={engineMarks}
        breakObs={breakObs}
        buildObs={buildObs}
        onDayTap={setSelectedDate}
      />

      {selectedDate && (
        <DaySheet
          date={selectedDate}
          engineMark={selectedMark}
          breakObs={selectedBreakObs}
          buildObs={selectedBuildObs}
          breakHabits={breakHabits}
          buildHabits={buildHabits}
          isFuture={isFuture}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </ScreenWrap>
  );
}

export function HistoryScreen() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";

  if (loading || !userId) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading...</p>
        </div>
      </ScreenWrap>
    );
  }

  return <HistoryContent userId={userId} />;
}
