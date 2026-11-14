-- crumbit 아티클 추천(엄지 척)과 별점 (redesign v2)
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run. 0001_user_records.sql 을 먼저 실행해야 한다.
-- 이 파일을 실행하기 전에 앱에서 누른 추천·별점은 서버로 가지 않는다(앱이 서버의 거절을 건너뛰고 넘어간다).

-- 추천: 한 사용자가 한 글에 한 번. 누르면 행이 생기고, 다시 누르면 지워진다.
create table public.article_likes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  article_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);
create index article_likes_article_idx on public.article_likes (article_id);

-- 별점: 한 사용자가 한 글에 한 번(1~5). 운영자는 대시보드(Table Editor)에서 평균·분포를 본다.
create table public.article_ratings (
  user_id    uuid not null references auth.users (id) on delete cascade,
  article_id text not null,
  rating     smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);
create index article_ratings_article_idx on public.article_ratings (article_id);

-- RLS: 내 행만 읽고 쓴다. (추천 수는 아래 집계 함수로만 다른 사람의 것까지 합쳐서 본다)
alter table public.article_likes   enable row level security;
alter table public.article_ratings enable row level security;

create policy "own rows" on public.article_likes   for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows" on public.article_ratings for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.article_likes, public.article_ratings from anon;

-- 글별 추천 수. 누가 눌렀는지는 드러나지 않고 개수만 돌려준다. 로그인 전(anon)에도 읽을 수 있다.
create function public.article_like_counts()
returns table (article_id text, likes bigint)
language sql stable security definer set search_path = '' as $$
  select l.article_id, count(*)::bigint from public.article_likes l group by l.article_id;
$$;
revoke all on function public.article_like_counts() from public;
grant execute on function public.article_like_counts() to anon, authenticated;

-- 계정 삭제(delete_my_account)는 auth.users 를 지우므로 위 두 표의 내 행도 on delete cascade 로 함께 지워진다.
