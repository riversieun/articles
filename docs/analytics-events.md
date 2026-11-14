# 이벤트 추적 문서 (Mixpanel · Amplitude)

코드: `lib/analytics.ts`의 `track(이벤트명, 속성)` 한 곳으로 보내면 Mixpanel과 Amplitude에 **같은 이름·속성**으로 전송된다.
키는 `.env.local`의 `NEXT_PUBLIC_MIXPANEL_TOKEN`, `NEXT_PUBLIC_AMPLITUDE_API_KEY`. 키가 없는 쪽은 조용히 건너뛴다.
코멘트·생각·설문 답변 본문 같은 유저가 쓴 텍스트와 이메일·휴대폰 번호는 보내지 않는다. (개인정보처리방침에는 분석 도구가 받는 내용을 따로 약속하지 않으므로, 이 규칙은 이 문서와 코드가 지킨다)

- 이벤트 이름은 `Title Case`(영문), 속성 이름은 `snake_case`.
- 토글류는 on/off를 모두 보내고 `on`(true/false) 속성으로 구분한다.
- Mixpanel은 약 5초 간격으로 묶어서, Amplitude는 이벤트마다 바로 전송한다.
- `/design-system`(디자인 시스템 확인용 페이지)은 집계하지 않는다. `lib/analytics.ts`의 `UNTRACKED_PATH`로 직접 정의한 이벤트와 Amplitude 자동 수집(페이지뷰·클릭·뷰포트)을 모두 막는다. 제외할 경로를 늘리려면 이 정규식을 고친다.
- 스크롤 방향에 따른 하단 탭바 축소·복원은 시각적 상태 변화이므로 별도 이벤트를 보내지 않는다.

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
| Feed Filter Selected | 주제 필터 칩 선택. 탐색 탭(`Feed`)과 홈의 "주제별 보기"(`Home`) 두 곳에서 보냄 | `topic` (`all` · `process` · `collab` · `ux` · `system`), `entry_point`(홈에서 보낼 때만 `home`) | `components/Feed.tsx`, `components/Home.tsx` |
| Home Banner Clicked | 홈의 사용 후기 배너 클릭(`NEXT_PUBLIC_REVIEW_URL`이 있을 때만 링크). 설문이 서비스 안으로 들어오면 `Review Survey Started`가 대신한다 | `banner` (`review`) | `components/ReviewBanner.tsx` |
| Archive Filter Selected | 아카이브 필터 칩 선택(같은 칩을 다시 누르면 보내지 않음) | `filter` (`thoughts` · `articles`)  ← v2 아카이브는 "저장한 아티클"·"내 생각" 두 칩 | `app/(tabs)/archive/page.tsx` |
| **Article Opened** | 목록·카드에서 글을 눌러 상세로 들어갈 때 | `article_id`, `source`, `content_type`, `entry_point`, `position` | `ArticleRow`, 아카이브 |

`Article Opened`의 `entry_point`와 `position`(목록에서 0부터 센 순서):

| entry_point | 어디서 | position 기준 |
|---|---|---|
| `feed` | 탐색 탭의 글 카드 | 현재 필터가 적용된 목록의 순서 |
| `home_new` | 홈 "새로 등록된 글" 카드(`Home`) | 카드 순서 |
| `home_topic` | 홈 "주제별 보기" 목록 | 현재 칩이 적용된 목록의 순서 |
| `archive` | 아카이브 "내 생각" 필터의 글 제목 영역 | 그 필터에 보이는 글 그룹의 순서 |
| `saved` | 아카이브 "저장한 아티클" 필터의 글 카드 | 저장한 글 목록의 순서 |

## 읽기

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Article Read | 글을 떠나거나 탭/앱을 닫을 때 1회. 화면을 본 시간이 1초 미만이면 보내지 않음 | `article_id`, `source`, `content_type`, `seconds_visible`(탭이 보이던 초), `max_scroll_pct`(가장 깊이 읽은 위치 0~100), `completed` | `components/Reader.tsx` |
| Article Completed | 읽기 진행률이 **90%**에 처음 도달 (글당 1회) | `article_id`, `source`, `content_type` | `components/Reader.tsx` |
| Translation Toggled | 한글 번역 스위치 | `article_id`(글 화면에서만), `on` | `lib/store.tsx` |
| Sentence Action Sheet Opened | 문장을 탭해 팝오버(하이라이트·코멘트)가 열릴 때. 이름은 옛 "액션 시트"를 그대로 유지(바꾸면 기존 데이터와 끊김). 코멘트 말풍선의 수정·삭제 팝오버는 보내지 않고 `Note Edited`/`Note Deleted`로 잡힘 (닫을 때도 보내지 않음) | `article_id`, `sentence_id` | `components/Reader.tsx` |
| Original Article Clicked | "원문 읽기" 버튼. 상세(`ArticleDetail`) 하단과 병기 읽기(`Reader`) 두 곳에서 보냄 | `article_id`, `source`, `content_type` | `components/ArticleDetail.tsx`, `components/Reader.tsx` |

