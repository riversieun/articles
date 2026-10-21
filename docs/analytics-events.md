# 이벤트 추적 문서 (Mixpanel)

코드: `lib/analytics.ts`의 `track(이벤트명, 속성)` 한 곳으로 보낸다. 토큰은 `.env.local`의 `NEXT_PUBLIC_MIXPANEL_TOKEN`.
토큰이 없으면 아무것도 보내지 않는다. 코멘트·생각 본문 같은 유저가 쓴 텍스트와 이메일은 보내지 않는다.

- 이벤트 이름은 `Title Case`(영문), 속성 이름은 `snake_case`.
- 토글류는 on/off를 모두 보내고 `on`(true/false) 속성으로 구분한다.
- 이벤트는 약 5초 간격으로 묶여 전송된다. (Mixpanel Live View에 몇 초 늦게 보임)
- Amplitude를 추가할 때도 같은 이름·속성을 쓴다. (추가 시 `track()`만 수정)

## 화면·탐색

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Page View | 화면(경로)이 바뀔 때 | `path`, `article_id`(글 화면만) | `components/Analytics.tsx` |
| Feed Filter Selected | 피드 출처 필터 칩 선택 | `source` (`all` 또는 출처 키) | `components/Feed.tsx` |

## 읽기

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Article Read | 글을 떠나거나 탭/앱을 닫을 때 1회. 화면을 본 시간이 1초 미만이면 보내지 않음 | `article_id`, `seconds_visible`(탭이 보이던 초), `max_scroll_pct`(가장 깊이 읽은 위치 0~100), `completed` | `components/Reader.tsx` |
| Article Completed | 읽기 진행률이 95%에 처음 도달 (글당 1회) | `article_id` | `components/Reader.tsx` |
| Translation Toggled | 한글 번역 스위치 | `on` | `lib/store.tsx` |
| Expression Tooltip Opened | 주요 표현을 눌러 툴팁을 열 때 | `article_id`, `expression_id` | `components/Reader.tsx` |
| Original Article Clicked | "원문 읽기" 버튼 | `article_id` | `components/Reader.tsx` |

## 기록·저장

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Highlight Toggled | 문장 하이라이트 켜기/끄기 | `article_id`, `on` | `lib/store.tsx` |
| Comment Saved | 문장 코멘트 저장 | `article_id` | `lib/store.tsx` |
| Thought Added | "글을 읽고 든 생각" 저장 | `article_id` | `lib/store.tsx` |
| Note Deleted | 코멘트/생각 삭제 | 없음 | `lib/store.tsx` |
| Expression Saved Toggled | 표현 저장/해제 | `expression_id`, `on` | `lib/store.tsx` |
| Article Saved Toggled | 글 저장/해제 | `article_id`, `on` | `lib/store.tsx` |

## 로그인

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Login Button Clicked | 로그인 버튼(수동) 클릭 | 없음 | `lib/store.tsx` |
| Login Completed | 로그인 완료 (현재는 프로토타입 목업) | 없음 | `lib/store.tsx` |

## 참고 / 앞으로

- 체류 시간은 `seconds_visible`을 쓰세요. 탭이 백그라운드에 있던 시간은 빠져 있습니다.
- 자동 로그인 연동(Supabase) 시 `mixpanel.identify(사용자 내부 ID)`를 추가해 비로그인 기록과 연결할 예정입니다. 이메일은 보내지 않습니다.
- 개발 모드에서는 브라우저 콘솔에 `MIXPANEL REQUEST`로 전송 내용이 보입니다.
- 공개 전: 개인정보처리방침/분석 수집 안내 필요.

## Amplitude

`lib/analytics.ts`의 `initAnalytics()`가 Mixpanel과 Amplitude를 함께 초기화한다. (`components/AmplitudeInit.tsx`가 앱 시작 시 호출, 키는 `NEXT_PUBLIC_AMPLITUDE_API_KEY`)

- 위에 정의한 모든 이벤트는 `track()` 한 번으로 **같은 이름·속성**으로 두 도구에 함께 전송된다.
- Amplitude는 자동 수집(autocapture)도 켜 둠: 페이지뷰(`[Amplitude] Page Viewed`), 세션, 폼 입력, 파일 다운로드, 클릭(`elementInteractions: true`, `[Amplitude] Element Clicked`). Mixpanel에는 자동 수집이 없다.
- 그래서 Amplitude에는 직접 정의한 `Page View`와 자동 수집 `[Amplitude] Page Viewed`가 둘 다 보인다. 분석할 때 하나만 기준으로 삼는다.

## 사용자 ID (Supabase 연동 시)

로그인하면 `identifyUser(user.id)`, 로그아웃하면 `resetUser()`를 호출한다. 두 도구에 같은 ID가 들어가므로 사용자 단위로 비교할 수 있다.

- ID는 Supabase의 `user.id`(내부 UUID)만 쓴다. 이메일·이름은 보내지 않는다.
- 로그인 전 기록(기기 ID)은 Mixpanel이 `identify`로 자동 연결한다. Amplitude도 같은 기기의 기록이 이어진다.
