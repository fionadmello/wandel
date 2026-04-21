-- profiles
create table profiles (
  id uuid references auth.users primary key,
  why_statement text,
  reminder_index integer not null default 0,
  reminder_last_rotated date,
  setup_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can manage their own profile"
  on profiles for all
  using (id = auth.uid());

-- profile_qualities
create table profile_qualities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profile_qualities enable row level security;

create policy "users can manage their own qualities"
  on profile_qualities for all
  using (user_id = auth.uid());

-- profile_reminders
create table profile_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profile_reminders enable row level security;

create policy "users can manage their own reminders"
  on profile_reminders for all
  using (user_id = auth.uid());

-- habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  category text not null check (category in ('break', 'build')),
  name text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table habits enable row level security;

create policy "users can manage their own habits"
  on habits for all
  using (user_id = auth.uid());

-- habit_configs
create table habit_configs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits on delete cascade,
  key text not null,
  value text not null,
  sub_type text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table habit_configs enable row level security;

create policy "users can manage configs for their own habits"
  on habit_configs for all
  using (
    exists (
      select 1 from habits
      where habits.id = habit_configs.habit_id
        and habits.user_id = auth.uid()
    )
  );

-- engine_marks
create table engine_marks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  date date not null,
  timer_completed boolean not null default false,
  confirmed_at timestamptz not null,
  unique (user_id, date)
);

alter table engine_marks enable row level security;

create policy "users can manage their own engine marks"
  on engine_marks for all
  using (user_id = auth.uid());

-- break_observations
create table break_observations (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits on delete cascade,
  user_id uuid not null references auth.users,
  context text,
  urge_intensity integer check (urge_intensity between 1 and 10),
  aftermath text,
  logged_at timestamptz not null default now()
);

alter table break_observations enable row level security;

create policy "users can manage their own break observations"
  on break_observations for all
  using (user_id = auth.uid());

-- break_observation_emotions
create table break_observation_emotions (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references break_observations on delete cascade,
  value text not null,
  created_at timestamptz not null default now()
);

alter table break_observation_emotions enable row level security;

create policy "users can manage emotions for their own observations"
  on break_observation_emotions for all
  using (
    exists (
      select 1 from break_observations
      where break_observations.id = break_observation_emotions.observation_id
        and break_observations.user_id = auth.uid()
    )
  );

-- build_observations
create table build_observations (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits on delete cascade,
  user_id uuid not null references auth.users,
  date date not null,
  sub_type text,
  mark_type text not null check (mark_type in ('circle', 'dot', 'half')),
  mark_label text not null,
  note text,
  logged_at timestamptz not null default now(),
  unique (habit_id, date)
);

alter table build_observations enable row level security;

create policy "users can manage their own build observations"
  on build_observations for all
  using (user_id = auth.uid());

-- updated_at trigger for profiles
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();
