import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { PausedBanner } from "@/features/break/PausedBanner";
import { useBuildHabit } from "@/hooks/useBuildHabits";
import {
  useResetBuildHabit,
  useUpdateHabitStatus,
} from "@/hooks/useHabitStatus";
import { useSession } from "@/hooks/useSession";
import type { HabitWithConfigs } from "@/types/database";

import { BuildConfigPanel } from "./BuildConfigPanel";
import { BuildLogForm } from "./BuildLogForm";
import { DeactivatedState } from "./DeactivatedState";
import { ScheduledState } from "./ScheduledState";

interface BuildHabitContentProps {
  userId: string;
  habit: HabitWithConfigs;
}

function BuildHabitContent({ userId, habit }: BuildHabitContentProps) {
  const [showConfig, setShowConfig] = useState(false);
  const navigate = useNavigate();

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateHabitStatus(userId);
  const { mutate: resetHabit, isPending: isResetting } =
    useResetBuildHabit(userId);

  const isPending = isUpdatingStatus || isResetting;

  if (showConfig) {
    return (
      <BuildConfigPanel
        userId={userId}
        habitId={habit.id}
        habitName={habit.name}
        configs={habit.configs ?? []}
        status={habit.status}
        onClose={() => setShowConfig(false)}
      />
    );
  }

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 gap-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/build" })}
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
            onClick={() => setShowConfig(true)}
            className="p-1 text-muted bg-transparent border-none cursor-pointer"
            aria-label="Configure habit"
          >
            <Settings size={18} />
          </button>
        </div>

        {habit.status === "active" && (
          <BuildLogForm
            userId={userId}
            habitId={habit.id}
            habitName={habit.name}
            configs={habit.configs ?? []}
          />
        )}

        {habit.status === "scheduled" && (
          <ScheduledState
            isPending={isPending}
            onStart={() =>
              updateStatus({ habitId: habit.id, status: "active" })
            }
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
          <DeactivatedState
            isPending={isPending}
            onReset={() => resetHabit(habit.id)}
          />
        )}
      </div>
    </ScreenWrap>
  );
}

export function BuildHabitScreen() {
  const { habitId } = useParams({ strict: false });
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";
  const habitQuery = useBuildHabit(userId, habitId ?? "");

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

  return <BuildHabitContent userId={userId} habit={habitQuery.data} />;
}
