# 이벤트 추적 문서 (Mixpanel · Amplitude)

코드: `lib/analytics.ts`의 `track(이벤트명, 속성)` 한 곳으로 보내면 Mixpanel과 Amplitude에 **같은 이름·속성**으로 전송된다.
키는 `.env.local`의 `NEXT_PUBLIC_MIXPANEL_TOKEN`, `NEXT_PUBLIC_AMPLITUDE_API_KEY`. 키가 없는 쪽은 조용히 건너뛴다.
코멘트·생각 본문 같은 유저가 쓴 텍스트와 이메일은 보내지 않는다.

- 이벤트 이름은 `Title Case`(영문), 속성 이름은 `snake_case`.
- 토글류는 on/off를 모두 보내고 `on`(true/false) 속성으로 구분한다.
- Mixpanel은 약 5초 간격으로 묶어서, Amplitude는 이벤트마다 바로 전송한다.
- `/design-system`(디자인 시스템 확인용 페이지)은 집계하지 않는다. `lib/analytics.ts`의 `UNTRACKED_PATH`로 직접 정의한 이벤트와 Amplitude 자동 수집(페이지뷰·클릭·뷰포트)을 모두 막는다. 제외할 경로를 늘리려면 이 정규식을 고친다.

## 공통 속성

| 속성 | 값 | 설명 |
|---|---|---|
| `is_guest` | true / false | 로그인하지 않은 상태면 true. 로그인 상태가 바뀔 때마다 `setGuestState()`로 갱신하고, 이후 모든 이벤트에 붙는다. Mixpanel은 `register`(이벤트 속성), Amplitude는 사용자 속성으로 들어간다. |

글 단위 이벤트에는 `articleProps(aid)`로 아래 3개를 함께 붙인다. 값은 콘텐츠 데이터(`lib/content.ts`)에서 가져온다.

| 속성 | 값 |
|---|---|
| `article_id` | 글 ID (예: `a1`) |
| `source` | 출처 키: `figma` · `medium` · `hn` · `nng` · `lenny` |
| `content_type` | `article` · `video` |

## 화면·탐색

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Page View | 화면(경로)이 바뀔 때. 로그인 상태를 읽은 뒤부터 보냄 | `path`, `article_id`(글 화면만) | `components/Analytics.tsx` |
| Feed Filter Selected | 피드 출처 필터 칩 선택 | `source` (`all` 또는 출처 키) | `components/Feed.tsx` |
| **Article Opened** | 목록·카드에서 글을 눌러 상세로 들어갈 때 | `article_id`, `source`, `content_type`, `entry_point`, `position` | `ArticleRow`, 표현 탭, 아카이브 |

`Article Opened`의 `entry_point`와 `position`(목록에서 0부터 센 순서):

| entry_point | 어디서 | position 기준 |
|---|---|---|
| `feed` | 피드의 글 카드 | 현재 필터가 적용된 목록의 순서 |
| `expressions` | 표현 탭 카드의 "출처 글로 이동" | 저장한 표현 목록의 순서 |
| `archive` | 아카이브 하이라이트/코멘트 탭의 글 제목 줄 | 그 탭에 보이는 글 그룹의 순서 |
| `saved` | 아카이브 "저장한 글" 탭의 항목 | 저장한 글 목록의 순서 |

## 읽기

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Article Read | 글을 떠나거나 탭/앱을 닫을 때 1회. 화면을 본 시간이 1초 미만이면 보내지 않음 | `article_id`, `source`, `content_type`, `seconds_visible`(탭이 보이던 초), `max_scroll_pct`(가장 깊이 읽은 위치 0~100), `completed` | `components/Reader.tsx` |
| Article Completed | 읽기 진행률이 **90%**에 처음 도달 (글당 1회) | `article_id`, `source`, `content_type` | `components/Reader.tsx` |
| Translation Toggled | 한글 번역 스위치 | `article_id`(글 화면에서만), `on` | `lib/store.tsx` |
| Expression Tooltip Opened | 주요 표현을 눌러 툴팁을 열 때 | `article_id`, `source`, `content_type`, `expression_id` | `components/Reader.tsx` |
| Sentence Action Sheet Opened | 문장을 탭해 하이라이트/코멘트 메뉴가 열릴 때 (닫을 때는 보내지 않음) | `article_id`, `sentence_id` | `components/Reader.tsx` |
| Original Article Clicked | "원문 읽기" 버튼 | `article_id`, `source`, `content_type` | `components/Reader.tsx` |

- 완독 기준은 `Reader.tsx`의 `COMPLETE_AT`(90) 하나다. `Article Completed`, `Article Read.completed`, 완독 후 백업 배너가 모두 같은 기준을 쓴다. (PRD F-41은 95%로 적혀 있어 PRD와 다름)
- `Translation Toggled`는 마이페이지의 "한글 번역 기본 표시" 스위치에서도 보내며, 이때는 `article_id`가 없다.

## 기록·저장

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Highlight Toggled | 문장 하이라이트 켜기/끄기 | `article_id`, `on` | `lib/store.tsx` |
| Comment Saved | 문장 코멘트 저장 | `article_id` | `lib/store.tsx` |
| Thought Added | "글을 읽고 든 생각" 저장 | `article_id` | `lib/store.tsx` |
| Note Edited | 코멘트/생각 수정 완료 | `article_id`, `note_type` | `lib/store.tsx` (`updateNote`) |
| Note Deleted | 코멘트/생각 삭제 | `article_id`, `note_type` | `lib/store.tsx` (`removeNote`) |
| Expression Saved Toggled | 표현 저장/해제 | `article_id`, `expression_id`, `on` | `lib/store.tsx` |
| Article Saved Toggled | 글 저장/해제 | `article_id`, `on` | `lib/store.tsx` |

