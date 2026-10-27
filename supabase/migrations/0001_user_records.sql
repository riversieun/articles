-- crumbit 사용자 기록 (v0.4 중간 범위: 익명 세션 + 구글 로그인 + 기록 저장)
-- 아티클 본문은 아직 data/ 파일에 있어서 article_id / sentence_id 는 외래키 없이 문자열로만 둔다.
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run. 설정 순서는 docs/supabase-설정.md.

-- 익명 로그인 사용자도 role 은 authenticated 이다. 모든 표는 "내 행만" 읽고 쓰게 막는다.

create table public.user_settings (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  show_ko    boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.highlights (
  user_id     uuid not null references auth.users (id) on delete cascade,
  sentence_id text not null,
  article_id  text not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, sentence_id)
);
create index highlights_article_idx on public.highlights (user_id, article_id);

-- 코멘트(문장에 남김)와 내 생각(글 전체)을 한 표에 둔다. sentence_id 가 빈 문자열이면 "내 생각".
create table public.notes (
  user_id     uuid not null references auth.users (id) on delete cascade,
  id          text not null,
  article_id  text not null,
  sentence_id text not null default '',
  body        text not null check (char_length(body) between 1 and 5000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (user_id, id)
);
create index notes_article_idx on public.notes (user_id, article_id);

create table public.saved_articles (
  user_id    uuid not null references auth.users (id) on delete cascade,
  article_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

-- 피드백은 쓰기만 가능. 운영자는 대시보드(Table Editor)에서 읽는다. 사용자 삭제 후에도 의견은 남긴다.
create table public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  kind       text not null check (kind in ('만족한 점', '개선할 점', '기능 요청', '오류 제보', '기타')),
  body       text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

-- 수정 시각 자동 갱신 (notes)
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger notes_touch before update on public.notes
  for each row execute function public.touch_updated_at();

-- RLS: 켜고, 내 행만 허용
alter table public.user_settings  enable row level security;
alter table public.highlights     enable row level security;
alter table public.notes          enable row level security;
alter table public.saved_articles enable row level security;
alter table public.feedback       enable row level security;

create policy "own rows" on public.user_settings  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows" on public.highlights     for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows" on public.notes          for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows" on public.saved_articles for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "insert own feedback" on public.feedback for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- 로그인하지 않은(anon 키만 쓰는) 요청은 아무 표도 못 건드린다.
revoke all on public.user_settings, public.highlights, public.notes, public.saved_articles, public.feedback from anon;

-- 계정 삭제: 본인 계정만 지운다. 기록 표는 on delete cascade 로 함께 지워진다.
create function public.delete_my_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
