create or replace function public.list_vocabulary_notebook(
  p_level text default null,
  p_status text default null,
  p_search text default null,
  p_limit integer default 50,
  p_offset integer default 0
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
  total_count bigint
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
      coalesce(vp.status, 'new') as status
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
    count(*) over() as total_count
  from filtered
  order by filtered.word asc, filtered.id asc
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;

grant execute on function public.list_vocabulary_notebook(text, text, text, integer, integer)
to authenticated;

