import { INPUT_CLASSES } from "@/constants/inputClasses";

interface TextInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email" | "password";
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  multiline = false,
  rows = 3,
  type = "text",
}: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={INPUT_CLASSES}
      />
    );
  }

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={INPUT_CLASSES}
    />
  );
}