- 완독 기준은 `Reader.tsx`의 `COMPLETE_AT`(90) 하나다. `Article Completed`, `Article Read.completed`가 같은 기준을 쓴다. 완독했을 때 화면에 보이는 UI(배너 등)는 없다. (PRD v0.3 F-41도 90%)
- `Translation Toggled`는 병기 읽기(`/contents/[id]/read`)의 스위치에서만 보낸다. v2에서 프로필의 "번역 항상 켜기"가 빠져 `article_id` 없는 이벤트는 더 나오지 않는다. 번역 설정은 서버에 저장하지 않고 이 기기에만 둔다.
- `Article Read`·`Article Completed`는 상세(`ArticleDetail`)와 병기 읽기(`Reader`) 양쪽에서 같은 `useReadTracking`으로 보낸다. 두 화면을 구분하는 속성은 없으므로 필요하면 `Page View`의 `path`(`/read`로 끝나는지)로 가른다.

## 기록·저장

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Highlight Toggled | 문장 하이라이트 켜기/끄기 | `article_id`, `on` | `lib/store.tsx` |
| Comment Saved | 문장 코멘트 저장 | `article_id` | `lib/store.tsx` |
| Thought Added | 본문 "내 생각" 저장 | `article_id` | `lib/store.tsx` |
| Note Edited | 코멘트/생각 수정 완료 | `article_id`, `note_type` | `lib/store.tsx` (`updateNote`) |
| Note Deleted | 코멘트/생각 삭제 | `article_id`, `note_type` | `lib/store.tsx` (`removeNote`) |
| Article Saved Toggled | 글 저장/해제 | `article_id`, `on` | `lib/store.tsx` |
| Article Liked Toggled | "도움이 됐어요"(엄지) 켜기/끄기. 서버에서 글별로 합산(비로그인 포함) | `article_id`, `on` | `lib/store.tsx` (`toggleLike`) |
| Article Rated | 글 아래 별점 카드에서 별 선택(글당 한 번, 평가한 글에서는 카드가 안 보임) | `article_id`, `rating`(1~5) | `lib/store.tsx` (`rateArticle`) |

`note_type`: 문장 코멘트면 `comment`, 글 전체 "내 생각"이면 `thought`.

하이라이트·글 저장을 **해제할 때 스낵바는 뜨지 않지만** 이벤트(`on: false`)는 그대로 보낸다. 삭제 확인 다이얼로그에서 취소하면 삭제 이벤트를 보내지 않는다.

### 후기 설문 (구현 예정)

설문이 서비스 안 폼이 되면 아래 이벤트를 `Home Banner Clicked` 대신 쓴다. **답변 내용과 휴대폰 번호는 속성에 넣지 않는다.** 응답 자체는 Supabase(`review_responses`)에 저장한다.

| 이벤트 | 발생 시점 | 속성 |
|---|---|---|
| Review Survey Started | 배너를 눌러 설문에 들어갈 때 | 없음 |
| Review Survey Step Completed | 단계를 넘길 때 | `step`(1부터), `total_steps` |
| Review Survey Abandoned | 제출 없이 닫을 때 | `last_step` |
| Review Survey Submitted | 제출 | `entered_draw`(경품 응모 여부, true/false) |

## 삭제 예정 이벤트 (하이라이트·코멘트 제거 시)

v2 디자인에서 하이라이트·코멘트를 없애기로 했다. 코드(`lib/store.tsx`, `components/Reader.tsx`)에서 기능을 걷어낼 때 아래도 함께 지운다. 현재 코드에는 아직 남아 있다.

| 지울 것 | 이유 |
|---|---|
| `Highlight Toggled` | 하이라이트 삭제 |
| `Comment Saved` | 코멘트 삭제 |
| `Sentence Action Sheet Opened` | 하이라이트·코멘트 팝오버가 사라짐 |
| `Note Edited`·`Note Deleted`의 `note_type=comment` | 생각(`thought`)만 남음. 이벤트 자체는 유지 |
| `Backup Prompt Shown/Dismissed`의 `trigger=first_comment`, `first_highlight` | 코멘트·하이라이트가 첫 행동이 될 수 없음. `first_save`, `first_thought`는 유지 |

