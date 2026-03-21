-- ===== 동치미 데이터베이스 스키마 =====

-- 프로필
create table if not exists profiles (
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

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 회원가입 시 자동 프로필 생성 트리거
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, phone, birth_year)
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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 강좌 진도
create table if not exists course_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  course_id text not null,
  completed_lessons text[] not null default '{}',
  current_lesson_id text,
  started_at timestamptz not null default now(),
  last_accessed_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

alter table course_progress enable row level security;
create policy "Users can manage own progress" on course_progress for all using (auth.uid() = user_id);

-- 수업 진도 (개별 수업)
create table if not exists lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id text not null,
  course_id text not null,
  completed boolean not null default false,
  score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table lesson_progress enable row level security;
create policy "Users can manage own lesson progress" on lesson_progress for all using (auth.uid() = user_id);

-- 연습 기록
create table if not exists practice_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  practice_id text not null,
  practice_type text not null,
  result jsonb default '{}',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table practice_logs enable row level security;
create policy "Users can manage own practice logs" on practice_logs for all using (auth.uid() = user_id);

-- 활동 로그
create table if not exists activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table activity_logs enable row level security;
create policy "Users can view own logs" on activity_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on activity_logs for insert with check (auth.uid() = user_id);

-- AI 대화 기록
create table if not exists ai_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id text,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ai_conversations enable row level security;
create policy "Users can manage own conversations" on ai_conversations for all using (auth.uid() = user_id);

-- 인덱스
create index if not exists idx_course_progress_user on course_progress(user_id);
create index if not exists idx_lesson_progress_user on lesson_progress(user_id);
create index if not exists idx_practice_logs_user on practice_logs(user_id);
create index if not exists idx_activity_logs_user on activity_logs(user_id, created_at desc);
create index if not exists idx_ai_conversations_user on ai_conversations(user_id);
