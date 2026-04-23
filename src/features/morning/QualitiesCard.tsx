import type { ProfileQuality } from "@/types/database";

interface QualitiesCardProps {
  qualities: ProfileQuality[];
}

export function QualitiesCard({ qualities }: QualitiesCardProps) {
  if (qualities.length === 0) return null;

  return (
    <div className="bg-card rounded-[16px] px-5 py-4 flex flex-col gap-1">
      {qualities.map((q) => (
        <p
          key={q.id}
          className="font-serif font-semibold text-[26px] text-plum leading-tight m-0"
        >
          {q.value}
        </p>
      ))}
    </div>
  );
}
