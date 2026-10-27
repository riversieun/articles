# crumbit — 프로토타입 (PRD v0.4 기준)

해외 디자인 아티클을 **영어 + 한글 병기**로 읽으며 인사이트를 얻고, 내 생각을 아카이브로 쌓는 모바일 웹입니다.
기획은 [`docs/PRD.md`](docs/PRD.md)(v0.4.1, 2026-10-27), 디자인 규칙은 [`DESIGN.md`](DESIGN.md), 이벤트 정의는
[`docs/analytics-events.md`](docs/analytics-events.md)를 봅니다.
**Next.js(App Router) + Tailwind CSS v4 + shadcn/ui(Base UI)** 로 만들었습니다.

> 이 README는 프로젝트 루트(`articles/`)에 있어야 합니다. GitHub가 저장소 첫 화면에 보여 주는 위치이기 때문입니다.
> AI 코딩 도우미와 개발할 때 지켜야 할 규칙은 [`CLAUDE.md`](CLAUDE.md)에 있습니다. 여기에는 중복해서 적지 않습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

폭 430px 가운데 한 컬럼으로 보입니다. 모바일 폭(390px 전후)이나 개발자 도구의 모바일 뷰로 보세요.
분석·Supabase 키는 `.env.local`에 넣습니다(`.env.example` 참고). 분석 키가 없으면 분석은 조용히 꺼지고, **Supabase 키가 없으면 localStorage만 쓰는 프로토타입 모드**(가짜 로그인)로 동작합니다. 프로젝트 설정은 [`docs/supabase-설정.md`](docs/supabase-설정.md).
디자인시스템 확인 페이지는 개발 서버의 `/design-system`에서 볼 수 있고 배포 환경에서는 열리지 않습니다.

## 구현된 것 (PRD v0.4)

| PRD | 화면/동작 |
|---|---|
| F-01, F-02 | 탐색: 주제 필터 칩(전체·디자인 프로세스·협업·UX 원칙·디자인 시스템), 앱 바와 칩은 스크롤해도 상단 고정 (URL `?topic=`로 유지) |
| F-03, F-04, F-08, F-09, F-0B | 상세: 주제 뱃지, 출처·발행일, "원문 읽기" 버튼(상단 1곳), 원문 요약 카드, 영어(18px)+한글(14px) 병기, 문단 사이 소제목, 건너뛴 자리의 "- 중략 -" |
| F-10~F-12 | "번역 켜기" 토글(글별) + 프로필 "번역 항상 켜기"(기본값), localStorage 유지 |
| F-30~F-34 | 문장 팝오버(하이라이트/해제·코멘트), 코멘트 말풍선(수정·삭제), 모든 삭제 확인 다이얼로그. **로그인 없이 가능** |
| F-40, F-41 | 상단 읽기 프로그레스 바. 90%에서 완독 이벤트만 기록(화면 UI 없음) |
| F-60~F-62 | 본문 끝 "내 생각"(날짜 포함) + 입력, 아카이브 필터 4개(하이라이트·코멘트·내 생각·아티클) |
| F-07 | 글 저장(책갈피) → 아카이브 "아티클". 저장 해제해도 그 화면에서는 카드가 남음 |
| F-70~F-72 | 구글 로그인(Supabase 연결, 키가 없으면 목업), 기록이 남는 첫 행동(코멘트·하이라이트·저장·내 생각) 직후 1회 백업 제안, 앱 바 프로필 아이콘으로 로그인 시트 |
| F-74~F-77 | 프로필: 구글 프로필 사진(목업), 번역 항상 켜기, 피드백(유형 5개), 로그아웃, 계정 삭제. **비로그인도 프로필을 열 수 있고** "Google로 로그인하기" 버튼과 아래 안내, 번역·피드백이 보임 |

## 프로토타입의 한계 (실제 서비스와 다른 점)

