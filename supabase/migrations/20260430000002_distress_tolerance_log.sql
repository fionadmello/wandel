create table distress_tolerance_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  type             text not null check (type in ('sit', 'urge_surf')),
  started_at       timestamptz not null default now(),
  duration_seconds integer not null,
  body_location    text,
  survived_it_note text,
  completed        boolean not null default false,
  created_at       timestamptz not null default now()
);

alter table distress_tolerance_log enable row level security;

create policy "users can manage their own distress tolerance log"
  on distress_tolerance_log for all
  using (user_id = auth.uid());
