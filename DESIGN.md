---
version: alpha
name: crumbit
description: 영어 아티클을 읽으며 인사이트를 얻고 내 생각을 남기는 모바일 우선 리더. 흑백 중심 화면에 브랜드 초록 한 가지로만 강조한다.
colors:
  primary: "#1E1E28"
  on-primary: "#FFFFFF"
  accent: "#3FE2AA"
  accent-strong: "#008759"
  accent-tint: "#D5F7EC"
  accent-soft: "#A6EDD5"
  on-accent: "#1E1E28"
  accent-sub: "#E7E0FF"
  accent-sub-strong: "#CBBCFF"
  surface: "#FFFFFF"
  on-surface: "#1E1E28"
  surface-muted: "#F4F4F6"
  on-surface-muted: "#5E5E66"
  subtle: "#8E8E96"
  label: "#7F7F8A"
  border: "#E7E7EA"
  border-strong: "#D5D5DA"
  danger: "oklch(0.577 0.245 27.325)"
  on-danger: "#FFFFFF"
  focus-ring: "#1E1E28"
  like: "#C994FF"
  snack: "#4A4A52"
  pd-ink: "#1E1E28"
  pd-ink-muted: "#5E5E66"
  pd-ink-soft: "#313142"
  pd-ink-faint: "#8D8D99"
  pd-ink-quiet: "#77778D"
  pd-icon: "#5E5E66"
  pd-line: "#E6E6EA"
  pd-dot: "#C6C6CF"
  pd-tint: "#F9F9F9"
  pd-chip: "#F1F1F3"
  pd-star: "#B4B4B8"
  pd-glow: "#AEFFE4"
  pd-glow-mid: "#C4FBDE"
  pd-glow-soft: "#E2FAED"
  pd-note: "#F5EBFF"
typography:
  display:
    fontFamily: Pretendard Variable
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.03em
  headline:
    fontFamily: Pretendard Variable
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Pretendard Variable
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Pretendard Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  body-lg-semibold:
    fontFamily: Pretendard Variable
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.6
  body-md-semibold:
    fontFamily: Pretendard Variable
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.6
  label-md-semibold:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
  label-md:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
  label-sm:
    fontFamily: Pretendard Variable
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
  title:
    fontFamily: Pretendard Variable
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
  heading:
    fontFamily: Pretendard Variable
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
  title-md:
    fontFamily: Pretendard Variable
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
  title-sm:
    fontFamily: Pretendard Variable
    fontSize: 18px
    fontWeight: 700
    lineHeight: 26px
  note:
    fontFamily: Pretendard Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 20px
  caption:
    fontFamily: Pretendard Variable
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  panel: 12px
  xl: 14px
  card: 16px
  hero: 20px
  box: 24px
  pill: 26px
  sheet: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 80px
  page: 20px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    height: 52px
    padding: 18px
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  textarea:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 14px
  card:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.card}"
    padding: 14px
  badge:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 12px
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 24px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sheet}"
    padding: 24px
  toggle:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    height: 22px
    width: 38px
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 64px
  popover-menu:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    height: 48px
  comment-bubble:
    backgroundColor: "{colors.accent-sub-strong}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 12px
  toast:
    backgroundColor: "{colors.snack}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.panel}"
    padding: 12px 16px
---

# crumbit

## Overview

영어 아티클을 읽으며 인사이트를 얻고 내 생각을 남기는 모바일 우선 서비스다. 화면의 주인공은 항상 본문이고, UI는 읽기를 방해하지 않아야 한다. 그래서 화면 대부분은 흰 배경과 검정 글자로 정리하고, 눈에 띄어야 하는 것(핵심 행동)에만 브랜드 초록을 쓴다. 느낌은 조용하고 정돈된 편집물에 가깝고, 장식은 쓰지 않는다.

컴포넌트는 shadcn/ui(Base UI, 프리셋 `b2D2mxv2w`)로 만들며 `components/ui`에 있다. 토큰은 `app/globals.css`의 `@theme`에 정의돼 있고, 이 문서의 값은 그 파일과 같아야 한다. 값이 다르면 `globals.css`가 우선이다. `theme.css`는 이 문서에서 내보낸 참고용 사본이다(앱이 직접 읽지 않는다).

## Colors

색 이름이 아니라 역할로 부른다.

