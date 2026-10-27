---
version: alpha
name: crumbit
description: 영어 아티클을 읽으며 인사이트를 얻고 내 생각을 남기는 모바일 우선 리더. 흑백 중심 화면에 라임 한 가지로만 강조한다.
colors:
  primary: "#111111"
  on-primary: "#FFFFFF"
  accent: "#D9F25C"
  on-accent: "#111111"
  accent-sub: "#E7E0FF"
  accent-sub-strong: "#CBBCFF"
  surface: "#FFFFFF"
  on-surface: "#111111"
  surface-muted: "#F4F4F6"
  on-surface-muted: "#5F5F66"
  subtle: "#8E8E96"
  border: "#E7E7EA"
  border-strong: "#D5D5DA"
  danger: "oklch(0.577 0.245 27.325)"
  on-danger: "#FFFFFF"
  focus-ring: "#111111"
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
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  card: 16px
  pill: 26px
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
    rounded: "{rounded.pill}"
    padding: 20px
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
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 18px
---

# crumbit

## Overview

영어 아티클을 읽으며 인사이트를 얻고 내 생각을 남기는 모바일 우선 서비스다. 화면의 주인공은 항상 본문이고, UI는 읽기를 방해하지 않아야 한다. 그래서 화면 대부분은 흰 배경과 검정 글자로 정리하고, 눈에 띄어야 하는 것(핵심 행동)에만 라임색을 쓴다. 느낌은 조용하고 정돈된 편집물에 가깝고, 장식은 쓰지 않는다.

컴포넌트는 shadcn/ui(Base UI, 프리셋 `b2D2mxv2w`)로 만들며 `components/ui`에 있다. 토큰은 `app/globals.css`의 `@theme`에 정의돼 있고, 이 문서의 값은 그 파일과 같아야 한다. 값이 다르면 `globals.css`가 우선이다. `theme.css`는 이 문서에서 내보낸 참고용 사본이다(앱이 직접 읽지 않는다).

## Colors

색 이름이 아니라 역할로 부른다.

