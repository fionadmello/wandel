import type { Habit } from "@/types/database";
import type { HabitResponse } from "@/types/review";

interface HabitsStepProps {
  breakHabits: Habit[];
  buildHabits: Habit[];
  values: Record<string, HabitResponse>;
  onChange: (
    habitId: string,
    field: keyof Omit<HabitResponse, "habitId">,
    value: string,
  ) => void;
  onNext: () => void;
  onCancel: () => void;
}

function HabitFields({
  habit,
  value,
  onChange,
}: {
  habit: Habit;
  value: HabitResponse;
  onChange: (field: keyof Omit<HabitResponse, "habitId">, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-sm font-medium text-soft">{habit.name}</p>
      <textarea
        rows={2}
        value={value.whatDone}
        onChange={(e) => onChange("whatDone", e.target.value)}
        placeholder="What did you do?"
        className="w-full font-sans text-sm bg-card border border-border rounded-lg p-3 resize-none focus:outline-none"
      />
      <textarea
        rows={2}
        value={value.whatGotInWay}
        onChange={(e) => onChange("whatGotInWay", e.target.value)}
        placeholder="What got in the way?"
        className="w-full font-sans text-sm bg-card border border-border rounded-lg p-3 resize-none focus:outline-none"
      />
      <textarea
        rows={2}
        value={value.adjustment}
        onChange={(e) => onChange("adjustment", e.target.value)}
        placeholder="Any adjustment for next week?"
        className="w-full font-sans text-sm bg-card border border-border rounded-lg p-3 resize-none focus:outline-none"
      />
    </div>
  );
}

export function HabitsStep({
  breakHabits,
  buildHabits,
  values,
  onChange,
  onNext,
  onCancel,
}: HabitsStepProps) {
  const allHabits = [...breakHabits, ...buildHabits];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-serif italic text-2xl text-plum leading-snug">
          Your habits
        </p>
        <p className="font-sans text-sm text-muted">
          Reflect on each habit this week.
        </p>
      </div>

      {allHabits.map((habit) => (
        <HabitFields
          key={habit.id}
          habit={habit}
          value={
            values[habit.id] ?? {
              habitId: habit.id,
              whatDone: "",
              whatGotInWay: "",
              adjustment: "",
            }
          }
          onChange={(field, v) => onChange(habit.id, field, v)}
        />
      ))}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-sm text-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          className="font-sans text-sm text-plum"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
