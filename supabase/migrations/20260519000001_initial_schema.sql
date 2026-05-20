-- ================================================================
-- Certifications
-- ================================================================
create table certifications (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  body                  text not null,
  description           text,
  question_count        int not null default 0,
  exam_duration_minutes int not null default 180,
  passing_score         int not null default 72,
  available             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- ================================================================
-- User profiles (extends auth.users)
-- ================================================================
create table user_profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text,
  avatar_url        text,
  role              text not null default 'user' check (role in ('user', 'admin')),
  subscription_tier text not null default 'starter' check (subscription_tier in ('starter', 'ready', 'workforce')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into user_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ================================================================
-- User certification enrollments
-- ================================================================
create table user_certifications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references user_profiles(id) on delete cascade,
  certification_id   uuid not null references certifications(id),
  exam_date          date,
  created_at         timestamptz not null default now(),
  unique(user_id, certification_id)
);

-- ================================================================
-- Questions
-- ================================================================
create table questions (
  id               uuid primary key default gen_random_uuid(),
  certification_id uuid not null references certifications(id),
  category         text not null,
  subcategory      text,
  body             text not null,
  options          jsonb not null,   -- [{"key":"A","text":"..."},...]
  correct_answer   text not null,    -- "A", "B", "C", or "D"
  explanation      text,
  difficulty       text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  reference        text,
  created_at       timestamptz not null default now()
);

-- ================================================================
-- Exam sessions
-- ================================================================
create table exam_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references user_profiles(id) on delete cascade,
  certification_id uuid not null references certifications(id),
  exam_type        text not null default 'practice' check (exam_type in ('practice', 'timed_simulation')),
  status           text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  score            numeric(5,2),
  total_questions  int not null,
  correct_answers  int,
  time_taken_seconds int,
  categories       text[],
  started_at       timestamptz not null default now(),
  completed_at     timestamptz
);

-- ================================================================
-- User answers
-- ================================================================
create table user_answers (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references exam_sessions(id) on delete cascade,
  question_id         uuid not null references questions(id),
  selected_answer     text not null,
  is_correct          boolean not null,
  time_spent_seconds  int,
  created_at          timestamptz not null default now()
);

-- ================================================================
-- RLS
-- ================================================================
alter table user_profiles enable row level security;
alter table user_certifications enable row level security;
alter table certifications enable row level security;
alter table questions enable row level security;
alter table exam_sessions enable row level security;
alter table user_answers enable row level security;

create policy "users_own_profile_select" on user_profiles for select using (auth.uid() = id);
create policy "users_own_profile_update" on user_profiles for update using (auth.uid() = id);
create policy "users_own_profile_insert" on user_profiles for insert with check (auth.uid() = id);

create policy "users_own_certs_select" on user_certifications for select using (auth.uid() = user_id);
create policy "users_own_certs_insert" on user_certifications for insert with check (auth.uid() = user_id);
create policy "users_own_certs_update" on user_certifications for update using (auth.uid() = user_id);

create policy "certifications_public_read" on certifications for select using (true);

create policy "questions_authenticated_read" on questions for select using (auth.role() = 'authenticated');

create policy "sessions_own_select" on exam_sessions for select using (auth.uid() = user_id);
create policy "sessions_own_insert" on exam_sessions for insert with check (auth.uid() = user_id);
create policy "sessions_own_update" on exam_sessions for update using (auth.uid() = user_id);

create policy "answers_own_select" on user_answers for select using (
  auth.uid() = (select user_id from exam_sessions where id = session_id)
);
create policy "answers_own_insert" on user_answers for insert with check (
  auth.uid() = (select user_id from exam_sessions where id = session_id)
);

-- ================================================================
-- DB Functions
-- ================================================================
create or replace function get_readiness_score(p_user_id uuid, p_certification_id uuid)
returns numeric language plpgsql security definer as $$
declare v_score numeric;
begin
  select avg(score)::numeric(5,2) into v_score
  from (
    select score from exam_sessions
    where user_id = p_user_id
      and certification_id = p_certification_id
      and status = 'completed'
    order by completed_at desc
    limit 5
  ) recent;
  return coalesce(v_score, 0);
end;
$$;

create or replace function get_category_breakdown(p_user_id uuid, p_certification_id uuid)
returns table(category text, accuracy numeric, question_count bigint) language plpgsql security definer as $$
begin
  return query
  select
    q.category,
    round(100.0 * sum(case when ua.is_correct then 1 else 0 end) / count(*), 1) as accuracy,
    count(*) as question_count
  from user_answers ua
  join questions q on q.id = ua.question_id
  join exam_sessions es on es.id = ua.session_id
  where es.user_id = p_user_id
    and es.certification_id = p_certification_id
    and es.status = 'completed'
  group by q.category
  order by accuracy asc;
end;
$$;
