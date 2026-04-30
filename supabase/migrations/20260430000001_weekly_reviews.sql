create table weekly_reviews (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users on delete cascade,
  week_ending            date not null,
  engine_response        text,
  quality_added          text,
  coaching_notes         text,
  self_rated_consistency integer check (self_rated_consistency between 1 and 5),
  created_at             timestamptz not null default now(),
  unique (user_id, week_ending)
);

alter table weekly_reviews enable row level security;

create policy "users can manage their own weekly reviews"
  on weekly_reviews for all
  using (user_id = auth.uid());

create table weekly_review_habits (
  id               uuid primary key default gen_random_uuid(),
  review_id        uuid not null references weekly_reviews on delete cascade,
  habit_id         uuid not null,
  what_done        text,
  what_got_in_way  text,
  adjustment       text,
  created_at       timestamptz not null default now()
);

alter table weekly_review_habits enable row level security;

create policy "users can manage their own weekly review habits"
  on weekly_review_habits for all
  using (
    exists (
      select 1 from weekly_reviews
      where weekly_reviews.id = weekly_review_habits.review_id
        and weekly_reviews.user_id = auth.uid()
    )
  );