## 로그인·백업 제안

| 이벤트 | 발생 시점 | 속성 | 코드 위치 |
|---|---|---|---|
| Login Button Clicked | 로그인 진입 버튼 클릭 | `trigger` | `lib/store.tsx` |
| Login Completed | 구글 로그인을 마치고 앱으로 돌아왔을 때 (Supabase 키가 없는 프로토타입 모드에서는 버튼 클릭 즉시 목업) | `trigger`, `merged` | `lib/store.tsx` |
| Logout | 프로필의 로그아웃 | 없음 | `lib/store.tsx` |
| Account Deleted | 프로필의 계정 삭제를 확인 다이얼로그에서 확정 | 없음 (서버 함수 `delete_my_account()`로 계정·기록 삭제 후 `resetUser()`. 삭제에 실패하면 이벤트는 이미 나간 상태) | `lib/store.tsx` (`deleteAccount`) |
| Feedback Sent | 프로필의 피드백 보내기 | `kind` (`satisfied` · `improvement` · `feature_request` · `bug_report` · `other`). 내용 본문은 보내지 않음 | `app/mypage/page.tsx` |
| Backup Prompt Shown | "기록 백업" 제안이 노출될 때 | `trigger` | `lib/store.tsx` |
| Backup Prompt Dismissed | 백업 제안 시트를 닫을 때 ("나중에 할게요", 바깥 영역, Esc) | `trigger` | `lib/store.tsx` (`closeSheet`) |

**로그인 `trigger` 값** (진입 경로별):

| trigger | 진입 경로 | 파일 |
|---|---|---|
| `profile` | 프로필 페이지(비로그인)의 "Google로 로그인하기" 버튼. 앱 바의 프로필 아이콘은 이제 로그인 시트가 아니라 프로필 페이지로 이동한다 | `app/mypage/page.tsx` |
| `backup_prompt` | 자동으로 뜬 백업 제안 시트(기록이 남는 첫 행동 직후) 안의 "Google로 계속하기" | `lib/store.tsx` |

- 앱 안 브라우저(카카오톡·인스타그램 등)에서는 기록이 남는 첫 행동 직후 로그인 시트 대신 "외부 브라우저에서 열어주세요" 시트가 뜬다. 이때도 `Backup Prompt Shown`(`trigger=first_comment` 등)은 보내지만, 이 시트를 닫을 때 `Backup Prompt Dismissed`는 보내지 않는다. 로그인 버튼을 눌렀을 때도 같은 시트가 뜨고 `Login Button Clicked`는 보내지만 `Login Completed`는 나오지 않는다.
- 로그인 화면을 숨긴 빌드(`NEXT_PUBLIC_LOGIN_ENABLED=false`)에서는 `Login Button Clicked`, `Backup Prompt Shown/Dismissed`, `Login Completed`가 나오지 않는다. 이때 대시보드의 로그인 전환 지표는 비어 있는 게 정상이다.
- `Login Completed.trigger`는 로그인을 시작한 진입 경로와 같은 값이다.
- `backup_prompt`는 시트 안의 버튼이 곧 로그인 버튼이라, `Login Button Clicked`를 그 버튼을 누를 때 보낸다. 나머지 경로는 진입 버튼을 누를 때 보낸다. (이후 시트의 "Google로 계속하기"는 `Login Completed`로 이어진다)
- `Login Completed`는 구글 화면에 다녀온 뒤 새로 열린 페이지에서 보낸다. 진입 경로(`trigger`)는 나가기 전에 `sessionStorage`에 남겨 두었다가 읽는다. 구글 화면에서 취소하고 돌아오면 이 이벤트는 없다(`Login Button Clicked`만 있음).
- `merged`: 이미 있던 구글 계정에 이 기기의 게스트 기록을 합쳤으면 `true`, 게스트 사용자에 구글 계정을 그대로 연결했으면 `false`. (`lib/store.tsx`의 `syncSession`)
- `Logout`은 `resetUser()`보다 먼저 보낸다(`lib/store.tsx`의 `logout()`).

**Backup Prompt `trigger` 값**:

| trigger | 노출 | 닫기 이벤트 |
|---|---|---|
| `first_comment` | 기록이 남는 첫 행동이 문장 코멘트일 때 뜨는 시트 | 있음 |
| `first_highlight` | 첫 행동이 하이라이트 켜기일 때 | 있음 |
| `first_save` | 첫 행동이 글 저장 켜기일 때 | 있음 |
| `first_thought` | 첫 행동이 글 아래 "내 생각" 작성일 때 | 있음 |

