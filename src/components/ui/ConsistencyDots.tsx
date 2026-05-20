interface ConsistencyDotsProps {
  rating: number;
}

export function ConsistencyDots({ rating }: ConsistencyDotsProps) {
  return (
    <div className="flex gap-1 items-center">
      <span
        className={`w-2 h-2 rounded-full ${rating >= 1 ? "bg-teal" : "bg-border"}`}
      />
      <span
        className={`w-2 h-2 rounded-full ${rating >= 2 ? "bg-teal" : "bg-border"}`}
      />
      <span
        className={`w-2 h-2 rounded-full ${rating >= 3 ? "bg-teal" : "bg-border"}`}
      />
      <span
        className={`w-2 h-2 rounded-full ${rating >= 4 ? "bg-teal" : "bg-border"}`}
      />
      <span
        className={`w-2 h-2 rounded-full ${rating >= 5 ? "bg-teal" : "bg-border"}`}
      />
    </div>
  );
}
