create table pending_protocols (
  user_id      uuid primary key references auth.users on delete cascade,
  protocol_id  text not null check (protocol_id in ('engine_slip', 'engine_drift', 'habit_drift')),
  habit_id     uuid,
  track_type   text not null check (track_type in ('engine', 'break', 'build')),
  track_name   text not null,
  drift_days   integer,
  current_step integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table pending_protocols enable row level security;

create policy "users can manage their own pending protocol"
  on pending_protocols for all
  using (user_id = auth.uid());