- **Primary (#111111):** 글자와 기본 버튼의 검정. 화면에서 가장 무게 있는 색이다.
- **Accent (#D9F25C):** 라임. 서비스의 시그니처 강조색으로, 핵심 행동 버튼과 읽기 진행 바에만 쓴다. 위에 올리는 글자는 반드시 `on-accent`(검정)를 쓴다.
- **Accent-sub (#E7E0FF), Accent-sub-strong (#CBBCFF):** 연보라. 라임과 겹치지 않는 보조 구분용으로만 쓴다. 사용자가 하이라이트한 문장은 `accent-sub`, 코멘트 말풍선은 `accent-sub-strong`.
- **Surface (#FFFFFF) / Surface-muted (#F4F4F6):** 페이지와 팝업은 흰색, 그 위의 카드·주제 뱃지·보조 버튼·구획 배경은 연회색.
- **On-surface-muted (#5F5F66):** 보조 설명과 메타 정보, 읽는 글자 중 한 단계 약한 것(부연설명, 한글 번역, 안내 문구, 입력창 placeholder).
- **Subtle (#8E8E96):** 읽는 글자에는 쓰지 않는다(흰 배경 대비 3.25:1로 읽기 기준에 못 미침). 토글 꺼짐 배경, 로그인 전 프로필 아이콘 같은 장식에 쓴다. 예외로 **하단 탭바의 선택 안 된 탭**(아이콘과 라벨)에는 글자색으로 쓴다(대비 3.25:1). 본문의 **"- 중략 -" 구분 표시**는 한 단계 더 약한 `border-strong`을 쓴다.
- **Border (#E7E7EA) / Border-strong (#D5D5DA):** 구분선. 일반 구분은 `border`, 입력창 테두리와 카드 안의 구분선처럼 경계를 조금 더 또렷하게 할 때는 `border-strong`.
- **Danger:** 삭제 등 되돌릴 수 없는 행동과 입력 오류에만 쓴다. 배경에 깔 때는 옅게(10~20%) 깔고 글자만 진하게 쓴다.
- **Focus-ring (#111111):** 키보드 포커스 표시. 지우지 않는다.

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
| `body-md-semibold` | 16 / 600 | 구글 로그인 버튼, 빈 상태 버튼 |
| `body-sm` | 14 / 400 / 1.6 | 한글 문장 번역, 안내 문구, 출처·발행일, helper text |
| `label-md` | 14 / 500 | 버튼, 필터 칩, 코멘트 말풍선, 팝오버 메뉴, 토스트 |
| `label-md-semibold` | 14 / 600 | 원문 요약 라벨, 아카이브의 원문 링크 |
| `label-sm` | 12 / 500 | 주제 뱃지, 탭바 라벨, 저장 날짜 |

굵기는 400·500·600·700만 쓴다. 600은 위 `*-semibold` 토큰에서만 쓴다.

## Layout

모바일 우선의 한 줄 세로 흐름이다. 앱은 폭 430px의 가운데 한 컬럼이고, 더 넓은 화면에서도 같은 폭을 유지한다(PC용 레이아웃은 이후 단계). 페이지 좌우 여백은 20px(`page`)이고, 요소 간격은 4px 단위 스케일(`xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `2xl` 32 · `3xl` 80)을 따른다. 코드에서는 이름 대신 같은 값의 Tailwind 숫자 클래스(`1`·`2`·`3`·`4`·`6`·`8`·`20`)를 쓴다. 간격 이름을 CSS 토큰으로 만들면 `max-w-md`처럼 같은 이름의 Tailwind 클래스가 깨진다(실제로 다이얼로그 폭이 12px로 줄어든 적이 있다).

- **상단 고정:** 앱 바(높이 56px)와 필터 칩이 스크롤해도 위에 붙어 있다. 칩 영역 아래에는 12px의 흰 띠가 있어 카드가 그 밑으로 잘려 지나간다. 칩에서 첫 콘텐츠까지는 24px이다.
- **하단 탭바:** 화면 아래에 떠 있는 알약(200×64px). 탭 하나는 88×48px, 아이콘 24px, 라벨 12px.
- **구획 간격:** 아티클에서 큰 구획(본문과 내 생각) 사이는 80px(`3xl`), 다이얼로그 안 구획 사이는 24px(`xl`)이다.
- 큰 구획은 간격과 얇은 구분선(`border`)으로 나누고, 박스를 겹겹이 쌓지 않는다. 터치 대상은 높이 36px 이상을 지킨다(저장·닫기 같은 아이콘 버튼은 44px, 주요 행동 `button-accent`는 52px).

## Elevation & Depth

그림자보다 **색 면과 구분선**으로 위계를 만든다. 흰 페이지 위에 연회색(`surface-muted`) 면을 올린다. 떠 있는 요소만 그림자를 쓴다: 탭바 `shadow-sm`, 팝오버 메뉴·토스트는 큰 그림자 하나(`0 12px 28px`, 투명도 0.28). 팝업(Dialog)과 바텀 시트는 뒷배경을 어둡게 눌러서 분리한다. 그림자를 겹쳐 쓰지 않는다.

## Shapes

둥근 모서리가 기본이다. 버튼·필터 칩은 알약형(`full`), 카드는 `card`(16px), 입력창은 `xl`(14px), 주제 뱃지는 `md`(8px), 다이얼로그·바텀 시트·팝오버 메뉴·토스트·주요 행동 버튼은 `pill`(26px). 한 화면에서 둥근 정도가 다른 모양을 섞을 때는 용도(행동 요소 = 알약, 담는 그릇 = 카드)로만 구분한다.

토큰에 없는 예외 두 가지: 하이라이트된 문장의 배경(3px)과 코멘트 말풍선(왼쪽 위만 4px, 나머지 14px).

## Components

shadcn 컴포넌트는 `components/ui`에, 서비스 전용 조합은 `components/`에 있다. 새로 만들기 전에 먼저 여기서 찾는다.

- **Button:** `variant` 7종(`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`, `accent`)과 `size` 4종(`xs`, `sm`, `default`, `lg`) + 아이콘 버튼. 글자는 `label-md`. `default`는 검정(`primary`), `outline`은 연한 회색 테두리, `accent`는 라임 배경 + 검정 글자, `destructive`는 옅은 빨강 배경 + 빨강 글자다. 라임 버튼은 `bg-lime`을 직접 붙이지 말고 `variant="accent"`를 쓴다.
- **Filter chip:** `Button`의 `default`(선택됨, 검정)와 `secondary`(선택 안 됨, 연회색). 가로로 스크롤되고 스크롤바는 숨긴다.
- **Textarea:** 흰 배경, `border-strong` 테두리, `xl` 모서리. 포커스되면 바깥 링 없이 테두리만 `primary`로 바뀐다. placeholder는 `on-surface-muted`. 피드백·내 생각·코멘트 입력이 모두 이것을 쓴다.
- **Badge:** 높이 28px, 좌우 12px, 모서리 8px, 연회색 배경의 주제 표시. 누르는 요소가 아니다.
- **Card:** 연회색 면, 모서리 16px, 안 여백 14px. 하이라이트·코멘트·내 생각·요약 카드가 모두 같은 모양이다. 카드 안 구분선은 `border-strong`.
- **Dialog:** 중앙 팝업(`ConfirmDeleteDialog`, 피드백). 제목과 닫기 버튼이 같은 줄에 있고(닫기는 오른쪽), 설명은 한 단계 약한 색, 구획 사이 24px. 삭제 확인은 "삭제할까요?" / "삭제하면 되돌릴 수 없어요." 문구로 통일하고 취소(왼쪽)·삭제(오른쪽, danger)를 한 줄에 둔다.
- **Bottom sheet:** 하단에서 올라오는 시트(로그인, 코멘트). 위쪽 모서리 26px, 제목은 `headline`.
- **Toggle:** 38×22px 알약, 손잡이 18px. 켜짐은 `primary`, 꺼짐은 `subtle`. 본문의 "번역 켜기"와 프로필의 "번역 항상 켜기"가 같은 컴포넌트를 쓴다.
- **Progress bar:** 아티클 상단 고정 영역 아래 3px 막대. 트랙은 `border-strong`(읽은 부분의 라임과 대비를 주려고 한 단계 진하게), 읽은 만큼은 `accent`(라임).
- **Tab bar:** 위 Layout 참고. 선택된 탭은 `primary`, 선택 안 된 탭은 `subtle`. 아카이브 아이콘은 북마크(채움), 탐색은 나침반.
- **Popover menu:** 문장 위, 코멘트 말풍선 위에 뜨는 검정 알약 메뉴. 아이콘은 선(stroke) 형태이고 각 버튼 높이 48px.
- **Excerpt gap marker:** 원문에서 건너뛴 자리에 문단 사이 가운데로 "- 중략 -"을 `label-sm`(12px) 이탤릭, `border-strong` 색으로 두고, 위아래 여백은 기본 문단 간격보다 8px씩 줄인다. 이어지는 문단 사이에는 두지 않고 여백만 쓴다.
- **Empty state:** 카드 배경 없이 가운데 정렬. 제목 `body-lg-semibold`(18px/600), 필요한 경우에만 제목 아래 8px에 안내 `body-sm`(`on-surface-muted`), 그 아래 20px에 라임 "글 읽으러 가기" 버튼. 칩 아래 빈 영역의 가로·세로 가운데에 둔다.
- **Comment bubble:** 문장 아래에 붙는 연보라 말풍선. 본문에서는 누르면 "수정·삭제" 팝오버가 열리고, 아카이브 카드에서는 모양만 쓴다.
- **Save / bookmark icon:** 저장 전에는 `on-surface-muted` 테두리, 저장 후에는 `on-surface` 채움. 탐색 카드와 아카이브는 22px, 본문 상단 바는 24px.
- **Profile avatar:** 로그인 전에는 회색 원 + 실루엣 아이콘, 로그인 후에는 구글 계정 프로필 사진(없으면 라임 이니셜 원). 앱 바에서 32px, 프로필 페이지에서 80px.

컴포넌트 확인 페이지는 개발 서버의 `/design-system`에서 볼 수 있다. 배포 환경에서는 열리지 않는다.

## Do's and Don'ts

- Do: 강조색(`accent`)과 `primary` 버튼은 한 화면에 하나만 둔다. 둘 다 있으면 눌러야 할 곳이 흐려진다.
- Don't: 라임 위에 흰 글자를 올리지 않는다. 항상 `on-accent`(검정)를 쓴다.
- Do: 모든 색은 역할 토큰(`primary`, `danger`, `surface-muted`)으로 부른다. 화면에서 `#hex`나 임의 색을 직접 쓰지 않는다.
- Don't: `danger`는 삭제·오류 외에는 쓰지 않는다. 강조나 장식으로 빨강을 쓰지 않는다.
- Don't: `subtle`을 읽는 글자에 쓰지 않는다. 읽는 글자의 가장 약한 단계는 `on-surface-muted`다(예외: 선택 안 된 탭바 라벨은 `subtle`, "- 중략 -" 구분 표시는 `border-strong`).
- Do: 글자는 `text-display`·`text-headline`·`text-body-*`·`text-label-*` 토큰으로 정한다. `text-[13.5px]` 같은 임의 크기를 쓰지 않는다.
- Do: 새 UI가 필요하면 `components/ui`에서 먼저 찾고, 없을 때만 `npx shadcn@latest add`로 추가한다. 같은 역할의 컴포넌트를 따로 만들지 않는다.
- Do: 토큰 이름(글자 크기, 자간, 간격, 모서리)을 새로 만들면 `lib/utils.ts`의 클래스 병합 설정에도 같이 등록한다(자세한 이유는 `CLAUDE.md`).
