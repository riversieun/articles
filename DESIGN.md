---
version: alpha
name: Design Insight
description: 영어 아티클을 읽으며 모르는 표현을 바로 확인하는 모바일 우선 리더. 흑백 중심 화면에 라임 한 가지로만 강조한다.
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
    lineHeight: 1.15
    letterSpacing: -0.03em
  headline:
    fontFamily: Pretendard Variable
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.02em
  body-md:
    fontFamily: Pretendard Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Pretendard Variable
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
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
  pill: 26px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
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
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: 24px
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 20px
    padding: 8px
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 24px
---

# Design Insight

## Overview

영어 아티클을 읽다가 모르는 표현을 눌러 바로 뜻을 확인하는 모바일 우선 서비스다. 화면의 주인공은 항상 본문이고, UI는 읽기를 방해하지 않아야 한다. 그래서 화면 대부분은 흰 배경과 검정 글자로 정리하고, 눈에 띄어야 하는 것(핵심 행동, 하이라이트된 표현)에만 라임색을 쓴다. 느낌은 조용하고 정돈된 편집물에 가깝고, 장식은 쓰지 않는다.

컴포넌트는 shadcn/ui(Base UI, 프리셋 `b2D2mxv2w`)로 만들며 `components/ui`에 있다. 토큰은 `app/globals.css`에 정의돼 있고, 이 문서의 값은 그 파일을 기준으로 한다. 값이 다르면 `globals.css`가 우선이다.

## Colors

색 이름이 아니라 역할로 부른다.

- **Primary (#111111):** 글자와 기본 버튼의 검정. 화면에서 가장 무게 있는 색이다.
- **Accent (#D9F25C):** 라임. 서비스의 시그니처 강조색으로, 핵심 행동 버튼과 본문에서 하이라이트된 표현에만 쓴다. 위에 올리는 글자는 반드시 `on-accent`(검정)를 쓴다.
- **Accent-sub (#E7E0FF), Accent-sub-strong (#CBBCFF):** 연보라. 라임과 겹치지 않는 보조 구분용(태그, 선택 상태 배경)으로만 쓴다.
- **Surface (#FFFFFF) / Surface-muted (#F4F4F6):** 페이지와 카드는 흰색, 그 위의 입력창·보조 버튼·구획 배경은 연회색.
- **On-surface-muted (#5F5F66) / Subtle (#8E8E96):** 보조 설명과 메타 정보. `subtle`은 대비가 낮으므로 장식용 아이콘이나 비활성 상태에만 쓰고 읽어야 하는 글자에는 쓰지 않는다.
- **Border (#E7E7EA) / Border-strong (#D5D5DA):** 구분선. 카드 안팎의 일반 구분은 `border`, 입력 영역 같은 경계 강조는 `border-strong`.
- **Danger:** 삭제 등 되돌릴 수 없는 행동과 입력 오류에만 쓴다. 배경에 깔 때는 옅게(10~20%) 깔고 글자만 진하게 쓴다.
- **Focus-ring (#111111):** 키보드 포커스 표시. 지우지 않는다.

다크 모드 토큰은 `globals.css`에 정의돼 있지만 현재 화면에서는 사용하지 않는다.

## Typography

글꼴은 **Pretendard Variable** 하나로 한글과 영어 모두 쓴다(영어 본문도 같은 글꼴). 한글은 단어 단위로 줄바꿈(`word-break: keep-all`)하고, 영어(`lang="en"`)는 일반 줄바꿈으로 되돌린다.

- **Display / Headline:** 700 굵기에 자간을 좁혀(-0.02~-0.03em) 제목의 밀도를 높인다.
- **Body:** 기본 15px, 줄 높이 1.5. 아티클 본문은 이 크기를 기준으로 한다.
- **Label:** 버튼·배지처럼 짧은 글자. 500 굵기.
- 한 화면에서 쓰는 굵기는 두 가지(400, 700 계열)까지만 쓴다.

## Layout

모바일 우선의 한 줄 세로 흐름이다. 페이지 좌우 여백은 20px(`page`)이고, 요소 간격은 4px 단위 스케일(`xs`~`xl`)을 따른다. 큰 구획은 간격과 얇은 구분선(`border`)으로 나누고, 박스를 겹겹이 쌓지 않는다. 터치 대상은 높이 36px 이상을 지킨다(`button-accent` 같은 주요 행동은 52px).

## Elevation & Depth

그림자보다 **색 면과 구분선**으로 위계를 만든다. 흰 페이지 위에 연회색(`surface-muted`) 면을 올리고, 카드는 아주 옅은 링(`ring-foreground/5`)과 약한 그림자 하나만 쓴다. 팝업(Dialog)은 뒷배경을 어둡게 눌러서 분리한다. 그림자를 겹쳐 쓰지 않는다.

## Shapes

둥근 모서리가 기본이다. 버튼·입력창·배지는 알약형(`full`), 카드와 팝업은 `xl`(14px), 주요 행동 버튼은 `pill`(26px). 한 화면에서 둥근 정도가 다른 모양을 섞을 때는 용도(행동 요소 = 알약, 담는 그릇 = 카드)로만 구분한다.

## Components

모두 `components/ui`의 shadcn 컴포넌트를 쓰고, 새로 만들기 전에 먼저 여기서 찾는다.

- **Button:** `variant` 7종(`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`, `accent`)과 `size` 4종(`xs`, `sm`, `default`, `lg`) + 아이콘 버튼. `default`는 검정(`primary`), `accent`는 라임 배경 + 검정 글자(`button-accent`), `destructive`는 옅은 빨강 배경 + 빨강 글자다. 화면의 라임 버튼은 `bg-lime` 클래스를 직접 붙이지 말고 `variant="accent"`를 쓴다.
- **Input:** 연회색 배경의 알약형. 오류일 때는 `danger` 테두리와 옅은 링이 붙는다.
- **Card:** 흰 면 + 옅은 링. 내부 여백 24px(`size="sm"`은 16px).
- **Badge:** 높이 20px의 작은 알약. 상태 표시용이며 누르는 요소가 아니다(링크로 쓸 때만 호버 반응).
- **Dialog:** 중앙 팝업. 닫기 버튼은 항상 오른쪽 위에 둔다.

컴포넌트 확인 페이지는 개발 서버의 `/design-system`에서 볼 수 있다. 배포 환경에서는 열리지 않는다.

## Do's and Don'ts

- Do: 강조색(`accent`)과 `primary` 버튼은 한 화면에 하나만 둔다. 둘 다 있으면 눌러야 할 곳이 흐려진다.
- Don't: 라임 위에 흰 글자를 올리지 않는다. 항상 `on-accent`(검정)를 쓴다.
- Do: 모든 색은 역할 토큰(`primary`, `danger`, `surface-muted`)으로 부른다. 화면에서 `#hex`나 임의 색을 직접 쓰지 않는다.
- Don't: `danger`는 삭제·오류 외에는 쓰지 않는다. 강조나 장식으로 빨강을 쓰지 않는다.
- Do: 새 UI가 필요하면 `components/ui`에서 먼저 찾고, 없을 때만 `npx shadcn@latest add`로 추가한다. 같은 역할의 컴포넌트를 따로 만들지 않는다.
