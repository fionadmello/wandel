create table standing_up_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  habit_id    uuid,
  track_type  text not null check (track_type in ('engine', 'break', 'build')),
  track_name  text not null,
  fall_date   date not null,
  return_date date not null,
  gap_days    integer not null,
  protocol    text not null check (protocol in ('slip', 'drift')),
  created_at  timestamptz not null default now()
);

alter table standing_up_log enable row level security;

create policy "users can manage their own standing up entries"
  on standing_up_log for all
  using (user_id = auth.uid());
