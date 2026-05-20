import { format, parseISO, subDays } from "date-fns";
import { useState } from "react";

import { useAllStandingUpEntries } from "@/hooks/useStandingUpLog";
import { useSubmitWeeklyReview } from "@/hooks/useSubmitWeeklyReview";
import { useWeeklyConsistency } from "@/hooks/useWeeklyConsistency";
import { currentWeekEnding } from "@/hooks/useWeeklyReview";
import type { Habit } from "@/types/database";
import type { HabitResponse, ReviewFormState } from "@/types/review";

import { ConsistencyStep } from "./steps/ConsistencyStep";
import { EngineStep } from "./steps/EngineStep";
import { HabitsStep } from "./steps/HabitsStep";
import { StandingUpStep } from "./steps/StandingUpStep";

type StepId = "engine" | "standing_up" | "habits" | "consistency";

interface ReviewFlowProps {
  userId: string;
  breakHabits: Habit[];
  buildHabits: Habit[];
  onComplete: () => void;
  onCancel: () => void;
}

function buildInitialHabitResponses(
  habits: Habit[],
): Record<string, HabitResponse> {
  return Object.fromEntries(
    habits.map((h) => [
      h.id,
      { habitId: h.id, whatDone: "", whatGotInWay: "", adjustment: "" },
    ]),
  );
}

export function ReviewFlow({
  userId,
  breakHabits,
  buildHabits,
  onComplete,
  onCancel,
}: ReviewFlowProps) {
  const weekEnding = currentWeekEnding();
  const weekStart = format(subDays(parseISO(weekEnding), 6), "yyyy-MM-dd");

  const [formState, setFormState] = useState<ReviewFormState>({
    engineResponse: "",
    prideNote: "",
    habitResponses: buildInitialHabitResponses([
      ...breakHabits,
      ...buildHabits,
    ]),
    selfRatedConsistency: null,
  });

  const standingUpQuery = useAllStandingUpEntries(userId);
  const weekEntries = (standingUpQuery.data ?? []).filter(
    (e) => e.return_date >= weekStart && e.return_date <= weekEnding,
  );
  const hasStandingUp = weekEntries.length > 0;

  const steps: StepId[] = [
    "engine",
    ...(hasStandingUp ? (["standing_up"] as StepId[]) : []),
    "habits",
    "consistency",
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const consistencyQuery = useWeeklyConsistency(userId, weekEnding);
  const submit = useSubmitWeeklyReview(userId);

  const goNext = () => setStepIndex((i) => i + 1);

  const handleSubmit = () => {
    if (formState.selfRatedConsistency === null) return;
    submit.mutate(
      {
        weekEnding,
        engineResponse: formState.engineResponse,
        prideNote: hasStandingUp ? formState.prideNote : null,
        selfRatedConsistency: formState.selfRatedConsistency,
        habitResponses: Object.values(formState.habitResponses),
      },
      { onSuccess: onComplete },
    );
  };

  const setHabitField = (
    habitId: string,
    field: keyof Omit<HabitResponse, "habitId">,
    value: string,
  ) =>
    setFormState((s) => ({
      ...s,
      habitResponses: {
        ...s.habitResponses,
        [habitId]: { ...s.habitResponses[habitId], [field]: value },
      },
    }));

  if (currentStep === "engine") {
    return (
      <EngineStep
        value={formState.engineResponse}
        onChange={(v) => setFormState((s) => ({ ...s, engineResponse: v }))}
        onNext={goNext}
        onCancel={onCancel}
      />
    );
  }

  if (currentStep === "standing_up") {
    return (
      <StandingUpStep
        entries={weekEntries}
        value={formState.prideNote}
        onChange={(v) => setFormState((s) => ({ ...s, prideNote: v }))}
        onNext={goNext}
        onCancel={onCancel}
      />
    );
  }

  if (currentStep === "habits") {
    return (
      <HabitsStep
        breakHabits={breakHabits}
        buildHabits={buildHabits}
        values={formState.habitResponses}
        onChange={setHabitField}
        onNext={goNext}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ConsistencyStep
      breakHabits={breakHabits}
      buildHabits={buildHabits}
      consistencyData={consistencyQuery.data}
      value={formState.selfRatedConsistency}
      onChange={(v) => setFormState((s) => ({ ...s, selfRatedConsistency: v }))}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={submit.isPending}
    />
  );
}
