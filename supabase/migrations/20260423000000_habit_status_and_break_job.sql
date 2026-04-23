-- replace is_active with explicit status enum on habits
alter table habits
  add column status text not null default 'active'
    check (status in ('active', 'paused', 'deactivated')),
  add column paused_at timestamptz,
  drop column is_active;

-- add job field to break_observations
alter table break_observations
  add column job text;
