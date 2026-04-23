-- extend status to include 'scheduled' for habits created but not yet started
alter table habits drop constraint if exists habits_status_check;
alter table habits add constraint habits_status_check
  check (status in ('active', 'scheduled', 'paused', 'deactivated'));
