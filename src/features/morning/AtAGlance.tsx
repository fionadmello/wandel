import { Divider } from "@/components/ui/Divider";
import { Label } from "@/components/ui/Label";

interface AtAGlanceProps {
  smokingCount: number;
  hasExercise: boolean;
}

export function AtAGlance({ smokingCount, hasExercise }: AtAGlanceProps) {
  return (
    <>
      <Divider className="my-0" />
      <div className="flex flex-col gap-2 pb-2">
        <Label>Today at a glance</Label>
        <div className="flex gap-4">
          {hasExercise && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet shrink-0" />
              <span className="font-sans text-[13px] text-plum">Exercise</span>
            </div>
          )}
          {smokingCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
              <span className="font-sans text-[13px] text-plum">
                {smokingCount} {smokingCount === 1 ? "cigarette" : "cigarettes"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