- **Primary (#1E1E28):** 글자와 기본 버튼의 검정(순검정이 아니라 남색 기운이 도는 검정, 2026-11-23 피그마 기준). 화면에서 가장 무게 있는 색이다.
- **Accent (#3FE2AA):** 브랜드 초록(redesign v2에서 예전 라임 #D9F25C 자리를 대신함). 서비스의 시그니처 강조색으로, 핵심 행동 버튼(`variant="accent"`)·저장(북마크) 켜짐·앱 바 로고의 별·프로필 이니셜 원에 쓴다(아티클 읽기 진행 바는 중성색). 위에 올리는 글자는 반드시 `on-accent`(검정)를 쓴다. CSS 토큰은 `--color-brand`(`bg-brand`, `text-brand`).
- **Accent-strong (#008759) / Accent-tint (#D5F7EC) / Accent-soft (#A6EDD5):** 초록의 보조 단계. `accent-strong`은 연한 초록 면 위의 글자(주제 뱃지, 홈 "새로 등록된 글"), `accent-tint`는 주제 뱃지 배경, `accent-soft`는 번호·인용선·불릿 같은 장식이다. CSS 토큰은 `brand-strong`·`brand-tint`·`brand-soft`.
- **Accent-sub (#E7E0FF), Accent-sub-strong (#CBBCFF):** 연보라. 초록과 겹치지 않는 보조 구분용으로만 쓴다. 사용자가 하이라이트한 문장은 `accent-sub`, 코멘트 말풍선은 `accent-sub-strong`.
- **Surface (#FFFFFF) / Surface-muted (#F4F4F6):** 페이지와 팝업은 흰색, 그 위의 카드·주제 뱃지·보조 버튼·구획 배경은 연회색.
- **On-surface-muted (#5E5E66):** 보조 설명과 메타 정보, 읽는 글자 중 한 단계 약한 것(부연설명, 한글 번역, 안내 문구).
- **Label (#7F7F8A):** 입력창 placeholder 전용. `on-surface-muted`보다 한 단계 옅어 입력한 글과 확실히 구분되고, 흰 배경 대비 3.96:1이다. 다른 읽는 글자에는 쓰지 않는다. CSS 토큰은 `--color-pd-label`(`text-pd-label`).
- **Subtle (#8E8E96):** 읽는 글자에는 쓰지 않는다(흰 배경 대비 3.25:1로 읽기 기준에 못 미침). 토글 꺼짐 배경, 로그인 전 프로필 아이콘 같은 장식에 쓴다. 예외로 **하단 탭바의 선택 안 된 탭**(아이콘과 라벨)에는 글자색으로 쓴다(대비 3.25:1). 본문의 **"- 중략 -" 구분 표시**는 한 단계 더 약한 `border-strong`을 쓴다.
- **Border (#E7E7EA) / Border-strong (#D5D5DA):** 구분선. 일반 구분은 `border`, 입력창 테두리와 카드 안의 구분선처럼 경계를 조금 더 또렷하게 할 때는 `border-strong`.
- **Danger:** 삭제 등 되돌릴 수 없는 행동과 입력 오류에만 쓴다. 배경에 깔 때는 옅게(10~20%) 깔고 글자만 진하게 쓴다.
- **Focus-ring (#1E1E28):** 키보드 포커스 표시. 지우지 않는다.
- **Like (#C994FF):** 연보라. 추천해요(엄지)가 켜졌을 때의 색이다(2026-11-23 피그마 기준, 이전에는 별점과 같은 앰버 #FFBF00). 별점에서 채워진 별은 앰버 `#FFBF00`(`--color-pd-star-on`)로 따로 둔다. 흰 배경 대비가 낮아(약 2.2:1) 아이콘에만 쓰고 글자에는 쓰지 않는다. CSS 토큰은 `--color-pd-like`(`text-pd-like`).
- **Snack (#4A4A52):** 어두운 회색. 스낵바(토스트) 배경(80% 투명도로 깔고 뒤를 흐리게 한다, Components의 Snackbar 참고)이고, 위에 올리는 글자는 `on-primary`(흰색)다. 기존 검정(`primary`)에서 한 단계 풀어 화면을 덜 누른다. CSS 토큰은 `--color-pd-snack`(`bg-pd-snack`).

**redesign v2 중성색(`pd-*`).** Paper 디자인 값을 그대로 가져온 것으로 기존 토큰과 한두 단계 차이가 난다. 기존 토큰으로 합칠지는 색 정리표를 본 뒤에 정하므로 지금은 이 이름으로 쓴다(CSS 토큰 `--color-pd-*`, 클래스 `text-pd-ink` 등).

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `pd-ink` | #1E1E28 | 본문·제목 글자, 선택된 탭, 선택된 필터 칩 배경, 읽기 진행 막대 |
| `pd-ink-muted` | #5E5E66 | 부제·날짜·영어 제목(약한 읽는 글자). 기존 `on-surface-muted`와 거의 같음 |
| `pd-ink-soft` | #313142 | 로고·홈 카드 제목·출처 이름·더보기 글자, 기록한 글의 펜 |
| `pd-ink-faint` | #8D8D99 | 출처 옆 발행일. 흰 배경 대비 약 3.3:1로 읽기 기준에 못 미치지만 피그마 결정(2026-11-23)으로 날짜에만 예외로 쓴다 |
| `pd-ink-quiet` | #77778D | (쓰지 않음) 요약 카드 라벨이던 값 |
| `pd-icon` | #5E5E66 | 글 저장 아이콘(저장 전) |
| `pd-line` | #E6E6EA | 구분선·카드 테두리. 기존 `border`와 거의 같음 |
| `pd-dot` | #C6C6CF | 출처와 날짜 사이 점, 읽기 진행 막대 트랙 |
| `pd-tint` | #F9F9F9 | 한 문장 요약 카드, 더보기 버튼, 생각 카드 안 글 링크 배경 |
| `pd-chip` | #F1F1F3 | 선택 안 된 주제 칩 배경 |
| `pd-star` | #B4B4B8 | 비어 있는 별점 별 |
| `pd-glow` / `pd-glow-mid` / `pd-glow-soft` | #AEFFE4 / #C4FBDE / #E2FAED | 홈 "새로 등록된 글" 카드 위쪽 가운데의 초록 빛(위에서 아래로 `pd-tint`로 사라짐) |
| `pd-note` | #F5EBFF | 홈 사용 후기 배너 배경(연보라) |
| `pd-label` / `pd-like` / `pd-snack` | 위 Label / Like / Snack과 같은 값 | CSS 토큰 이름 |

다크 모드 토큰은 `globals.css`에 정의돼 있지만 현재 화면에서는 사용하지 않는다.

## Typography

글꼴은 **Pretendard Variable** 하나로 한글과 영어 모두 쓴다(세리프는 쓰지 않는다). 한글은 단어 단위로 줄바꿈(`word-break: keep-all`)하고, 영어(`lang="en"`)는 일반 줄바꿈으로 되돌린다.

토큰은 크기와 줄 높이를 `text-*` 클래스가 정하고, 굵기와 자간은 `font-*`, `tracking-*`를 함께 붙인다.

| 토큰 | 크기 / 굵기 / 줄 높이 | 쓰는 곳 |
|---|---|---|
| `display` | 28 / 700 / 1.2, 자간 -0.03em | 아티클 영어 제목 |
| `headline` | 20 / 700 / 1.4, 자간 -0.02em | 앱 바 제목(crumbit·아카이브·프로필), 섹션 제목(내 생각), 다이얼로그·시트 제목, 카드 목록의 영어 제목 |
| `body-lg` | 18 / 400 / 1.6 | 본문 영어 문장 |
| `body-lg-semibold` | 18 / 600 | 빈 상태 제목 |
| `body-md` | 16 / 400 / 1.6 | 한글 제목, 원문 요약, 내 생각, 입력창, 다이얼로그 설명, 문장 코멘트 시트의 영어 문장 |
| `body-md-semibold` | 16 / 600 | 구글 로그인 버튼, 앱 안 브라우저 시트의 "링크 복사하기" 버튼(구글 로그인 버튼과 같은 52px 높이), 빈 상태 버튼 |
| `body-sm` | 14 / 400 / 1.6 | 한글 문장 번역, 안내 문구, 출처·발행일, helper text |
| `label-md` | 14 / 500 | 버튼, 코멘트 말풍선, 팝오버 메뉴 (스낵바는 같은 크기에 400 굵기) |
| `label-md-semibold` | 14 / 600 | 원문 요약 라벨, 아카이브의 원문 링크 |
| `label-sm` | 12 / 500 | 주제 뱃지, 탭바 라벨, 저장 날짜 |
| `title` | 24 / 700 / 30px | 아티클 한글 제목. 홈 "주제별 보기"는 같은 크기에 600 |
| `heading` | 22 / 700 / 28px | 아티클 섹션 제목(핵심 인사이트예요 · 원문은 이렇게 말해요 · 업무에 적용해보세요) |
| `title-md` | 20 / 600 / 26px | 글 카드·홈 카드의 한글 제목 |
| `title-sm` | 18 / 700 / 26px | 핵심 인사이트 소제목(700), 후기 배너 제목(600) |
| `note` | 15 / 400 / 20px | 후기 배너 본문, 필터 칩(줄 높이 24px, 선택되면 600) |
| `caption` | 13 / 400 / 18px | 글 카드의 출처·발행일, 생각 카드의 날짜 |

글꼴은 Pretendard Variable 하나이고, 예외 두 가지: 원문 인용(영어)은 Roboto(`font-quote`), 앱 바 로고 "crumbit"은 Plus Jakarta Sans bold(`font-logo`, 자간 -3%). 굵기는 400·500·600·700만 쓴다. 600은 위 `*-semibold` 토큰에서만 쓴다.

## Layout

모바일 우선의 한 줄 세로 흐름이다. 앱은 폭 430px의 가운데 한 컬럼이고, 더 넓은 화면에서도 같은 폭을 유지한다(PC용 레이아웃은 이후 단계). 페이지 좌우 여백은 20px(`page`)이고, 요소 간격은 4px 단위 스케일(`xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `2xl` 32 · `3xl` 80)을 따른다. 코드에서는 이름 대신 같은 값의 Tailwind 숫자 클래스(`1`·`2`·`3`·`4`·`6`·`8`·`20`)를 쓴다. 간격 이름을 CSS 토큰으로 만들면 `max-w-md`처럼 같은 이름의 Tailwind 클래스가 깨진다(실제로 다이얼로그 폭이 12px로 줄어든 적이 있다).

- **상단 고정:** 앱 바(높이 56px)와 필터 칩이 스크롤해도 위에 붙어 있다. 칩 영역 아래에는 12px의 흰 띠가 있어 카드가 그 밑으로 잘려 지나간다. 칩에서 첫 콘텐츠까지는 24px이다.
- **하단 탭바:** 화면 아래에 떠 있는 알약(탭 3개: 홈·탐색·아카이브, 기본 296×64px, 흰 배경에 `border` 1px 링 + `shadow-sm`). 탭 하나는 기본 88×48px, 아이콘 24px, 라벨 12px이다. 아래로 스크롤하면 라벨을 접고 266×56px(탭 너비 78px)로 축소하며, 위로 스크롤하거나 화면 상단으로 돌아오면 기본 상태로 복원한다. 크기 전환은 300ms의 감속 곡선을 쓰고 모션 감소 설정에서는 즉시 바뀐다.
- **구획 간격:** 아티클에서 큰 구획(본문과 내 생각) 사이는 80px(`3xl`), 다이얼로그 안 구획 사이는 24px(`xl`)이다.
- 큰 구획은 간격과 얇은 구분선(`border`)으로 나누고, 박스를 겹겹이 쌓지 않는다. 터치 대상은 높이 36px 이상을 지킨다(저장·닫기 같은 아이콘 버튼은 44px, 주요 행동 `button-accent`는 52px).

## Elevation & Depth

그림자보다 **색 면과 구분선**으로 위계를 만든다. 흰 페이지 위에 연회색(`surface-muted`) 면을 올린다. 떠 있는 요소만 그림자를 쓴다: 탭바 `shadow-sm`, 팝오버 메뉴는 큰 그림자 하나(`0 12px 28px`, 투명도 0.28), 스낵바(토스트)는 가까운 그림자와 먼 그림자 두 층(`0 2px 8px` 투명도 0.2 + `0 8px 16px -6px` 투명도 0.18)으로 가볍게 띄운다. 팝업(Dialog)과 바텀 시트는 뒷배경을 어둡게 눌러서 분리한다. 그림자를 겹쳐 쓰지 않는다. 예외는 스낵바뿐이다.

## Shapes

둥근 모서리가 기본이다. 버튼은 알약형(`full`), 필터 칩은 `md`(8px), 주제 뱃지는 `md`(8px), 카드(생각 카드·후기 배너·한 문장 요약 카드)는 `card`(16px), 홈 "새로 등록된 글" 카드는 `hero`(20px), 더보기 버튼·스낵바는 `panel`(12px), 입력창은 `xl`(14px), 다이얼로그·팝오버 메뉴·주요 행동 버튼은 `pill`(26px), 바텀 시트는 위쪽 모서리만 `sheet`(28px), 스낵바는 `panel`(12px). 한 화면에서 둥근 정도가 다른 모양을 섞을 때는 용도(행동 요소 = 알약, 담는 그릇 = 카드)로만 구분한다.

토큰에 없는 예외 두 가지: 하이라이트된 문장의 배경(3px)과 코멘트 말풍선(왼쪽 위만 4px, 나머지 14px).

## Components

shadcn 컴포넌트는 `components/ui`에, 서비스 전용 조합은 `components/`에 있다. 새로 만들기 전에 먼저 여기서 찾는다.

- **Button:** `variant` 7종(`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`, `accent`)과 `size` 4종(`xs`, `sm`, `default`, `lg`) + 아이콘 버튼. 글자는 `label-md`. `default`는 검정(`primary`), `outline`은 연한 회색 테두리, `accent`는 브랜드 초록 배경 + 검정 글자, `destructive`는 옅은 빨강 배경 + 빨강 글자다. 초록 버튼은 `bg-brand`를 직접 붙이지 말고 `variant="accent"`를 쓴다.
- **Filter chip:** 8px 모서리(`md`). 홈·탐색·아카이브가 모두 같은 값을 쓴다. 선택되면 `pd-ink` 면 + 흰 글자 600, 선택 안 되면 `pd-chip` 면 + `pd-ink-muted` 글자 400. 글자는 15px / 줄 높이 24px(`text-note leading-6`). 칩을 감싼 줄은 위 8px·아래 4px 여백(`pt-2 pb-1`)이고 가로로 스크롤되며 스크롤바는 숨긴다. 홈·탐색·아카이브가 같은 컴포넌트를 쓴다. 탐색 탭은 맨 앞에 "최신"(전체) 칩이 있다.
- **Textarea:** 흰 배경, `border-strong` 테두리, `xl` 모서리. 포커스되면 바깥 링 없이 테두리만 `primary`로 바뀐다. placeholder는 `label`(#7F7F8A). 피드백·내 생각·코멘트 입력이 모두 이것을 쓴다.
- **Topic tag(주제 표시):** 아티클 상세 머리의 주제 라벨. 모서리 8px(`md`), 안 여백 위아래 6px·좌우 10px, `accent-tint` 배경 + `accent-strong` 글자 `body-sm` 500. 누르는 요소가 아니다. (shadcn `Badge`와는 별개)
- **Card:** 연회색 면, 모서리 16px, 안 여백 14px. 하이라이트·코멘트·내 생각·요약 카드가 모두 같은 모양이다. 카드 안 구분선은 `border-strong`.
- **Dialog:** 중앙 팝업(`ConfirmDeleteDialog`, 피드백). 제목과 닫기 버튼이 같은 줄에 있고(닫기는 오른쪽, 배경 없는 X 아이콘만. 모든 다이얼로그 공통), 설명은 한 단계 약한 색, 구획 사이 24px. 삭제 확인은 "삭제할까요?" / "삭제하면 되돌릴 수 없어요." 문구로 통일하고 취소(왼쪽)·삭제(오른쪽, danger)를 한 줄에 둔다.
- **Bottom sheet:** 하단에서 올라오는 시트(로그인, 코멘트, 내 생각, 앱 안 브라우저 안내). 위쪽 모서리 `sheet`(28px), 좌우 여백 24px, 위에 손잡이(grabber)가 있고 제목은 `headline`. 모션: 아래에서 올라올 때 iOS 시트 곡선(0.32, 0.72, 0, 1) 500ms, 닫기 버튼·바깥·Esc로 닫을 때는 같은 길로 300ms 내려간다. **아래로 끌어서도 닫는다**: 누른 동안 손가락과 1:1로 따라오고(위로는 20% 고무줄), 높이의 40% 이상 끌었거나 빠르게 튕기면(0.5px/ms 이상) 놓은 속도로 마무리하며 내려가고, 아니면 제자리로 돌아온다. 뒤의 어두운 배경은 끌린 만큼 같이 옅어진다. 투명도 변화 없이 화면 아래로 그대로 내려간다(들어온 방향 = 나가는 방향).
- **Toggle:** 38×22px 알약, 손잡이 18px. 켜짐은 `primary`, 꺼짐은 `subtle`. 병기 읽기의 "번역 켜기"와 알림·설정류 스위치가 같은 컴포넌트를 쓴다. (프로필의 "번역 항상 켜기"는 v2에서 삭제)
- **Progress bar:** 아티클 상단 고정 영역 아래 2px 막대. 트랙은 구분선과 같은 연한 회색(`--color-pd-line` #E6E6EA, 2026-11-23 피그마 기준. 이전에는 `pd-dot` #C6C6CF), 읽은 만큼은 아티클 제목 글자색(`--color-pd-ink` #1E1E28). 초록은 쓰지 않는다.
- **Tab bar:** 위 Layout 참고. 선택된 탭은 `primary`, 선택 안 된 탭은 `subtle`. 아카이브 아이콘은 북마크(채움), 탐색은 나침반.
- **Snackbar(토스트):** 동작 결과를 하단에 알리는 상자. 배경 `snack`(#4A4A52)을 **80%**로 깔고 뒤를 **12px 흐리게**(+채도 120%) 하는 유리 효과, 글자 `on-primary` `label-md` **400 굵기**, 모서리 `panel`(12px), 안 여백 좌우 16px·위아래 12px, 글자 폭에 맞추되(hug) 최대 폭은 화면 좌우 24px씩을 뺀 값(390px 화면에서 342px). 두 줄 문구는 가운데 정렬. 시트가 열려 있으면 띄우지 않고 닫힌 뒤에 띄운다. 위치: 탭바가 있는 화면은 탭바 위(바닥에서 96px), 아티클 상세는 플로팅 바 위 12px, 그 밖은 바닥에서 24px. 모션: 아래에서 14px 올라오며 나타나고(320ms, ease-out) 더 빠르게 사라진다(180ms). 2.4초 뒤 사라진다. 스낵바를 띄우는 경우와 문구는 아래 표가 기준이고, 글 저장·하이라이트 켜고 끄기·내 생각 수정·아카이브 카드 수정·구글 로그인 성공에는 띄우지 않는다.
  | 상황 | 문구 |
  |---|---|
  | 내 생각 기록 | 내 생각을 남겼어요 |
  | 내 생각 삭제 | 생각을 삭제했어요 |
  | 피드백 제출 | 소중한 의견 감사합니다 |
  | 피드백 제출 실패 | 피드백을 보내지 못했어요⏎잠시 후 다시 시도해주세요! |
  | 구글 계정 연결 실패 | 구글 계정을 연결하지 못했어요⏎잠시 후 다시 시도해주세요! |
- **Login help snackbar(로그인 도움 스낵바):** 구글 로그인이 **2번 연속** 실패하면, 두 번째 실패 스낵바가 뜬 0.9초 뒤 그 **위**(8px 간격)에 "로그인 문제가 있나요? **피드백 보내기**"가 올라온다. 스낵바와 같은 모양이고 왼쪽에 문구, 오른쪽에 `label-md` 600 밑줄 CTA(간격 16px). 실패 스낵바는 위 모션대로 사라지지만 이 스낵바는 **스스로 사라지지 않고**, 빈자리로 360ms 동안 부드럽게 내려와 자리를 잡는다. 보이는 화면(경로)을 벗어나거나 CTA를 누르면 사라진다. CTA는 피드백 다이얼로그를 연다. 로그인에 성공하면 연속 실패 횟수를 0으로 되돌린다.
- **Floating bar(아티클 하단):** 추천해요(엄지) · 내 생각 기록 · 저장(북마크)이 있는 알약 바. 내려 읽으면 아래로 내려가며 숨고(준비 동작 후 94%로 작아지며 360ms) 올리거나 본문 끝에 닿으면 300ms 동안 스프링 없이 올라온다. 버튼은 누르는 동안 86%로 줄었다가 손을 떼면 스프링으로 돌아온다. 엄지는 켜지면 `like` 색으로 바뀌며 14° 기울어 6px 올라갔다 내려오고, 추천 수는 첫 추천부터 표기되며 아래에서 위로 롤링한다. 안 눌린 엄지·펜·북마크 아이콘은 `#5E5E66`(`pd-ink-muted`·`pd-icon`)이고, 기록한 글이면 펜이 채워지며 색은 `#313142`(`--color-pd-ink-soft`)다. 엄지가 켜지면 연보라(`like`)다. 저장은 `accent` 초록으로 채워지며 저장 스낵바는 띄우지 않는다. 모션 줄이기 설정에서는 이동·기울임 없이 투명도·색 전환만 남는다.
- **Popover menu:** 문장 위, 코멘트 말풍선 위에 뜨는 검정 알약 메뉴. 아이콘은 선(stroke) 형태이고 각 버튼 높이 48px.
- **Excerpt gap marker:** 원문에서 건너뛴 자리에 문단 사이 가운데로 "- 중략 -"을 `label-sm`(12px) 이탤릭, `border-strong` 색으로 두고, 위아래 여백은 기본 문단 간격보다 8px씩 줄인다. 이어지는 문단 사이에는 두지 않고 여백만 쓴다.
- **Empty state:** 카드 배경 없이 가운데 정렬. 제목 `body-lg-semibold`(18px/600), 필요한 경우에만 제목 아래 8px에 안내 `body-sm`(`on-surface-muted`), 그 아래 20px에 초록 "글 읽으러 가기" 버튼. 칩 아래 빈 영역의 가로·세로 가운데에 둔다.
- **Comment bubble:** 문장 아래에 붙는 연보라 말풍선. 본문에서는 누르면 "수정·삭제" 팝오버가 열리고, 아카이브 카드에서는 모양만 쓴다.
- **Save / bookmark icon:** 저장 전에는 `on-surface-muted` 테두리, 저장 후에는 `on-surface` 채움. 탐색 카드와 아카이브는 22px, 본문 상단 바는 24px.
- **Profile avatar:** 로그인 전에는 회색 원 + 실루엣 아이콘, 로그인 후에는 구글 계정 프로필 사진(없으면 초록 이니셜 원). 앱 바에서 32px, 프로필 페이지에서 80px.

- **App bar(탭 화면 위):** 높이 48px, 왼쪽 "crumbit" 로고(`headline` 크기, Plus Jakarta Sans bold) 오른쪽 위에 초록 별(12px), 오른쪽 프로필 아이콘(로그인 전 회색 실루엣 / 후 구글 사진, 32px, 누르는 영역 44px). 스크롤해도 위에 붙는다. 아티클 상세는 이 바 대신 뒤로가기만 있는 48px 바를 쓰고, 내려 읽으면 위로 들어가며 읽기 진행 막대(2px)만 맨 위에 남는다.
- **Home hero card(새로 등록된 글):** 홈 위쪽 가로 캐러셀. 카드 한 장 폭(좌우 여백 24px)으로 넘기고 다음 카드가 12px쯤 보인다. 모서리 `hero`(20px), 높이 220px 이상, 안 여백 24px(카드 안 간격 24px), 위쪽 가운데에서 번지는 초록 빛(`pd-glow` 3단계 → `pd-tint`). 위에 "새로 등록된 글"(`accent-strong`, 가운데), 아래에 `title-md` 한글 제목·`body-md` 영어 제목(`pd-ink-muted`)·출처·저장 책갈피. 카드 아래 점 표시(8px, 현재 `pd-ink-muted`, 나머지 `border-strong`).
- **Article card(글 카드, 홈·탐색·아카이브 저장):** 한글 제목 `title-md` 600, 아래 영어 제목 `body-md` `pd-ink-muted`, 그 아래 출처·발행일과 저장 책갈피. 카드 사이는 `pd-line` 구분선(좌우 24px 들여쓰기). 출처 줄은 별 아이콘 + 출처, 점(3px, `pd-dot`), 날짜이고 카드는 `caption`(13px), 상세는 `body-sm`(14px).
- **Save button:** 책갈피 20px, 누르는 영역 44px. 저장 전 `pd-icon` 윤곽, 저장 후 `accent`(초록) 채움.
- **Article detail(아티클 상세, 요약형):** 머리(주제 라벨 → `title` 한글 제목 → 영어 제목 → 출처·발행일) → "한 문장 요약" 카드(`pd-tint`, 모서리 `card`(16px), 안 여백 20/24px, 제목 `body-sm` 600 + 아이콘) → "핵심 인사이트예요"(번호 `accent-soft` 01·02, `title-sm` 소제목, `body-md` 설명) → "원문은 이렇게 말해요"(왼쪽 2px `accent-soft` 선, 영어는 Roboto 18px, 번역 `body-sm` `pd-ink-soft`) → "업무에 적용해보세요"(반짝임 아이콘 `accent-soft` + 문장) → 별점 카드 → 푸터 버튼 두 개(피드백 보내기 · 원문 보기, 높이 46px, 모서리 `md`, `pd-line` 테두리). 섹션 제목은 `heading`, 구획 안 간격 20px, 좌우 24px. 문장 병기 읽기(하이라이트·코멘트)는 `/contents/[id]/read`에 있다.
- **Rating card(별점 카드):** 아티클 본문 아래 "이 아티클 얼마나 도움됐나요?" + 별 5개. 별을 고르면 별이 스프링으로 차오르고(700ms) 문구가 롤링으로 "의견 감사합니다"로 바뀌며 초록 체크가 그려지고(1.6초), 카드가 접히며(340ms) 사라진다. 이미 평가한 글에서는 처음부터 보이지 않는다. 빈 별은 `pd-star`, 채운 별은 `like`(#FFBF00).
- **Review banner(홈 사용 후기 배너):** `pd-note`(연보라) 면 + 보라 말풍선 일러스트(#B97FF3·#DBBBFC, 높이 62px), 모서리 `card`(16px), 안 여백 좌우 24px·위아래 20px. 제목 `title-sm` 600, 본문 `note` `pd-ink-muted`. 환경변수 `NEXT_PUBLIC_REVIEW_URL`이 있을 때만 링크.
- **Coach mark(아티클 첫 방문 안내):** 플로팅 바를 설명하는 말풍선 3단계 투어. 막은 `#1E1E28` 40%에 바만 구멍을 내고, 설명하는 버튼 뒤에 `accent-tint` 알약(56×44)을 깔고 나머지 버튼은 투명도 35%로 흐리게 한다. 말풍선은 `surface` 카드(300px, 모서리 `box` 24px, 안 여백 20px), 제목 `title-sm` 700, 제목과 본문 사이 12px, 본문 `body-md`(16px) `on-surface-muted`, 아래에 단계 숫자 "1/3"(`body-sm`)과 `accent` 알약 버튼("다음", 마지막은 "알겠어요", 글자 `on-accent` 14px 600). 버튼의 눈에 보이는 높이는 40px이고 눌리는 영역(투명)은 44px이다. 건너뛰기는 없다. 다음 단계로 넘어갈 때는 말풍선이 360ms로 미끄러지고 글자는 바로 바뀐다. "알겠어요"를 누르면 말풍선이 아래로 10px 내려가며 94%로 작아지고 투명해지고(200ms, ease-out), 막·알약도 함께 걷힌 뒤(220ms) 닫힌다. 모션 줄이기 설정에서는 이동·사라짐 전환 없이 바로 닫힌다.
- **Thought card(아카이브 내 생각):** 테두리 `pd-line` 1px, 모서리 `card`, 안 여백 20px. 위에 날짜(`caption`)와 수정·삭제 아이콘(20px, 누르는 영역 44px), 본문 `body-md`, 아래에 글 링크 박스(`pd-tint`, 모서리 `panel`, 한글·영어 제목 + 오른쪽 화살표).

컴포넌트 확인 페이지는 개발 서버의 `/design-system`에서 볼 수 있다. 배포 환경에서는 열리지 않는다.

## Do's and Don'ts

- Do: 강조색(`accent`)과 `primary` 버튼은 한 화면에 하나만 둔다. 둘 다 있으면 눌러야 할 곳이 흐려진다.
- Don't: 초록 위에 흰 글자를 올리지 않는다. 항상 `on-accent`(검정)를 쓴다.
- Do: 모든 색은 역할 토큰(`primary`, `danger`, `surface-muted`)으로 부른다. 화면에서 `#hex`나 임의 색을 직접 쓰지 않는다.
- Don't: `danger`는 삭제·오류 외에는 쓰지 않는다. 강조나 장식으로 빨강을 쓰지 않는다.
- Don't: `subtle`을 읽는 글자에 쓰지 않는다. 읽는 글자의 가장 약한 단계는 `on-surface-muted`다(예외: 입력창 placeholder는 `label`, 선택 안 된 탭바 라벨은 `subtle`, "- 중략 -" 구분 표시는 `border-strong`).
- Do: 글자는 `text-display`·`text-headline`·`text-title*`·`text-heading`·`text-body-*`·`text-label-*`·`text-note`·`text-caption` 토큰으로 정한다. `text-[13.5px]` 같은 임의 크기를 쓰지 않는다.
- Do: 새 UI가 필요하면 `components/ui`에서 먼저 찾고, 없을 때만 `npx shadcn@latest add`로 추가한다. 같은 역할의 컴포넌트를 따로 만들지 않는다.
- Do: 토큰 이름(글자 크기, 자간, 간격, 모서리)을 새로 만들면 `lib/utils.ts`의 클래스 병합 설정에도 같이 등록한다(자세한 이유는 `CLAUDE.md`).
