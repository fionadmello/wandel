-- take_up_space_log: journaling entries for the Take Up Space panel (Panel 4, Engine screen)
-- mode/choice_outcome/panel_tag/status are plain text (project-wide pattern, no PG enum types)
-- tag_ids/tag_names are parallel arrays — soft references, no FK on tag_ids
-- teaching = null means Q6 not yet reached; teaching = '' means Q6 explicitly skipped (app-level sentinel)
create table take_up_space_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  date             date not null,
  mode             text not null default 'in_the_moment',
  situation        text,
  action           text,
  cost             text,
  need             text,
  choice_text      text,
  teaching         text,
  tag_ids          uuid[] not null default '{}',
  tag_names        text[] not null default '{}',
  choice_outcome   text,
  panel_tag        text,
  status           text not null default 'draft',
  created_at       timestamptz not null default now(),
  completed_at     timestamptz
);

alter table take_up_space_log enable row level security;

create policy "users can manage their own take up space log"
  on take_up_space_log for all
  using (user_id = auth.uid());

create index take_up_space_log_user_date   on take_up_space_log (user_id, date);
create index take_up_space_log_user_status on take_up_space_log (user_id, status);

-- take_up_space_tags: user tag collection, mirrors practice_collection exactly
create table take_up_space_tags (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  is_default boolean not null default false,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table take_up_space_tags enable row level security;

create policy "users can manage their own take up space tags"
  on take_up_space_tags for all
  using (user_id = auth.uid());

create index take_up_space_tags_user_id on take_up_space_tags (user_id);
