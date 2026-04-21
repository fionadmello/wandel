interface TextInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
