import { useSearch } from "@tanstack/react-router";
import { format, isSunday, parseISO } from "date-fns";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { DateSelector } from "@/components/ui/DateSelector";
import { ReminderCard } from "@/components/ui/ReminderCard";
import type { HabitSlipContext } from "@/features/protocols/HabitSlipModal";
import { HabitSlipModal } from "@/features/protocols/HabitSlipModal";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBreakObservations } from "@/hooks/useBreakObservations";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { useEngineMark } from "@/hooks/useEngineMark";
import { useProfile, useProfileQualities } from "@/hooks/useProfile";
import { useReminderRotation } from "@/hooks/useReminderRotation";
import { useSession } from "@/hooks/useSession";
import { useTodayBuildObservations } from "@/hooks/useTodayBuildObservations";
import { currentWeekEnding, useWeeklyReview } from "@/hooks/useWeeklyReview";

import { AtAGlance } from "./AtAGlance";
import { EngineSection } from "./EngineSection";
import { MorningDecorations } from "./MorningDecorations";
import { QualitiesCard } from "./QualitiesCard";
import { WeeklyReviewPrompt } from "./WeeklyReviewPrompt";

interface MorningContentProps {
  userId: string;
  initialLogDate: string;
}

function MorningContent({ userId, initialLogDate }: MorningContentProps) {
  const [logDate, setLogDate] = useState(initialLogDate);
  const [slippingHabit, setSlippingHabit] = useState<HabitSlipContext | null>(
    null,
  );
  const isToday = logDate === format(new Date(), "yyyy-MM-dd");

  const profileQuery = useProfile(userId);
  const qualitiesQuery = useProfileQualities(userId);
  const engineMarkQuery = useEngineMark(userId, logDate);
  const breakObsQuery = useBreakObservations(userId, logDate);
  const buildObsQuery = useTodayBuildObservations(userId);
  const breakHabitsQuery = useBreakHabits(userId);
  const buildHabitsQuery = useBuildHabits(userId);
  const weeklyReviewQuery = useWeeklyReview(userId, parseISO(logDate));

  const reminder = useReminderRotation(userId);
  const marked = !!engineMarkQuery.data;
  const whyStatement = profileQuery.data?.why_statement ?? "";
  const qualities = qualitiesQuery.data ?? [];
  const breakObsCount = breakObsQuery.data?.length ?? 0;
  const hasBuildObs = (buildObsQuery.data?.length ?? 0) > 0;
  const weeklyReview = weeklyReviewQuery.data ?? null;
  const weekEnding = currentWeekEnding(parseISO(logDate));

  const activeBreakHabits = (breakHabitsQuery.data ?? [])
    .filter((h) => h.status === "active")
    .map((h) => ({ id: h.id, name: h.name, category: "break" as const }));
  const activeBuildHabits = (buildHabitsQuery.data ?? [])
    .filter((h) => h.status === "active")
    .map((h) => ({ id: h.id, name: h.name, category: "build" as const }));

  return (
    <ScreenWrap>
      <MorningDecorations />
      <div className="flex flex-col px-6 pt-6 gap-6 relative">
        <DateSelector value={logDate} onChange={setLogDate} />

        {isToday &&
          (activeBreakHabits.length > 0 || activeBuildHabits.length > 0) && (
            <AtAGlance
              activeBreakHabits={activeBreakHabits}
              activeBuildHabits={activeBuildHabits}
              breakObsCount={breakObsCount}
              hasBuildObs={hasBuildObs}
              onSlip={(habitId, trackType, trackName) =>
                setSlippingHabit({ habitId, trackType, trackName })
              }
            />
          )}

        {reminder && <ReminderCard text={reminder} />}

        {whyStatement && (
          <p className="font-serif italic text-[15px] text-violet leading-[1.7]">
            {whyStatement}
          </p>
        )}

        <QualitiesCard qualities={qualities} />

        <EngineSection userId={userId} marked={marked} date={logDate} />

        {isSunday(parseISO(logDate)) && (
          <WeeklyReviewPrompt review={weeklyReview} weekEnding={weekEnding} />
        )}

        {slippingHabit && (
          <HabitSlipModal
            habit={slippingHabit}
            userId={userId}
            onComplete={() => setSlippingHabit(null)}
          />
        )}
      </div>
    </ScreenWrap>
  );
}

export function MorningScreen() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";
  const search = useSearch({ strict: false }) as { date?: string };
  const initialLogDate = search.date ?? format(new Date(), "yyyy-MM-dd");

  if (loading || !userId) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading...</p>
        </div>
      </ScreenWrap>
    );
  }

  return <MorningContent userId={userId} initialLogDate={initialLogDate} />;
}
