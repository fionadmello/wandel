import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useSession } from "@/hooks/useSession";
import type { HabitWithConfigs } from "@/types/database";

import { AddHabitFlow } from "./AddHabitFlow";
import { HabitCard } from "./HabitCard";

interface BreakContentProps {
  userId: string;
  habits: HabitWithConfigs[];
}

function BreakContent({ userId, habits }: BreakContentProps) {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <AddHabitFlow
        userId={userId}
        onCancel={() => setIsAdding(false)}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 gap-6">
        <Label>Break</Label>

        {habits.length === 0 ? (
          <div className="flex flex-col gap-6 pt-8">
            <p className="font-serif italic text-[20px] text-plum leading-snug">
              No habits being tracked yet.
            </p>
            <Button variant="accent" onClick={() => setIsAdding(true)}>
              Add a habit to break
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
                      to: "/break/$habitId",
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

export function BreakScreen() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";
  const habitsQuery = useBreakHabits(userId);

  if (loading || !userId || habitsQuery.isLoading) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading...</p>
        </div>
      </ScreenWrap>
    );
  }

  return <BreakContent userId={userId} habits={habitsQuery.data ?? []} />;
}
