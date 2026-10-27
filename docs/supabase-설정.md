# Supabase 설정 가이드

코드는 연결돼 있고, **Supabase 프로젝트를 만들어 키를 넣어야** 동작한다. 키가 없으면 앱은 예전처럼 localStorage만 쓰는 프로토타입 모드로 동작하고 로그인은 가짜다.

## 1. 프로젝트 만들기
1. https://supabase.com 에서 프로젝트 생성 (운영과 테스트를 나누려면 프로젝트 2개)
2. 리전은 사용자 위치와 가까운 곳(서울 `ap-northeast-2` 권장)

## 2. 표 만들기
- 대시보드 → **SQL Editor** → `supabase/migrations/0001_user_records.sql` 내용을 붙여넣고 **Run**
- 만들어지는 것: `user_settings`, `highlights`, `notes`(코멘트+내 생각), `saved_articles`, `feedback`, 함수 `delete_my_account()`, 그리고 모든 표의 RLS(내 행만 접근)
- 확인: Table Editor에서 5개 표 모두 RLS가 켜져 있는지

## 3. 로그인 켜기
1. **Authentication → Sign In / Providers**
   - **Allow anonymous sign-ins** 켜기
   - **Allow manual linking** 켜기 (익명 사용자에 구글 계정을 연결하려면 필요)
   - **Google** 켜기 → Client ID / Secret 입력
2. Google 쪽 (Google Cloud Console → API 및 서비스 → 사용자 인증 정보 → OAuth 클라이언트 ID, 웹 애플리케이션)
   - 승인된 리디렉션 URI: Supabase가 Google 설정 화면에 보여 주는 콜백 주소(`https://<프로젝트>.supabase.co/auth/v1/callback`)
   - 동의 화면 범위는 이메일·프로필만
3. **Authentication → URL Configuration**
   - Site URL: 운영 주소 (예: `https://<도메인>`)
   - Redirect URLs: `http://localhost:3000/**`, Vercel Preview 주소 패턴(`https://*-<팀>.vercel.app/**`), 운영 주소 `/**`

## 4. 키 넣기
Project Settings → API 에서 두 값을 복사해 `.env.local`(로컬)과 Vercel Environment Variables(배포)에 넣는다.

```
NEXT_PUBLIC_SUPABASE_URL=https://<프로젝트>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public 키>
```
- anon 키는 공개돼도 되는 키다. 접근은 RLS가 막는다. **service_role 키는 절대 넣지 않는다.**
- 개발 서버(`npm run dev`)는 환경변수를 바꾸면 다시 시작해야 한다.

## 4-1. 구글 로그인 화면 켜고 끄기
`NEXT_PUBLIC_LOGIN_ENABLED`가 `false`이면 프로필의 구글 로그인 버튼과 "기록 백업" 시트가 숨겨진다(로그인 없이 쓰는 버전). 비우거나 다른 값이면 보인다. 기록은 숨겨도 익명 세션으로 서버에 저장된다.
- 운영(Production)에만 `false`를 넣고, Preview에는 넣지 않으면 "운영 = 로그인 없음, Preview = 로그인 있음"이 된다.
- 값은 빌드할 때 박히므로 바꾼 뒤에는 다시 배포해야 한다.

## 5. 확인할 것 (실기기)
- [x] 코멘트 하나 남기기 → Table Editor `notes`에 행이 생기고, `Authentication → Users`에 Anonymous 사용자 1명
- [ ] 아무것도 안 하고 방문만 → 사용자가 늘지 않음
- [x] 프로필에서 Google로 로그인 → 같은 user_id에 구글 계정이 연결되고 기록이 그대로 보임
- [x] 다른 브라우저에서 같은 구글 계정으로 로그인 → 기록이 보임
- [x] 이미 쓰던 구글 계정을 다른 기기의 게스트 기록과 합치기 (identity_already_exists 경로. **코드는 있으나 실제 호출 전이라 가장 먼저 확인**)
- [x] 로그아웃 → 이 기기 기록이 비워지고 다시 로그인하면 돌아옴
- [ ] 계정 삭제 → Users와 모든 표에서 행이 사라짐
- [ ] 비행기 모드에서 하이라이트 → 켜면 서버에 반영
- [ ] **인스타그램·카카오톡 앱 안 브라우저에서 로그인 버튼** → 안내 토스트가 뜨는지 (구글은 앱 안 브라우저 로그인을 막는다)
- [ ] 아이폰 Safari, 안드로이드 크롬

체크한 항목은 2026-10-27 localhost(일반 창·시크릿 창)에서 확인함. 나머지(방문만 할 때 사용자 미생성, 계정 삭제, 오프라인, 앱 안 브라우저, 실기기)는 아직.

## 알려진 한계
- 익명 세션의 사용자 ID도 브라우저 저장소(localStorage)에 있다. 저장소가 지워지면 새 익명 사용자가 되고 이전 기록은 접근할 수 없다 → 그래서 **구글 로그인(백업)** 이 유실을 막는 수단이다. 서버가 설정하는 쿠키로 세션을 두는 방식(`@supabase/ssr` + 미들웨어)은 이후 검토.
- 기록을 한 번에 받는 한도는 표당 1,000행(PostgREST 기본값). 한 사용자가 넘길 일은 당분간 없으나 늘면 페이지로 나눠 받아야 한다.
- 이미 쓴 코멘트 id는 기기에서 만든 문자열이라, 같은 계정의 다른 기기에서 우연히 겹칠 가능성은 매우 낮지만 0은 아니다.
- 방치된 익명 계정 정리 주기는 PRD §12.2의 남은 확인 4.
- 로그아웃하면 이 기기의 기록을 지운다. 못 보낸 변경이 있으면 2초까지 기다려 먼저 보내지만, 그 사이에도 못 보냈다면(오프라인) 함께 사라진다.
