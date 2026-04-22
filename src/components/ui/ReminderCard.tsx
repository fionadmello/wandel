interface ReminderCardProps {
  text: string;
}

export function ReminderCard({ text }: ReminderCardProps) {
  return (
    <div className="bg-card border-l-[2.5px] border-l-violet rounded-[16px] py-[18px] px-5 shadow-reminder">
      <p className="font-serif italic text-[16px] text-plum leading-[1.7] m-0">
        {text}
      </p>
    </div>
  );
}
