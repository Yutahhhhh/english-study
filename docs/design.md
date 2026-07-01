# English Study 設計書

## 1. 全体構成

English Study は、React/Vite で作る PWA 対応の個人向け英語学習アプリ。教材コンテンツと学習進捗をSupabase Postgresに保存し、Supabase Authでログインする。

```text
Browser / PWA
  -> React App
    -> Web Speech API
    -> Supabase Client
        -> Supabase Auth
        -> Supabase Postgres
            -> Course Content
            -> User Progress
```

## 2. 主要画面

### 2.1 Login

未ログイン時に表示する。

機能:

- メール/パスワードログイン
- ログアウト後の再ログイン
- セッション復元

### 2.2 Courses

コース一覧画面。

機能:

- 全コース表示
- レベルフィルター
- シーンフィルター
- 学習中/完了状態の表示
- コース詳細への遷移

### 2.3 Course Detail

選択したコースの7日分を表示する。

機能:

- Day 1からDay 7の一覧
- 各Dayの完了状態
- 次に学ぶDayの強調表示
- Day学習画面への遷移

### 2.4 Lesson Day

1日分の学習画面。

表示セクション:

- 文法
- 単語
- 例文
- 練習問題
- 完了操作

### 2.5 Vocabulary Notebook

単語帳画面。

機能:

- 単語一覧
- レベル/シーン/ステータスで絞り込み
- 読み上げ
- ステータス変更

### 2.6 Grammar Notebook

文法帳画面。

機能:

- 文法一覧
- レベル/ステータスで絞り込み
- 例文読み上げ
- ステータス変更

## 3. ルーティング

```text
/login
/courses
/courses/:courseId
/courses/:courseId/days/:dayNumber
/vocabulary
/grammar
/settings
```

ログインが必要な画面では、Supabase のセッションがない場合 `/login` にリダイレクトする。

## 4. コンテンツモデル

教材コンテンツはSupabase Postgresで管理し、アプリ側では取得結果を以下の型として扱う。

```ts
type Level = "Beginner" | "Elementary" | "Intermediate";

type Scene =
  | "Daily Conversation"
  | "Travel"
  | "Work"
  | "Restaurant"
  | "Shopping"
  | "Self Introduction";

type Course = {
  id: string;
  title: string;
  level: Level;
  scene: Scene;
  description: string;
  days: CourseDay[];
};

type CourseDay = {
  day: number;
  title: string;
  grammarIds: string[];
  vocabularyIds: string[];
  examples: ExampleSentence[];
  exercises: Exercise[];
};

type GrammarItem = {
  id: string;
  title: string;
  summary: string;
  pattern: string;
  examples: string[];
  level: Level;
};

type VocabularyItem = {
  id: string;
  word: string;
  meaningJa: string;
  partOfSpeech: string;
  example: string;
  level: Level;
};

type ExampleSentence = {
  en: string;
  ja: string;
};

type Exercise = {
  id: string;
  type: "translate" | "fill_blank" | "choice";
  promptJa: string;
  answerEn: string;
  choices?: string[];
};
```

## 5. Supabase設計

### 5.1 保存方針

Supabase には教材コンテンツと個人の進捗を保存する。クライアントはSupabase JavaScript Clientで教材データを読み取り、ログインユーザーの進捗だけを書き込む。

理由:

- コース一覧や単語帳をDBデータとして扱える
- スマホ/PCで同じ教材と進捗を参照できる
- 後から教材を追加してもアプリの再ビルドが不要
- Supabase StudioやSQL seedで初期データを投入できる
- 自分専用なので教材編集UIはMVPでは不要

### 5.2 テーブル

#### courses

```sql
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
```

#### course_days

```sql
create table course_days (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references courses(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 7),
  title text not null,
  objective text not null default '',
  sort_order integer not null default 0,
  unique (course_id, day_number)
);
```

#### grammar_items

