UI 작업 전에 반드시 DESIGN.md를 먼저 읽을 것.
여기 없는 색·간격·반경 값을 새로 만들지 말 것.

## 개발 규칙

### 디자인 토큰
- 글자 크기는 `text-display`·`text-headline`·`text-body-lg`·`text-body-md`·`text-body-sm`·`text-label-md`·`text-label-sm` 중에서 고른다. `text-[13.5px]` 같은 임의 크기를 쓰지 않는다. 크기·줄 높이는 이 클래스가, 굵기·자간은 `font-*`·`tracking-*`를 따로 붙여 정한다. 600 굵기는 `*-semibold` 토큰(DESIGN.md)에서만 쓴다.
- 읽는 글자에 `text-subtle`을 쓰지 않는다. 가장 약한 글자색은 `text-on-surface-muted`다. 예외는 입력창 placeholder(`label`, `text-pd-label`)와 선택 안 된 탭바 라벨(`subtle`)과 아티클 본문의 "- 중략 -" 구분 표시(`border-strong`)뿐이다.
- 간격 이름(`sm`, `md`, `xl`…)을 CSS 토큰(`--spacing-*`)으로 만들지 않는다. Tailwind의 `max-w-md` 같은 클래스가 깨진다(실제로 다이얼로그 폭이 12px로 줄어든 적이 있다). 같은 값의 숫자 클래스(4px=`1`, 8px=`2`, 12px=`3`, 16px=`4`, 24px=`6`, 32px=`8`, 80px=`20`)를 쓴다.
- 모서리는 `rounded-sm/md/lg/xl/card/pill/full`만 쓴다(`rounded-[16px]` 금지).

### 클래스 병합 `cn`
- `cn`은 `@/lib/utils`에서 가져온다. `"cn"` 패키지를 직접 import하지 않는다.
- 글자 크기·자간·모서리의 **새 토큰 이름을 만들면 `lib/utils.ts`의 설정에도 같이 등록한다.** 등록하지 않으면 `cn`이 `text-body-md`를 글자색으로 착각해 지우거나, 기본 `text-sm`과 충돌을 못 풀어 14px로 나온다. 화면에서 눈으로 보면 잘 안 보이니 계산된 `font-size`로 확인한다.

### 토큰 파일 관계
- 원본은 `DESIGN.md`, 앱이 읽는 값은 `app/globals.css`의 `@theme`/`--ds-*`. `theme.css`는 DESIGN.md에서 내보낸 **참고용 사본**이다(앱이 읽지 않는다).
- DESIGN.md를 고치면 `npx @google/design.md export --format css-tailwind DESIGN.md`로 `theme.css`를 다시 만들고, `globals.css`의 값을 맞춘다. `/design-system` 페이지(`app/design-system`)도 같이 고친다.

### 공통 컴포넌트
- 삭제 확인은 `ConfirmDeleteDialog`(문구 고정), 여러 줄 입력은 `components/ui/textarea`, 토글은 `ToggleSwitch`, 코멘트 말풍선은 `CommentBubble`을 쓴다. 같은 역할의 컴포넌트를 새로 만들지 않는다.

### 반응형
- 기준점은 두 개다: `md:`(768px, 태블릿·노트북)와 `xl:`(1280px, 데스크탑). 모바일(~767px) 값은 접두어 없이 두고 PC 값만 접두어로 덧붙인다. 모바일 클래스를 바꾸면 휴대폰 화면이 바뀌므로, PC 작업에서는 접두어 붙은 클래스만 더한다.
- 화면 폭은 `components/Column.tsx`(모바일 430px, `md` 이상 680px)가 정한다. 새 화면은 `Column`으로 감싼다. 탭 화면은 `app/(tabs)/layout.tsx`가 헤더·좌측 내비·하단 탭바를 조립한다.
- 상단 헤더(`AppBar`)는 모든 해상도에서 유지하고, 탭 이동만 하단 탭바(~767px) → 좌측 내비(`SideNav`, 768px~)로 바뀐다. 탭 목록은 `components/tabs.tsx` 하나를 같이 쓴다.
- 고정 위치 요소(시트·스낵바·플로팅 바)는 `Column`과 같은 폭(430/680px)을 맞춘다. 컴포넌트별 변화표는 DESIGN.md "반응형 기준점"이 기준이다.
- 반응형을 고치면 375·767·768·1279·1280·1440px에서 확인하고, 모바일 폭(375·600·767px)은 main과 화면이 같은지 비교한다.

### 문서 동기화
- 화면이나 동작을 바꾸면 `docs/PRD.md`, `docs/analytics-events.md`, `DESIGN.md`를 같이 고친다. 이벤트를 추가·삭제하면 `analytics-events.md`가 기준이다.

### 배포 전
- `npm run build`가 통과해야 한다. `lint`·`test` 스크립트는 아직 없다(M1 예정).
- `data/raw.ts`의 번역·요약이 운영자 검수를 마쳤는지, 발췌 분량과 출처 표기가 맞는지 확인한다.
- 구글 로그인 노출은 환경변수 `NEXT_PUBLIC_LOGIN_ENABLED`(`false`면 숨김)로 정한다. Vercel Production 값이 의도와 맞는지 확인하고, 값은 빌드 때 박히므로 바꾸면 다시 배포한다. (설명: `docs/supabase-설정.md` 4-1)
- 앱 안 브라우저 안내 시트는 개발 서버에서 주소에 `?inapp=1`을 붙여 확인한다. 배포 빌드에는 들어가지 않는다.
