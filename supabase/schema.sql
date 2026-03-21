-- ===== 동치미학교 DB 스키마 (dc_ 접두사로 깍두기와 분리) =====

-- 프로필
create table if not exists dc_profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  phone text,
  birth_year integer,
  profile_image_url text,
  gemini_api_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dc_profiles enable row level security;
create policy "dc_profiles_select" on dc_profiles for select using (auth.uid() = id);
create policy "dc_profiles_update" on dc_profiles for update using (auth.uid() = id);
create policy "dc_profiles_insert" on dc_profiles for insert with check (auth.uid() = id);

-- 회원가입 시 자동 프로필 생성
create or replace function handle_dc_new_user()
returns trigger as $$
begin
  insert into dc_profiles (id, name, email, phone, birth_year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'birth_year')::integer
  );
  return new;
end;
$$ language plpgsql security definer;

-- 기존 깍두기 트리거와 충돌 방지: 트리거명을 dc_ 접두사로
drop trigger if exists on_dc_auth_user_created on auth.users;
create trigger on_dc_auth_user_created
  after insert on auth.users
  for each row execute function handle_dc_new_user();

-- 강좌 진도
create table if not exists dc_course_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade not null,
  course_id text not null,
  completed_lessons text[] not null default '{}',
  current_lesson_id text,
  started_at timestamptz not null default now(),
  last_accessed_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

alter table dc_course_progress enable row level security;
create policy "dc_course_progress_all" on dc_course_progress for all using (auth.uid() = user_id);

-- 수업 진도
create table if not exists dc_lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade not null,
  lesson_id text not null,
  course_id text not null,
  completed boolean not null default false,
  score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table dc_lesson_progress enable row level security;
create policy "dc_lesson_progress_all" on dc_lesson_progress for all using (auth.uid() = user_id);

-- 연습 기록
create table if not exists dc_practice_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade not null,
  practice_id text not null,
  practice_type text not null,
  result jsonb default '{}',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table dc_practice_logs enable row level security;
create policy "dc_practice_logs_all" on dc_practice_logs for all using (auth.uid() = user_id);

-- 활동 로그
create table if not exists dc_activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade not null,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table dc_activity_logs enable row level security;
create policy "dc_activity_logs_select" on dc_activity_logs for select using (auth.uid() = user_id);
create policy "dc_activity_logs_insert" on dc_activity_logs for insert with check (auth.uid() = user_id);

-- AI 대화 기록
create table if not exists dc_ai_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade not null,
  lesson_id text,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dc_ai_conversations enable row level security;
create policy "dc_ai_conversations_all" on dc_ai_conversations for all using (auth.uid() = user_id);

-- 오늘의 기분 기록
create table if not exists dc_mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dc_profiles(id) on delete cascade,
  mood_id text not null,
  created_at timestamptz not null default now()
);

alter table dc_mood_logs enable row level security;
create policy "dc_mood_logs_all" on dc_mood_logs for all using (auth.uid() = user_id);

-- 인덱스
create index if not exists idx_dc_course_progress_user on dc_course_progress(user_id);
create index if not exists idx_dc_lesson_progress_user on dc_lesson_progress(user_id);
create index if not exists idx_dc_practice_logs_user on dc_practice_logs(user_id);
create index if not exists idx_dc_activity_logs_user on dc_activity_logs(user_id, created_at desc);
create index if not exists idx_dc_ai_conversations_user on dc_ai_conversations(user_id);
create index if not exists idx_dc_mood_logs_user on dc_mood_logs(user_id, created_at desc);
