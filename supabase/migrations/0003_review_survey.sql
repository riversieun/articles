-- crumbit 사용 후기 설문과 경품 추첨 (redesign v2)
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run. 0001, 0002 를 먼저 실행해야 한다.
--
-- 원칙 (개인정보처리방침 3항과 같아야 한다)
--  · 설문 답변(review_responses)과 경품 응모(review_prize_entries)는 다른 표에 둔다. 번호가 답변에 붙어 다니지 않게.
--  · 휴대폰 번호는 응모 표에만 있고, 이용자는 자기 번호를 다시 읽을 수 없다(읽기 정책 없음).
--  · 비당첨자 번호는 추첨 직후, 당첨자 번호는 기프티콘을 보낸 직후 지운다. (아래 "운영" 참고)

-- 설문 답변: 한 사용자가 한 번. 답변 모양은 설문이 정해진 뒤 앱이 정하므로 jsonb 로 받는다.
create table public.review_responses (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);

-- 경품 응모: 번호는 여기에만 둔다. winner 는 운영자가 추첨한 뒤 직접 표시한다.
create table public.review_prize_entries (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  phone       text not null check (phone ~ '^01[0-9]{8,9}$'),   -- 숫자만, 하이픈 없이
  consented_at timestamptz not null default now(),               -- 수집·이용 동의 시각
  winner      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- RLS: 직접 읽고 쓰는 길은 모두 막고, 아래 함수로만 넣는다. (운영자는 대시보드/SQL Editor 에서 service role 로 본다)
alter table public.review_responses     enable row level security;
alter table public.review_prize_entries enable row level security;
revoke all on public.review_responses, public.review_prize_entries from anon, authenticated;

-- 제출: 답변과 (선택) 번호를 한 번에 넣는다. 이미 제출했으면 false. 번호를 주면 동의한 것으로 본다(앱이 동의 체크 뒤에만 번호를 보낸다).
create function public.submit_review(p_answers jsonb, p_phone text default null)
returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.review_responses where user_id = uid) then return false; end if;
  insert into public.review_responses (user_id, answers) values (uid, p_answers);
  if p_phone is not null then
    insert into public.review_prize_entries (user_id, phone) values (uid, p_phone);
  end if;
  return true;
end $$;
revoke all on function public.submit_review(jsonb, text) from public;
grant execute on function public.submit_review(jsonb, text) to authenticated;

-- 운영 (SQL Editor, 번호는 이 두 줄로 지운다)
--   추첨 직후:      delete from public.review_prize_entries where not winner;
--   기프티콘 발송 직후: delete from public.review_prize_entries where winner;   -- 보낸 사람만 지우려면 user_id 조건을 붙인다
-- 계정 삭제(delete_my_account)는 auth.users 를 지우므로 두 표의 내 행도 on delete cascade 로 함께 지워진다.