```sql
create table grammar_items (
  id text primary key,
  title text not null,
  summary text not null,
  pattern text not null default '',
  level text not null check (level in ('Beginner', 'Elementary', 'Intermediate')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

#### vocabulary_items

```sql
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
```

#### example_sentences

```sql
create table example_sentences (
  id uuid primary key default gen_random_uuid(),
  course_day_id uuid not null references course_days(id) on delete cascade,
  sentence_en text not null,
  sentence_ja text not null,
  sort_order integer not null default 0
);
```

#### exercises

```sql
create table exercises (
  id uuid primary key default gen_random_uuid(),
  course_day_id uuid not null references course_days(id) on delete cascade,
  type text not null check (type in ('translate', 'fill_blank', 'choice')),
  prompt_ja text not null,
  answer_en text not null,
  choices jsonb,
  sort_order integer not null default 0
);
```

#### course_day_grammar

```sql
create table course_day_grammar (
  course_day_id uuid not null references course_days(id) on delete cascade,
  grammar_id text not null references grammar_items(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (course_day_id, grammar_id)
);
```

#### course_day_vocabulary

```sql
create table course_day_vocabulary (
  course_day_id uuid not null references course_days(id) on delete cascade,
  vocabulary_id text not null references vocabulary_items(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (course_day_id, vocabulary_id)
);
```

#### course_progress

```sql
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
```

#### day_progress

```sql
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
```

#### vocabulary_progress

```sql
create table vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id text not null references vocabulary_items(id) on delete cascade,
  status text not null check (status in ('new', 'learning', 'learned')),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);
```

#### grammar_progress

```sql
create table grammar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grammar_id text not null references grammar_items(id) on delete cascade,
  status text not null check (status in ('new', 'learning', 'learned')),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, grammar_id)
);
```

### 5.3 RLSポリシー

全テーブルで Row Level Security を有効化する。教材テーブルはログインユーザーが読み取り可能、進捗テーブルはログインユーザーが自分のデータだけ操作可能にする。

```sql
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
```

教材テーブルの基本方針:

```sql
create policy "Authenticated users can read published courses"
on courses
for select
to authenticated
using (is_published = true);
```

`course_days`、`grammar_items`、`vocabulary_items`、`example_sentences`、`exercises`、`course_day_grammar`、`course_day_vocabulary` も `authenticated` に `select` を許可する。教材の insert/update/delete はクライアントには許可しない。

進捗テーブルの基本方針:

```sql
create policy "Users can read own rows"
on course_progress
for select
using (auth.uid() = user_id);

create policy "Users can insert own rows"
on course_progress
for insert
with check (auth.uid() = user_id);

create policy "Users can update own rows"
on course_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own rows"
on course_progress
for delete
using (auth.uid() = user_id);
```

同じポリシーを `day_progress`、`vocabulary_progress`、`grammar_progress` にも適用する。

### 5.4 初期データ投入

教材データは SQL seed で投入する。

想定ファイル:

```text
supabase/
  migrations/
  seed.sql
```

MVPでは管理画面を作らず、コース追加や修正はSupabase StudioまたはSQLで行う。

## 6. PWA設計

### 6.1 Manifest

`manifest.webmanifest` に以下を定義する。

- name
- short_name
- start_url
- display: standalone
- theme_color
- background_color
- icons

### 6.2 Service Worker

キャッシュ対象:

- HTML/CSS/JS
- アイコン
- 主要ルートのアプリシェル

初期方針:

- アプリシェルはキャッシュ優先
- Supabase API はネットワーク優先
- 取得済み教材はブラウザキャッシュやアプリ状態で閲覧継続できることを目指す
- 進捗保存に失敗した場合はUI上で未同期状態を表示する

MVPでは複雑なオフライン書き込みキューは作らない。必要になったら `pending_progress_events` のようなローカルキューを追加する。

## 7. 読み上げ設計

Web Speech API の `speechSynthesis` を使う。

機能:

- 英単語読み上げ
- 例文読み上げ
- 通常速度とゆっくり速度
- `en-US` を基本言語にする

想定インターフェース:

```ts
type SpeakOptions = {
  rate?: number;
  lang?: string;
};

function speak(text: string, options?: SpeakOptions): void;
function stopSpeaking(): void;
function canSpeak(): boolean;
```

ブラウザ非対応時は、読み上げボタンを無効化し、アプリ本体の学習は継続できるようにする。

## 8. 状態管理

MVPでは大きな状態管理ライブラリを必須にしない。

主な状態:

- Supabaseセッション
- コース/Day/文法/単語/例文/問題データ
- コース進捗
- Day進捗
- 単語ステータス
- 文法ステータス
- フィルター状態
- 読み上げ速度

実装候補:

- React Context
- カスタム hooks
- 必要に応じて TanStack Query

## 9. ディレクトリ案

```text
english-study/
  docs/
    requirements.md
    design.md
  english-study-app/
    src/
      app/
      components/
      features/
        auth/
        courses/
        grammar/
        vocabulary/
        speech/
        progress/
      lib/
        supabase.ts
        database.types.ts
      styles/
    supabase/
      migrations/
      seed.sql
    public/
      manifest.webmanifest
      icons/
```

## 10. 実装順序

1. Vite + React + TypeScript のアプリ作成
2. ルーティングと基本レイアウト
3. Supabaseプロジェクト作成
4. DBスキーマとRLS作成
5. 初期教材データ投入
6. Supabase Auth
7. コース一覧とコース詳細
8. Day学習画面
9. 単語帳と文法帳
10. Web Speech API の読み上げ
11. Supabase 進捗保存
12. PWA対応
13. スマホ表示調整

## 11. 将来拡張

必要になったら追加する候補:

- 音声入力
- 自作英文メモ
- 例文のお気に入り
- 復習スケジュール
- 教材編集画面
- AI添削
- Supabase Storage を使った音声保存
