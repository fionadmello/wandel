alter table build_observations drop constraint build_observations_mark_type_check;

alter table build_observations add constraint build_observations_mark_type_check
  check (mark_type in ('full', 'dot', 'half'));
