import { useNavigate, useParams } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { useBreakHabit } from "@/hooks/useBreakHabits";
import {
  useResetBreakHabit,
  useUpdateHabitStatus,
} from "@/hooks/useHabitStatus";
import { useSession } from "@/hooks/useSession";
import type { HabitWithConfigs } from "@/types/database";

import { JobConfigPanel } from "./JobConfigPanel";
import { LogForm } from "./LogForm";
import { PausedBanner } from "./PausedBanner";

interface HabitContentProps {
  userId: string;
  habit: HabitWithConfigs;
}

function HabitContent({ userId, habit }: HabitContentProps) {
  const [showJobConfig, setShowJobConfig] = useState(false);
  const navigate = useNavigate();

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateHabitStatus(userId);
  const { mutate: resetHabit, isPending: isResetting } =
    useResetBreakHabit(userId);

  const isPending = isUpdatingStatus || isResetting;

  if (showJobConfig) {
    return (
      <JobConfigPanel
        userId={userId}
        habitId={habit.id}
        habitName={habit.name}
        currentConfigs={habit.configs}
        onClose={() => setShowJobConfig(false)}
      />
    );
  }

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 gap-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/break" })}
            className="p-1 text-muted bg-transparent border-none cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-sans text-sm font-medium text-plum">
            {habit.name}
          </h1>
          <button
            type="button"
            onClick={() => setShowJobConfig(true)}
            className="p-1 text-muted bg-transparent border-none cursor-pointer"
            aria-label="Configure jobs"
          >
            <Settings size={18} />
          </button>
        </div>

        {habit.status === "active" && (
          <LogForm
            userId={userId}
            habitId={habit.id}
            jobConfigs={habit.configs}
          />
        )}

        {habit.status === "paused" && habit.paused_at && (
          <PausedBanner
            pausedAt={habit.paused_at}
            isPending={isPending}
            onResume={() =>
              updateStatus({ habitId: habit.id, status: "active" })
            }
            onReset={() => resetHabit(habit.id)}
            onDeactivate={() =>
              updateStatus({ habitId: habit.id, status: "deactivated" })
            }
          />
        )}

        {habit.status === "deactivated" && (
          <p className="font-serif italic text-[18px] text-muted leading-snug pt-4">
            This habit has been deactivated.
          </p>
        )}
      </div>
    </ScreenWrap>
  );
}

export function HabitScreen() {
  const { habitId } = useParams({ strict: false });
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";
  const habitQuery = useBreakHabit(userId, habitId ?? "");

  if (loading || !userId || habitQuery.isLoading) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading...</p>
        </div>
      </ScreenWrap>
    );
  }

  if (!habitQuery.data) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Habit not found.</p>
        </div>
      </ScreenWrap>
    );
  }

  return <HabitContent userId={userId} habit={habitQuery.data} />;
}
