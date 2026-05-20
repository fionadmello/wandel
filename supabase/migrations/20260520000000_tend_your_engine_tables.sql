-- practice_collection: user's personal library of body-first practices
create table practice_collection (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  description text not null,
  is_default  boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table practice_collection enable row level security;

create policy "users can manage their own practices"
  on practice_collection for all
  using (user_id = auth.uid());

-- daily_intentions: one intentional hard task per user per day
-- composite PK: no separate id column, upsert targets (user_id, date)
create table daily_intentions (
  user_id    uuid not null references auth.users on delete cascade,
  date       date not null,
  hard_task  text,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table daily_intentions enable row level security;

create policy "users can manage their own daily intentions"
  on daily_intentions for all
  using (user_id = auth.uid());

-- hard_things_log: running log of hard things done
-- no uniqueness on (user_id, date) — multiple entries per day expected
create table hard_things_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  date             date not null,
  timestamp        timestamptz not null default now(),
  what             text not null,
  before           integer not null check (before between 1 and 10),
  during           integer not null check (during between 1 and 10),
  after            integer not null check (after between 1 and 10),
  note             text,
  linked_intention boolean not null default false
);

alter table hard_things_log enable row level security;

create policy "users can manage their own hard things"
  on hard_things_log for all
  using (user_id = auth.uid());

-- self_love_log: one practice per entry, each a discrete timestamped moment
-- practice_id has NO FK constraint — soft reference preserves log entries if practice is deleted
create table self_love_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  date        date not null,
  timestamp   timestamptz not null default now(),
  practice    text not null,
  practice_id uuid not null,
  felt        integer not null check (felt between 1 and 10),
  note        text
);

alter table self_love_log enable row level security;

create policy "users can manage their own self love log"
  on self_love_log for all
  using (user_id = auth.uid());

-- self_worth_evidence: permanent evidence entries, never deleted from UI
create table self_worth_evidence (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  date            date not null,
  timestamp       timestamptz not null default now(),
  title           text not null,
  situation       text not null,
  what_i_did_well text not null,
  tags            text[] not null default '{}',
  archived        boolean not null default false
);

alter table self_worth_evidence enable row level security;

create policy "users can manage their own evidence"
  on self_worth_evidence for all
  using (user_id = auth.uid());

-- indexes for history screen month queries (SELECT date WHERE user_id AND date in range)
create index hard_things_log_user_date     on hard_things_log (user_id, date);
create index self_love_log_user_date       on self_love_log (user_id, date);
create index self_worth_evidence_user_date on self_worth_evidence (user_id, date);

-- index for practice collection user lookup
create index practice_collection_user_id on practice_collection (user_id);
