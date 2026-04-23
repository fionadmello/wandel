import { format } from "date-fns";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { ReminderCard } from "@/components/ui/ReminderCard";
import { useBreakObservations } from "@/hooks/useBreakObservations";
import { useEngineMark } from "@/hooks/useEngineMark";
import { useProfile, useProfileQualities } from "@/hooks/useProfile";
import { useReminderRotation } from "@/hooks/useReminderRotation";
import { useSession } from "@/hooks/useSession";
import { useTodayBuildObservations } from "@/hooks/useTodayBuildObservations";

import { AtAGlance } from "./AtAGlance";
import { EngineSection } from "./EngineSection";
import { MorningDecorations } from "./MorningDecorations";
import { QualitiesCard } from "./QualitiesCard";

interface MorningContentProps {
  userId: string;
}

function MorningContent({ userId }: MorningContentProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  const profileQuery = useProfile(userId);
  const qualitiesQuery = useProfileQualities(userId);
  const engineMarkQuery = useEngineMark(userId, today);
  const breakObsQuery = useBreakObservations(userId, today);
  const buildObsQuery = useTodayBuildObservations(userId);

  const reminder = useReminderRotation(userId);
  const marked = !!engineMarkQuery.data;
  const whyStatement = profileQuery.data?.why_statement ?? "";
  const qualities = qualitiesQuery.data ?? [];
  const smokingCount = breakObsQuery.data?.length ?? 0;
  const hasExercise = (buildObsQuery.data?.length ?? 0) > 0;

  return (
    <ScreenWrap>
      <MorningDecorations />
      <div className="flex flex-col px-6 pt-6 gap-6 relative">
        <p className="font-serif italic text-[15px] text-muted">
          {format(new Date(), "EEEE, d MMMM")}
        </p>

        {reminder && <ReminderCard text={reminder} />}

        {whyStatement && (
          <p className="font-serif italic text-[15px] text-violet leading-[1.7]">
            {whyStatement}
          </p>
        )}

        <QualitiesCard qualities={qualities} />

        <EngineSection userId={userId} marked={marked} />

        {(smokingCount > 0 || hasExercise) && (
          <AtAGlance smokingCount={smokingCount} hasExercise={hasExercise} />
        )}
      </div>
    </ScreenWrap>
  );
}

export function MorningScreen() {
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

  return <MorningContent userId={userId} />;
}
