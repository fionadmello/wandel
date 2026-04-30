import { Divider } from "@/components/ui/Divider";
import { Label } from "@/components/ui/Label";

interface AtAGlanceProps {
  breakObsCount: number;
  hasBuildObs: boolean;
}

export function AtAGlance({ breakObsCount, hasBuildObs }: AtAGlanceProps) {
  return (
    <>
      <Divider className="my-0" />
      <div className="flex flex-col gap-2 pb-2">
        <Label>Today at a glance</Label>
        <div className="flex gap-4">
          {hasBuildObs && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber shrink-0" />
              <span className="font-sans text-[13px] text-plum">
                Build habit
              </span>
            </div>
          )}
          {breakObsCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
              <span className="font-sans text-[13px] text-plum">
                {breakObsCount} {breakObsCount === 1 ? "log" : "logs"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
