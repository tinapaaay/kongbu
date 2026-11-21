-- Append-only progress. Clients can insert and read their own rows, never update/delete.
begin;
create table public.learner_quizzes (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null check (length(id) between 1 and 512),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and payload ? 'id' and payload->>'id' = id),
  received_at timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);
create table public.learner_attempts (like public.learner_quizzes including all);
alter table public.learner_attempts add foreign key (user_id) references auth.users(id) on delete cascade;
create table public.learner_visits (like public.learner_quizzes including all);
alter table public.learner_visits add foreign key (user_id) references auth.users(id) on delete cascade;

-- Restrict INSERT columns so a client cannot forge the server receipt timestamp.
revoke all on public.learner_quizzes, public.learner_attempts, public.learner_visits from anon, authenticated;
grant select on public.learner_quizzes, public.learner_attempts, public.learner_visits to authenticated;
grant insert (user_id, id, payload) on public.learner_quizzes, public.learner_attempts, public.learner_visits to authenticated;

alter table public.learner_quizzes enable row level security;
alter table public.learner_attempts enable row level security;
alter table public.learner_visits enable row level security;
create policy own_quizzes_read on public.learner_quizzes for select to authenticated using ((select auth.uid()) = user_id);
create policy own_quizzes_insert on public.learner_quizzes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_attempts_read on public.learner_attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy own_attempts_insert on public.learner_attempts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_visits_read on public.learner_visits for select to authenticated using ((select auth.uid()) = user_id);
create policy own_visits_insert on public.learner_visits for insert to authenticated with check ((select auth.uid()) = user_id);
commit;
