import type { MarkType } from "@/types/database";

interface MarkIndicatorProps {
  type: MarkType;
  selected?: boolean;
}

export function MarkIndicator({ type, selected = false }: MarkIndicatorProps) {
  return <span data-type={type} data-selected={selected} />;
}
