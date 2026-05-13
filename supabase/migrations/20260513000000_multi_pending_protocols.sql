-- Allow one pending protocol per habit per user (was one per user)

-- Drop the user_id-only primary key
alter table pending_protocols drop constraint pending_protocols_pkey;

-- Add computed track_key: habit_id (as text) for habits, protocol_id for engine protocols
alter table pending_protocols
  add column track_key text not null generated always as (
    coalesce(habit_id::text, protocol_id)
  ) stored;

-- New composite primary key
alter table pending_protocols add primary key (user_id, track_key);
