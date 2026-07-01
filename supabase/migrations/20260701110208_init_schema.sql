-- English Study: content + progress schema

create table courses (
  id text primary key,
  title text not null,
  level text not null check (level in ('Beginner', 'Elementary', 'Intermediate')),
  scene text not null,
  description text not null default '',
  duration_days integer not null default 7 check (duration_days > 0),
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_days (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references courses(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 7),
  title text not null,
  objective text not null default '',
  sort_order integer not null default 0,
  unique (course_id, day_number)
);

create table grammar_items (
  id text primary key,
  title text not null,
  summary text not null,
  pattern text not null default '',
  level text not null check (level in ('Beginner', 'Elementary', 'Intermediate')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vocabulary_items (
  id text primary key,
  word text not null,
  meaning_ja text not null,
  part_of_speech text not null default '',
  example_en text not null default '',
  example_ja text not null default '',
  level text not null check (level in ('Beginner', 'Elementary', 'Intermediate')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table example_sentences (
  id uuid primary key default gen_random_uuid(),
  course_day_id uuid not null references course_days(id) on delete cascade,
  sentence_en text not null,
  sentence_ja text not null,
  sort_order integer not null default 0
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  course_day_id uuid not null references course_days(id) on delete cascade,
  type text not null check (type in ('translate', 'fill_blank', 'choice')),
  prompt_ja text not null,
  answer_en text not null,
  choices jsonb,
  sort_order integer not null default 0
);

create table course_day_grammar (
  course_day_id uuid not null references course_days(id) on delete cascade,
  grammar_id text not null references grammar_items(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (course_day_id, grammar_id)
);

create table course_day_vocabulary (
  course_day_id uuid not null references course_days(id) on delete cascade,
  vocabulary_id text not null references vocabulary_items(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (course_day_id, vocabulary_id)
);

create table course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references courses(id) on delete cascade,
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references courses(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 7),
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_id, day_number)
);

create table vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id text not null references vocabulary_items(id) on delete cascade,
  status text not null check (status in ('new', 'learning', 'learned')),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table grammar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grammar_id text not null references grammar_items(id) on delete cascade,
  status text not null check (status in ('new', 'learning', 'learned')),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, grammar_id)
);

create index course_days_course_id_idx on course_days (course_id);
create index example_sentences_course_day_id_idx on example_sentences (course_day_id);
create index exercises_course_day_id_idx on exercises (course_day_id);
create index course_day_grammar_grammar_id_idx on course_day_grammar (grammar_id);
create index course_day_vocabulary_vocabulary_id_idx on course_day_vocabulary (vocabulary_id);
create index day_progress_user_course_idx on day_progress (user_id, course_id);
create index vocabulary_progress_user_idx on vocabulary_progress (user_id);
create index grammar_progress_user_idx on grammar_progress (user_id);

-- Row Level Security

alter table courses enable row level security;
alter table course_days enable row level security;
alter table grammar_items enable row level security;
alter table vocabulary_items enable row level security;
alter table example_sentences enable row level security;
alter table exercises enable row level security;
alter table course_day_grammar enable row level security;
alter table course_day_vocabulary enable row level security;

alter table course_progress enable row level security;
alter table day_progress enable row level security;
alter table vocabulary_progress enable row level security;
alter table grammar_progress enable row level security;

-- Content tables: authenticated users can read only.

create policy "Authenticated users can read published courses"
on courses for select
to authenticated
using (is_published = true);

create policy "Authenticated users can read course_days"
on course_days for select
to authenticated
using (true);

create policy "Authenticated users can read grammar_items"
on grammar_items for select
to authenticated
using (true);

create policy "Authenticated users can read vocabulary_items"
on vocabulary_items for select
to authenticated
using (true);

create policy "Authenticated users can read example_sentences"
on example_sentences for select
to authenticated
using (true);

create policy "Authenticated users can read exercises"
on exercises for select
to authenticated
using (true);

create policy "Authenticated users can read course_day_grammar"
on course_day_grammar for select
to authenticated
using (true);

create policy "Authenticated users can read course_day_vocabulary"
on course_day_vocabulary for select
to authenticated
using (true);

-- Progress tables: users can read/write only their own rows.

create policy "Users can read own course_progress"
on course_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own course_progress"
on course_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own course_progress"
on course_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own course_progress"
on course_progress for delete
using (auth.uid() = user_id);

create policy "Users can read own day_progress"
on day_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own day_progress"
on day_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own day_progress"
on day_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own day_progress"
on day_progress for delete
using (auth.uid() = user_id);

create policy "Users can read own vocabulary_progress"
on vocabulary_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own vocabulary_progress"
on vocabulary_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own vocabulary_progress"
on vocabulary_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own vocabulary_progress"
on vocabulary_progress for delete
using (auth.uid() = user_id);

create policy "Users can read own grammar_progress"
on grammar_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own grammar_progress"
on grammar_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own grammar_progress"
on grammar_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own grammar_progress"
on grammar_progress for delete
using (auth.uid() = user_id);
