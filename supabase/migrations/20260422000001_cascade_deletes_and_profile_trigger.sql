-- Add ON DELETE CASCADE to every foreign key referencing auth.users so that
-- deleting a user automatically cleans up all of their data.

alter table profiles
  drop constraint profiles_id_fkey,
  add constraint profiles_id_fkey
    foreign key (id) references auth.users on delete cascade;

alter table profile_qualities
  drop constraint profile_qualities_user_id_fkey,
  add constraint profile_qualities_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

alter table profile_reminders
  drop constraint profile_reminders_user_id_fkey,
  add constraint profile_reminders_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

alter table habits
  drop constraint habits_user_id_fkey,
  add constraint habits_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

alter table engine_marks
  drop constraint engine_marks_user_id_fkey,
  add constraint engine_marks_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

alter table break_observations
  drop constraint break_observations_user_id_fkey,
  add constraint break_observations_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

alter table build_observations
  drop constraint build_observations_user_id_fkey,
  add constraint build_observations_user_id_fkey
    foreign key (user_id) references auth.users on delete cascade;

-- Automatically create a profiles row when a new auth user is created.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, created_at)
  values (new.id, new.created_at);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
