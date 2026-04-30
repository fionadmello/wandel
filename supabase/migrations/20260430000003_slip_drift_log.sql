create table slip_drift_log (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users on delete cascade,
  habit_id               uuid,
  track_type             text not null check (track_type in ('engine', 'break', 'build')),
  type                   text not null check (type in ('slip', 'drift')),
  triggered_at           timestamptz not null default now(),
  cause_category         text check (cause_category in ('distress_tolerance', 'logistics', 'emotional_load')),
  job_id                 uuid references habit_configs(id),
  emotional_state_before text,
  all_or_nothing_stage   text,
  protocol_completed     boolean not null default false,
  created_at             timestamptz not null default now()
);

alter table slip_drift_log enable row level security;

create policy "users can manage their own slip drift log"
  on slip_drift_log for all
  using (user_id = auth.uid());