시트는 이 기기에서 **한 번만** 뜬다(어느 행동이 먼저든). 예전에 `first_comment`로 이미 본 기기도 다시 뜨지 않는다.

- 예전에 있던 `expressions_3`(표현 3개 저장 시 제안, v0.4 삭제), `app_bar`(앱 바 아이콘으로 열던 로그인 시트), `guest_notice`(아카이브 상단 안내), `mypage`(옛 프로필의 로그인 카드), `reader_end_banner`(완독 배너), `read_completed` 제안은 화면에서 삭제돼 더 이상 보내지 않는다. 대시보드에 과거 데이터가 남아 있을 수 있다.
- 프로필의 로그인 버튼은 시트 없이 바로 구글 계정 선택 화면으로 이동한다(앱 안 브라우저에서는 안내 시트). 그래서 "제안"이 아닌 시트는 없고, Shown/Dismissed는 기록이 남는 첫 행동 직후의 시트에서만 나온다.

## 삭제된 이벤트 (v0.4)

표현 기능 삭제(PRD v0.4)로 아래 이벤트·값은 더 보내지 않는다. 대시보드에 과거 데이터는 남아 있을 수 있다.

| 삭제된 것 | 원래 의미 |
|---|---|
| `Expression Tooltip Opened` | 주요 표현 툴팁 열기 |
| `Expression Saved Toggled` | 표현 저장/해제 |
| `Archive Filter Selected`의 `filter=expressions` | 아카이브 "표현" 필터 선택 |
| `Article Opened`의 `entry_point=expressions` | 저장한 표현 카드에서 출처 글로 이동 |
| `Backup Prompt Shown/Dismissed`의 `trigger=expressions_3` | 표현 3개 저장 시 백업 제안 |

## Amplitude

`lib/analytics.ts`의 `initAnalytics()`가 Mixpanel과 Amplitude를 함께 초기화한다. (`components/AmplitudeInit.tsx`가 앱 시작 시 호출)

- 위에 정의한 모든 이벤트는 `track()` 한 번으로 같은 이름·속성으로 두 도구에 전송된다. Amplitude는 `flushQueueSize: 1`이라 이벤트마다 바로 보낸다.
- Amplitude는 자동 수집(autocapture)도 켜 둠: 페이지뷰(`[Amplitude] Page Viewed`), 세션, 폼 입력, 파일 다운로드, 클릭(`elementInteractions: true`, `[Amplitude] Element Clicked`). Mixpanel에는 자동 수집이 없다.
- **후기 설문의 휴대폰 번호 입력란은 자동 수집에서 제외해야 한다.** `formInteractions`·`elementInteractions`가 입력란 이름·값을 보낼 수 있으므로, 설문 화면(경로)을 `UNTRACKED_PATH`에 넣거나 입력란에 `data-amp-mask`(마스킹)를 건다. 설문 답변 본문과 번호는 `track()` 속성에도 넣지 않는다. 설문 구현 때 확인한다.
- 그래서 Amplitude에는 직접 정의한 `Page View`와 자동 수집 `[Amplitude] Page Viewed`가 둘 다 보인다. 분석할 때 하나만 기준으로 삼는다.
- `is_guest`는 Amplitude에서 이벤트 속성이 아니라 **사용자 속성**이다. 차트에서 사용자 속성으로 필터/그룹하세요.

## 사용자 ID

로그인하면 `identifyUser(user.id)`, 로그아웃하면 `resetUser()`를 호출한다. 두 도구에 같은 ID가 들어가므로 사용자 단위로 비교할 수 있다. (`resetUser()`는 `is_guest`를 true로 다시 등록한다)

- ID는 Supabase의 `user.id`(내부 UUID)만 쓴다. 이메일·이름은 보내지 않는다.
- 로그인 전 기록(기기 ID)은 Mixpanel이 `identify`로 자동 연결한다. Amplitude도 같은 기기의 기록이 이어진다.
- 구글 로그인을 마친 사용자(익명 세션 제외)에 대해서만 `identifyUser`를 부른다(`lib/store.tsx`의 `syncSession`). 익명 사용자는 도구의 기기 ID 그대로 둔다.

## 참고

- 체류 시간은 `seconds_visible`을 쓰세요. 탭이 백그라운드에 있던 시간은 빠져 있습니다.
- 개발 모드에서는 브라우저 콘솔에 `MIXPANEL REQUEST`로 전송 내용이 보입니다.
- 개인정보처리방침(`/privacy`, 시행일 2026-11-16)은 작성돼 있다. 법무 검토와 Amplitude 자동 수집 범위 점검(위 설문 입력란 제외 포함)은 공개 전 확인 항목이다.
