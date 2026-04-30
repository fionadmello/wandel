import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import type { SubTypeConfig } from "@/hooks/useBuildHabits";
import { useAddBuildHabit } from "@/hooks/useBuildHabits";
import type { HabitStatus } from "@/types/database";

import { NameStep } from "./NameStep";
import { StatusStep } from "./StatusStep";
import { SubTypeStep } from "./SubTypeStep";
import { VariationConfigStep } from "./VariationConfigStep";

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

  const save = (status: HabitStatus) => {
    addHabit(
      { name: habitName, configs: subTypeConfigs, status },
      { onSuccess: onComplete },
    );
  };

  const backFromStatus =
    subTypeConfigs.length > 0 && subTypeConfigs[0].subType === null ? 2 : 1;

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

  if (step === 1) {
    return (
      <SubTypeStep
        habitName={habitName}
        onNext={(subTypes) => {
          if (subTypes.length > 0) {
            setSubTypeConfigs(subTypes);
            setStep(3);
          } else {
            setSubTypeConfigs([]);
            setStep(2);
          }
        }}
        onCancel={onCancel}
      />
    );
  }

  if (step === 2) {
    return (
      <ScreenWrap>
        <VariationConfigStep
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

  return (
    <StatusStep
      isPending={isPending}
      isError={isError}
      onNext={save}
      onBack={() => setStep(backFromStatus)}
      onCancel={onCancel}
    />
  );
}
