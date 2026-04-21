interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}

export function Chip({ label, selected = false, onToggle }: ChipProps) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={selected}>
      {label}
    </button>
  );
}