`note_type`: 문장 코멘트면 `comment`, 글 전체 "읽고 든 생각"이면 `thought`.

## 로그인·백업 제안

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Login Button Clicked | 로그인 진입 버튼 클릭 | `trigger` | `lib/store.tsx` |
| Login Completed | 로그인 완료 (현재는 프로토타입 목업) | `trigger`, `merged` | `lib/store.tsx` |
| Logout | 로그아웃 버튼 | 없음 | `lib/store.tsx` |
| Backup Prompt Shown | "기록 백업" 제안이 노출될 때 | `trigger` | `lib/store.tsx`, `components/Reader.tsx` |
| Backup Prompt Dismissed | 백업 제안 시트를 닫을 때 ("나중에 할게요", 바깥 영역, Esc) | `trigger` | `lib/store.tsx` (`closeSheet`) |

**로그인 `trigger` 값** (진입 경로별):

| trigger | 진입 경로 | 파일 |
|---|---|---|
| `app_bar` | 상단 앱바의 "로그인" 버튼 | `components/AppBar.tsx` |
| `guest_notice` | 표현·아카이브 탭 상단 "지금 기록은 이 기기에만…" 안내의 "백업하기" | `components/GuestNotice.tsx` |
| `mypage` | 마이페이지(비로그인)의 "Google로 계속하기" | `app/mypage/page.tsx` |
| `reader_end_banner` | 글을 끝까지 읽은 뒤 나오는 "기록 백업하기" 배너 | `components/Reader.tsx` |
| `backup_prompt` | 자동으로 뜬 백업 제안 시트(표현 3개 저장 / 첫 코멘트) 안의 "Google로 계속하기" | `lib/store.tsx` |

- `Login Completed.trigger`는 로그인을 시작한 진입 경로와 같은 값이다.
- `backup_prompt`는 시트 안의 버튼이 곧 로그인 버튼이라, `Login Button Clicked`를 그 버튼을 누를 때 보낸다. 나머지 경로는 진입 버튼을 누를 때 보낸다. (이후 시트의 "Google로 계속하기"는 `Login Completed`로 이어진다)
- `merged`: 기존 구글 계정에 게스트 데이터를 병합했는지. 지금은 목업이라 항상 `false`. **Supabase 연동 시** `lib/store.tsx`의 `login()` 안 TODO 위치에서 실제 값으로 바꾼다.
- `Logout`은 `resetUser()`보다 먼저 보낸다. 지금은 사용자 ID가 없어서 `resetUser()`를 부르지 않고, 같은 위치(`logout()`)에 TODO를 남겼다.

**Backup Prompt `trigger` 값**:

| trigger | 노출 | 닫기 이벤트 |
|---|---|---|
| `expressions_3` | 저장한 표현이 3개가 됐을 때 뜨는 시트 | 있음 |
| `first_comment` | 첫 문장 코멘트를 남겼을 때 뜨는 시트 | 있음 |
| `read_completed` | 글을 90%까지 읽었을 때 글 하단에 나오는 배너 (글마다 1회) | 없음 (배너에 닫기 버튼이 없음) |

- 탭 상단의 `GuestNotice`("지금 기록은 이 기기에만 저장돼 있어요")는 항상 떠 있는 안내라 `Backup Prompt Shown`으로 보내지 않는다. 그 안의 "백업하기" 버튼은 `Login Button Clicked`(`guest_notice`)로 잡힌다.
- 사용자가 직접 로그인 버튼을 눌러 연 시트는 "제안"이 아니라서 Shown/Dismissed를 보내지 않는다.

## Amplitude

`lib/analytics.ts`의 `initAnalytics()`가 Mixpanel과 Amplitude를 함께 초기화한다. (`components/AmplitudeInit.tsx`가 앱 시작 시 호출)

- 위에 정의한 모든 이벤트는 `track()` 한 번으로 같은 이름·속성으로 두 도구에 전송된다. Amplitude는 `flushQueueSize: 1`이라 이벤트마다 바로 보낸다.
- Amplitude는 자동 수집(autocapture)도 켜 둠: 페이지뷰(`[Amplitude] Page Viewed`), 세션, 폼 입력, 파일 다운로드, 클릭(`elementInteractions: true`, `[Amplitude] Element Clicked`). Mixpanel에는 자동 수집이 없다.
- 그래서 Amplitude에는 직접 정의한 `Page View`와 자동 수집 `[Amplitude] Page Viewed`가 둘 다 보인다. 분석할 때 하나만 기준으로 삼는다.
- `is_guest`는 Amplitude에서 이벤트 속성이 아니라 **사용자 속성**이다. 차트에서 사용자 속성으로 필터/그룹하세요.

## 사용자 ID (Supabase 연동 시)

로그인하면 `identifyUser(user.id)`, 로그아웃하면 `resetUser()`를 호출한다. 두 도구에 같은 ID가 들어가므로 사용자 단위로 비교할 수 있다. (`resetUser()`는 `is_guest`를 true로 다시 등록한다)

- ID는 Supabase의 `user.id`(내부 UUID)만 쓴다. 이메일·이름은 보내지 않는다.
- 로그인 전 기록(기기 ID)은 Mixpanel이 `identify`로 자동 연결한다. Amplitude도 같은 기기의 기록이 이어진다.
- `lib/store.tsx`의 `login()`·`logout()` 안 TODO 주석 위치에서 연결한다.

## 참고

- 체류 시간은 `seconds_visible`을 쓰세요. 탭이 백그라운드에 있던 시간은 빠져 있습니다.
- 개발 모드에서는 브라우저 콘솔에 `MIXPANEL REQUEST`로 전송 내용이 보입니다.
- 공개 전: 개인정보처리방침/분석 수집 안내 필요.
