import type { MarkType } from "@/types/database";

interface MarkIndicatorProps {
  type: MarkType;
  selected?: boolean;
}

export function MarkIndicator({ type, selected = false }: MarkIndicatorProps) {
  const stroke = selected ? "var(--color-amber)" : "var(--color-border)";

  if (type === "full") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill={selected ? "var(--color-amber)" : "none"}
          stroke={stroke}
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (type === "half") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
        {selected && (
          <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="var(--color-amber)" />
        )}
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
      />
      {selected && <circle cx="10" cy="10" r="3" fill="var(--color-amber)" />}
    </svg>
  );
}
