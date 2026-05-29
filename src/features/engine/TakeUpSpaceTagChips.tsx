import type { TakeUpSpaceTag } from "@/types/takeUpSpace";

interface TakeUpSpaceTagChipsProps {
  tags: TakeUpSpaceTag[];
}

export function TakeUpSpaceTagChips({ tags }: TakeUpSpaceTagChipsProps) {
  const active = tags.filter((t) => t.active);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {active.map((tag) => (
        <span
          key={tag.id}
          className="bg-rose/10 text-rose rounded-full px-4 py-2 font-sans text-[12px] font-medium"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}
