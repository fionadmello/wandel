-- allow multiple sub-types per habit per day
alter table build_observations drop constraint if exists build_observations_habit_id_date_key;

-- one log per habit per day when no sub-type
create unique index build_observations_no_subtype_unique
  on build_observations (habit_id, date)
  where sub_type is null;

-- one log per habit, sub-type, and day
create unique index build_observations_with_subtype_unique
  on build_observations (habit_id, sub_type, date)
  where sub_type is not null;
