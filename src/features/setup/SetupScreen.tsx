import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { INITIAL_DRAFT } from "@/constants/setupDraft";
import { TOTAL_CONTENT_STEPS } from "@/constants/setupSteps";
import type { SetupDraft } from "@/types/setup";

import { ConfirmStep } from "./ConfirmStep";
import { ExerciseStep } from "./ExerciseStep";
import { JobsStep } from "./JobsStep";
import { QualitiesStep } from "./QualitiesStep";
import { WelcomeStep } from "./WelcomeStep";
import { WhyStep } from "./WhyStep";

export function SetupScreen() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<SetupDraft>(INITIAL_DRAFT);

  const advance = (update: Partial<SetupDraft> = {}) => {
    setDraft((prev) => ({ ...prev, ...update }));
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <ScreenWrap padBottom={false}>
      {step > 0 && (
        <div className="flex items-center px-5 pt-[14px]">
          <button
            type="button"
            onClick={back}
            className="p-1 text-muted bg-transparent border-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex flex-1 justify-center gap-[6px]">
            {Array.from({ length: TOTAL_CONTENT_STEPS }, (_, i) => (
              <div
                key={i}
                className={`w-[7px] h-[7px] rounded-full transition-colors ${
                  i < step ? "bg-amber" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="w-[26px]" />
        </div>
      )}

      {step === 0 && <WelcomeStep onNext={() => advance()} />}
      {step === 1 && (
        <WhyStep
          value={draft.whyStatement}
          onNext={(whyStatement) => advance({ whyStatement })}
        />
      )}
      {step === 2 && (
        <QualitiesStep
          values={draft.qualities}
          onNext={(qualities) => advance({ qualities })}
        />
      )}
      {step === 3 && (
        <JobsStep values={draft.jobs} onNext={(jobs) => advance({ jobs })} />
      )}
      {step === 4 && (
        <ExerciseStep
          values={draft.exerciseTypes}
          onNext={(exerciseTypes) => advance({ exerciseTypes })}
        />
      )}
      {step === 5 && <ConfirmStep draft={draft} onSubmit={() => {}} />}
    </ScreenWrap>
  );
}
