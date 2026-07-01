alter table vocabulary_progress
  add column if not exists correct_count integer not null default 0 check (correct_count >= 0),
  add column if not exists incorrect_count integer not null default 0 check (incorrect_count >= 0);

create or replace function public.record_vocabulary_review(
  p_vocabulary_id text,
  p_status text,
  p_was_correct boolean
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_status not in ('new', 'learning', 'learned') then
    raise exception 'Invalid vocabulary status: %', p_status;
  end if;

  insert into vocabulary_progress (
    user_id,
    vocabulary_id,
    status,
    last_reviewed_at,
    updated_at,
    correct_count,
    incorrect_count
  )
  values (
    v_user_id,
    p_vocabulary_id,
    p_status,
    now(),
    now(),
    case when p_was_correct then 1 else 0 end,
    case when p_was_correct then 0 else 1 end
  )
  on conflict (user_id, vocabulary_id) do update set
    status = excluded.status,
    last_reviewed_at = excluded.last_reviewed_at,
    updated_at = excluded.updated_at,
    correct_count = vocabulary_progress.correct_count + excluded.correct_count,
    incorrect_count = vocabulary_progress.incorrect_count + excluded.incorrect_count;
end;
$$;

grant execute on function public.record_vocabulary_review(text, text, boolean)
to authenticated;

create or replace function public.list_vocabulary_quiz_candidates(
  p_level text default null,
  p_status text default null,
  p_search text default null,
  p_limit integer default 200
)
returns table (
  id text,
  word text,
  meaning_ja text,
  part_of_speech text,
  example_en text,
  example_ja text,
  level text,
  status text,
  correct_count integer,
  incorrect_count integer,
  failure_rate numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  with filtered as (
    select
      v.id,
      v.word,
      v.meaning_ja,
      v.part_of_speech,
      v.example_en,
      v.example_ja,
      v.level,
      coalesce(vp.status, 'new') as status,
      coalesce(vp.correct_count, 0) as correct_count,
      coalesce(vp.incorrect_count, 0) as incorrect_count,
      case
        when coalesce(vp.correct_count, 0) + coalesce(vp.incorrect_count, 0) = 0 then 0
        else coalesce(vp.incorrect_count, 0)::numeric
          / (coalesce(vp.correct_count, 0) + coalesce(vp.incorrect_count, 0))
      end as failure_rate
    from vocabulary_items v
    left join vocabulary_progress vp
      on vp.vocabulary_id = v.id
     and vp.user_id = auth.uid()
    where (p_level is null or v.level = p_level)
      and (p_status is null or coalesce(vp.status, 'new') = p_status)
      and (
        nullif(trim(coalesce(p_search, '')), '') is null
        or v.word ilike '%' || trim(p_search) || '%'
        or v.meaning_ja ilike '%' || trim(p_search) || '%'
        or v.example_en ilike '%' || trim(p_search) || '%'
      )
  )
  select
    filtered.id,
    filtered.word,
    filtered.meaning_ja,
    filtered.part_of_speech,
    filtered.example_en,
    filtered.example_ja,
    filtered.level,
    filtered.status,
    filtered.correct_count,
    filtered.incorrect_count,
    filtered.failure_rate
  from filtered
  order by
    filtered.failure_rate desc,
    filtered.incorrect_count desc,
    case filtered.status
      when 'new' then 0
      when 'learning' then 1
      else 2
    end asc,
    random()
  limit least(greatest(p_limit, 1), 200);
$$;

grant execute on function public.list_vocabulary_quiz_candidates(text, text, text, integer)
to authenticated;

