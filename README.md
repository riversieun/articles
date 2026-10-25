# articles — 프로토타입 (PRD v0.3 기준)

해외 디자인 아티클을 **영어 + 한글 병기**로 읽고, 표현을 저장하고, 내 생각을 아카이브로 쌓는 모바일 웹입니다.
기획은 [`docs/PRD.md`](docs/PRD.md)(v0.3, 2026-10-23), 디자인 규칙은 [`DESIGN.md`](DESIGN.md), 이벤트 정의는
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
분석 키는 `.env.local`에 넣습니다(`.env.example` 참고). 없으면 분석은 조용히 꺼집니다.
디자인시스템 확인 페이지는 개발 서버의 `/design-system`에서 볼 수 있고 배포 환경에서는 열리지 않습니다.

## 구현된 것 (PRD v0.3)

| PRD | 화면/동작 |
|---|---|
| F-01, F-02 | 탐색: 주제 필터 칩(전체·디자인 프로세스·협업·UX 원칙·디자인 시스템), 앱 바와 칩은 스크롤해도 상단 고정 (URL `?topic=`로 유지) |
| F-03, F-04, F-08, F-09 | 상세: 주제 뱃지, 출처·발행일, "원문 읽기" 버튼(상단 1곳), 원문 요약 카드, 영어(18px)+한글(14px) 병기, 문단 사이 소제목 |
| F-10~F-12 | "번역 켜기" 토글(글별) + 프로필 "번역 항상 켜기"(기본값), localStorage 유지 |
| F-20, F-21 | 주요 표현 라임 하이라이트 + 툴팁(선택된 표현은 진한 라임) |
| F-30~F-34 | 문장 팝오버(하이라이트/해제·코멘트), 코멘트 말풍선(수정·삭제), 모든 삭제 확인 다이얼로그. **로그인 없이 가능** |
| F-40, F-41 | 상단 읽기 프로그레스 바. 90%에서 완독 이벤트만 기록(화면 UI 없음) |
| F-50~F-52 | 본문 아래 "눈여겨볼 표현" + 저장 → 아카이브 "표현" 필터 |
| F-60~F-62 | 본문 끝 "내 생각"(날짜 포함) + 입력, 아카이브 필터 5개(하이라이트·코멘트·내 생각·아티클·표현) |
| F-07 | 글 저장(책갈피) → 아카이브 "아티클". 저장 해제해도 그 화면에서는 카드가 남음 |
| F-70~F-72 | 구글 로그인(**목업**), 표현 3개 저장 / 첫 코멘트 시 1회 백업 제안, 앱 바 프로필 아이콘으로 로그인 시트 |
| F-74~F-76 | 프로필: 구글 프로필 사진(목업), 번역 항상 켜기, 피드백(유형 5개), 로그아웃, 계정 삭제 |

## 프로토타입의 한계 (실제 서비스와 다른 점)

- 콘텐츠는 `data/raw.ts`에 직접 입력합니다. 지금은 진짜 아티클 1개(`r1`, Figma 블로그)만 있고, **번역·요약·표현은 AI 초안이라 운영자 검수가 필요**합니다. 문단은 문장 쌍, 소제목은 `{ h: [영어, 한글] }`로 적고, 영어 제목은 화면에서 Title Case로 바뀝니다.
- **기록은 브라우저 localStorage**에 저장됩니다 (`lib/store.tsx`). 실제로는 Supabase 익명 세션 + RLS입니다.
- **"Google로 계속하기"는 플래그만 바꾸는 목업**이며 실제 인증을 하지 않습니다. 프로필 사진도 자리표시 이미지(`public/mock-profile.svg`)입니다.
- 계정 삭제는 이 브라우저의 기록만 지웁니다. 피드백은 이 브라우저에만 보관됩니다.
- 영상(YouTube) 임베드는 하지 않습니다(PRD v0.3).
- 어드민, AI 번역 파이프라인, SEO 메타 고도화는 포함하지 않았습니다.

## 구조

```
app/
  layout.tsx            전역 레이아웃(폭 430px 한 컬럼)·폰트·스토어
  (tabs)/               탭 영역: 탐색(page.tsx), archive, expressions(→ archive로 이동)
  contents/[id]/        상세 (서버 컴포넌트가 params 처리, Reader 가 클라이언트)
  mypage/               프로필
  design-system/        디자인시스템 확인 페이지 (개발 전용)
components/             Reader, Feed, ArticleRow, AppBar, TabBar, Overlays(시트·토스트),
                        CommentBubble, ConfirmDeleteDialog, ToggleSwitch, ProfileAvatar …
components/ui/          shadcn 컴포넌트 (button, badge, dialog, textarea …)
lib/content.ts          RAW → 문장/표현 파싱, 주제·출처 이름
lib/store.tsx           하이라이트·코멘트·저장·로그인 상태 (localStorage)
lib/analytics.ts        Mixpanel·Amplitude 전송
lib/utils.ts            클래스 병합(cn) — 디자인 토큰 이름 등록
data/raw.ts             아티클 데이터 (문단·소제목·표현)
docs/                   PRD, 이벤트 문서
DESIGN.md               디자인시스템 원본 (theme.css는 여기서 내보낸 참고 사본)
```

## 배포 전 점검

Vercel은 GitHub 연결로 배포됩니다(브랜치 푸시 → Preview, `main` → Production).
**배포 전에 아래를 확인하세요.**

1. `npm run build` 가 통과하는지 (타입·빌드 오류 확인)
2. **린트와 자동 테스트**: 아직 `lint`, `test` 스크립트가 없습니다. M1에서 추가할 항목이며, 그 전까지는 빌드와 화면 확인이 전부입니다.
3. 공개되는 글의 번역·요약·표현이 운영자 검수를 마쳤는지, 발췌 분량과 출처 표기가 맞는지
4. Vercel 환경변수(`NEXT_PUBLIC_MIXPANEL_TOKEN`, `NEXT_PUBLIC_AMPLITUDE_API_KEY`) 등록 여부 — `.env.local`은 저장소에 올라가지 않습니다.
5. 디자인을 바꿨다면 `DESIGN.md`, `docs/PRD.md`, `docs/analytics-events.md`도 같이 고쳤는지

## 다음 단계

[`docs/PRD.md` §11](docs/PRD.md) 참고: ① 진짜 아티클 1~2개를 `data/raw.ts`로 검증 → ② Supabase 연결(사용자 기록·로그인, 콘텐츠 이전) → ③ 어드민 → ④ PC 반응형 확장.