- 콘텐츠는 `data/raw.ts`에 직접 입력합니다. 지금은 진짜 아티클 1개(`r1`, Figma 블로그)만 있고, **번역·요약은 AI 초안이라 운영자 검수가 필요**합니다. 문단은 문장 쌍, 소제목은 `{ h: [영어, 한글] }`, 원문에서 건너뛴 자리는 `{ gap: true }`("- 중략 -" 표시)로 적고, 영어 제목은 화면에서 Title Case로 바뀝니다.
- **기록은 먼저 브라우저 localStorage에 저장**하고(`lib/store.tsx`), Supabase 키가 있으면 같은 변경을 서버(익명 세션 → 구글 로그인, RLS)에도 보냅니다(`lib/remote.ts`, 표 정의는 `supabase/migrations/`). 아티클 본문은 아직 `data/` 파일입니다.
- **구글 로그인 버튼("Google로 로그인하기", 시트의 "Google로 계속하기")은 플래그만 바꾸는 목업**이며 실제 인증을 하지 않습니다. 프로필 사진도 자리표시 이미지(`public/mock-profile.svg`)입니다.
- 계정 삭제는 이 브라우저의 기록만 지웁니다. 피드백은 이 브라우저에만 보관됩니다.
- 영상(YouTube) 임베드는 하지 않습니다(PRD v0.3).
- 어드민, AI 번역 파이프라인, SEO 메타 고도화는 포함하지 않았습니다.

## 구조

```
app/
  layout.tsx            전역 레이아웃(폭 430px 한 컬럼)·폰트·스토어
  (tabs)/               탭 영역: 탐색(page.tsx), archive, expressions(옛 주소 → archive로 이동)
  contents/[id]/        상세 (서버 컴포넌트가 params 처리, Reader 가 클라이언트)
  mypage/               프로필
  design-system/        디자인시스템 확인 페이지 (개발 전용)
components/             Reader, Feed, ArticleRow, AppBar, TabBar, Overlays(시트·토스트),
                        CommentBubble, ConfirmDeleteDialog, ToggleSwitch, ProfileAvatar …
components/ui/          shadcn 컴포넌트 (button, badge, dialog, textarea …)
lib/content.ts          RAW → 문장 파싱, 주제·출처 이름
lib/store.tsx           하이라이트·코멘트·저장·로그인 상태 (localStorage + Supabase 동기화)
lib/remote.ts          서버 전송(편지함)·받아오기·구글 로그인
supabase/migrations/   DB 표·RLS SQL
lib/analytics.ts        Mixpanel·Amplitude 전송
lib/utils.ts            클래스 병합(cn) — 디자인 토큰 이름 등록
data/raw.ts             아티클 데이터 (문단·소제목)
docs/                   PRD, 이벤트 문서
DESIGN.md               디자인시스템 원본 (theme.css는 여기서 내보낸 참고 사본)
```

## 배포 전 점검

Vercel은 GitHub 연결로 배포됩니다(브랜치 푸시 → Preview, `main` → Production).
**배포 전에 아래를 확인하세요.**

1. `npm run build` 가 통과하는지 (타입·빌드 오류 확인)
2. **린트와 자동 테스트**: 아직 `lint`, `test` 스크립트가 없습니다. M1에서 추가할 항목이며, 그 전까지는 빌드와 화면 확인이 전부입니다.
3. 공개되는 글의 번역·요약이 운영자 검수를 마쳤는지, 발췌 분량과 출처 표기가 맞는지
4. Vercel 환경변수(`NEXT_PUBLIC_MIXPANEL_TOKEN`, `NEXT_PUBLIC_AMPLITUDE_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 등록 여부 — `.env.local`은 저장소에 올라가지 않습니다.
5. 디자인을 바꿨다면 `DESIGN.md`, `docs/PRD.md`, `docs/analytics-events.md`도 같이 고쳤는지

## 다음 단계

[`docs/PRD.md` §11](docs/PRD.md) 참고: ① 진짜 아티클 1~2개를 `data/raw.ts`로 검증 → ② Supabase 연결: 사용자 기록·로그인(M1a, 코드 완료) → 콘텐츠 이전 → ③ 어드민 → ④ PC 반응형 확장.
