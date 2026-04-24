import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { HabitCard } from "@/features/break/HabitCard";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { useSession } from "@/hooks/useSession";
import type { HabitWithConfigs } from "@/types/database";

import { AddBuildHabitFlow } from "./AddBuildHabitFlow";

interface BuildContentProps {
  userId: string;
  habits: HabitWithConfigs[];
}

function BuildContent({ userId, habits }: BuildContentProps) {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  if (isAdding) {
    return (
      <AddBuildHabitFlow
        userId={userId}
        onCancel={() => setIsAdding(false)}
        onComplete={() => setIsAdding(false)}
      />
    );
  }

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 gap-6">
        <Label>Build</Label>

        {habits.length === 0 ? (
          <div className="flex flex-col gap-6 pt-8">
            <p className="font-serif italic text-[20px] text-plum leading-snug">
              No habits being built yet.
            </p>
            <Button variant="accent" onClick={() => setIsAdding(true)}>
              Add a habit to build
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  name={habit.name}
                  status={habit.status}
                  onClick={() =>
                    navigate({
                      to: "/build/$habitId",
                      params: { habitId: habit.id },
                    })
                  }
                />
              ))}
            </div>
            <Button variant="ghost" onClick={() => setIsAdding(true)}>
              Add another habit
            </Button>
          </>
        )}
      </div>
    </ScreenWrap>
  );
}

export function BuildScreen() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";
  const habitsQuery = useBuildHabits(userId);

  if (loading || !userId || habitsQuery.isLoading) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading...</p>
        </div>
      </ScreenWrap>
    );
  }

  return <BuildContent userId={userId} habits={habitsQuery.data ?? []} />;
}
