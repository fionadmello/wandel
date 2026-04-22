interface BreakIconProps {
  active: boolean;
}

export function BreakIcon({ active }: BreakIconProps) {
  const stroke = active ? "var(--color-plum)" : "var(--color-muted)";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 14a4.5 4.5 0 0 0 6.19.45l1.55-1.55a4.5 4.5 0 0 0-6.36-6.36L9.93 8" />
      <path d="M14.07 16l-1.45 1.45a4.5 4.5 0 0 1-6.36-6.36l1.55-1.55A4.5 4.5 0 0 1 14 10" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}
