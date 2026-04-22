import { X } from "lucide-react";

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}

export function Chip({ label, selected = false, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1 min-h-[34px] px-3 py-[6px] rounded-[20px] border border-[0.5px] font-sans text-[11px] whitespace-nowrap cursor-pointer transition-all duration-100 ${
        selected
          ? "bg-amber border-amber text-canvas font-medium"
          : "bg-canvas border-border text-plum font-normal"
      }`}
    >
      {label}
      {selected && <X size={11} strokeWidth={2.5} />}
    </button>
  );
}
