-- crumbit 첫 방문 안내(코치마크 등)를 봤는지 기록 (redesign v2)
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run. 0001_user_records.sql 을 먼저 실행해야 한다.
-- 이 파일을 실행하기 전에는 앱이 서버의 거절을 건너뛰고 넘어간다(이 기기에서만 "봤다"로 기억한다).

-- 한 사용자가 안내 하나를 봤으면 한 줄. guide_key 는 안내 이름이다(지금은 'article-coach' 하나).
-- 새 안내가 생기면 칸을 늘리지 않고 guide_key 만 새로 쓴다.
create table public.onboarding_seen (
  user_id    uuid not null references auth.users (id) on delete cascade,
  guide_key  text not null,
  seen_at    timestamptz not null default now(),
  primary key (user_id, guide_key)
);
comment on table public.onboarding_seen is '사용자가 첫 방문 안내(코치마크 등)를 본 기록. 안내 하나당 한 줄.';
comment on column public.onboarding_seen.guide_key is '안내 이름. 예: article-coach(아티클 하단 바 안내)';
comment on column public.onboarding_seen.seen_at is '처음 본 시각';

-- RLS: 내 행만 읽고 쓴다.
alter table public.onboarding_seen enable row level security;

create policy "own rows" on public.onboarding_seen for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.onboarding_seen from anon;
