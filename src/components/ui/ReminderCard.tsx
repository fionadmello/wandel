interface ReminderCardProps {
  text: string;
}

export function ReminderCard({ text }: ReminderCardProps) {
  return <div>{text}</div>;
}
