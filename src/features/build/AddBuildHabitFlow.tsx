import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { Button } from "@/components/ui/Button";
import type { SubTypeConfig } from "@/hooks/useBuildHabits";
import { useAddBuildHabit } from "@/hooks/useBuildHabits";
import type { HabitStatus } from "@/types/database";

import { ExerciseConfigStep } from "./ExerciseConfigStep";
import { SubTypeStep } from "./SubTypeStep";

interface NameStepProps {
  onNext: (name: string) => void;
  onCancel: () => void;
}

function NameStep({ onNext, onCancel }: NameStepProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Give this habit a name.");
      return;
    }
    onNext(trimmed);
  };

  return (
    <ScreenWrap>
      <div className="flex flex-col px-8 py-12 gap-8">
        <button
          type="button"
          onClick={onCancel}
          className="self-start p-1 text-muted bg-transparent border-none cursor-pointer"
          aria-label="Cancel"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif italic text-[32px] leading-tight text-plum">
            What habit are you building?
          </h2>
          <p className="font-sans text-xs text-muted">Give it a name.</p>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleNext()}
          placeholder="e.g. Exercise"
          className="w-full bg-card border border-[0.5px] border-border rounded-2xl px-4 py-3 font-sans text-[15px] text-plum outline-none placeholder:text-muted"
          autoFocus
        />
        {error && <p className="font-sans text-xs text-amber">{error}</p>}
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </ScreenWrap>
  );
}

interface AddBuildHabitFlowProps {
  userId: string;
  onCancel: () => void;
  onComplete: () => void;
}

export function AddBuildHabitFlow({
  userId,
  onCancel,
  onComplete,
}: AddBuildHabitFlowProps) {
  const [step, setStep] = useState(0);
  const [habitName, setHabitName] = useState("");
  const [subTypeConfigs, setSubTypeConfigs] = useState<SubTypeConfig[]>([]);
  const { mutate: addHabit, isPending, isError } = useAddBuildHabit(userId);

  const save = (status: HabitStatus, configs: SubTypeConfig[]) => {
    addHabit({ name: habitName, configs, status }, { onSuccess: onComplete });
  };

  // Step 0: name
  if (step === 0) {
    return (
      <NameStep
        onNext={(name) => {
          setHabitName(name);
          setStep(1);
        }}
        onCancel={onCancel}
      />
    );
  }

  // Step 1: sub-types
  if (step === 1) {
    return (
      <SubTypeStep
        habitName={habitName}
        onNext={(subTypes) => {
          if (subTypes.length > 0) {
            setSubTypeConfigs(subTypes);
            setStep(3); // skip direct config
          } else {
            setSubTypeConfigs([]);
            setStep(2); // direct config
          }
        }}
        onCancel={onCancel}
      />
    );
  }

  // Step 2: direct config (no sub-types)
  if (step === 2) {
    return (
      <ScreenWrap>
        <ExerciseConfigStep
          habitName={habitName}
          submitLabel="Next"
          onNext={(values) => {
            setSubTypeConfigs([{ subType: null, ...values }]);
            setStep(3);
          }}
          onCancel={onCancel}
        />
      </ScreenWrap>
    );
  }

  // Step 3: status
  return (
    <ScreenWrap>
      <div className="flex flex-col px-8 py-12 gap-8">
        <button
          type="button"
          onClick={() => setStep(subTypeConfigs[0]?.subType === null ? 2 : 1)}
          className="self-start p-1 text-muted bg-transparent border-none cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif italic text-[32px] leading-tight text-plum">
            When do you want to start?
          </h2>
          <p className="font-sans text-xs text-muted">
            You can always change this later.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            variant="accent"
            onClick={() => save("active", subTypeConfigs)}
            disabled={isPending}
          >
            Start now
          </Button>
          <Button
            variant="ghost"
            onClick={() => save("scheduled", subTypeConfigs)}
            disabled={isPending}
          >
            Schedule for later
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[13px] text-muted text-center bg-transparent border-none cursor-pointer pt-2"
          >
            Cancel
          </button>
        </div>
        {isError && (
          <p className="font-sans text-xs text-amber">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </ScreenWrap>
  );
}
