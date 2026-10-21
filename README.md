# articles — M0 프로토타입

PRD(`../PRD.md` v0.2)의 M0 단계 프로토타입입니다. **Next.js(App Router) + Tailwind CSS v4**로 만들었고,
시각 디자인과 샘플 콘텐츠는 `../claude_design_prototype/Prototype.html` 시안을 따랐습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

모바일 폭(390px 전후)으로 보거나 개발자 도구의 모바일 뷰를 사용하세요.

## 구현된 것

| PRD | 화면/동작 |
|---|---|
| F-02, F-06 | 홈: 아티클/영상 구분 + 소스 필터 (URL 쿼리로 유지) |
| F-03 | 상세: 문장 단위 영어 + 한글 병기 |
| F-10, F-11 | 한글 번역 토글 (localStorage 유지) |
| F-20, F-21 | 주요 표현 형광 표시 + 툴팁 |
| F-30~F-33 | 문장 탭 → 하이라이트 / 코멘트 (**로그인 없이 가능**) |
| F-40, F-41 | 상단 읽기 프로그레스 바, 95%에서 "읽기 완료" |
| F-50~F-52 | 본문 아래 주요 표현 정리, 저장, 표현 탭 |
| F-60~F-62 | 글 하단 내 생각 + 입력, 아카이브 탭 (코멘트 없는 하이라이트도 포함) |
| F-70~F-72 | 구글 로그인(**목업**), 표현 3개 저장 / 첫 코멘트 / 읽기 완료 시 1회 백업 제안 |
| (시안) | 글 저장(책갈피), 영상 임베드 영역 자리표시 |

## 프로토타입의 한계 (실제 서비스와 다른 점)

- **데이터는 모두 목업**입니다. 글·번역·출처 표기는 UI 확인용 샘플이며 실제 원문이 아닙니다 (`data/raw.ts`).
- **기록은 브라우저 localStorage**에 저장됩니다 (`lib/store.tsx`). 실제로는 Supabase 익명 세션 + RLS입니다.
- **"Google로 계속하기"는 플래그만 바꾸는 목업**이며 실제 인증을 하지 않습니다.
- 영상 임베드는 자리표시입니다. 실제로는 `youtube-nocookie.com` iframe을 사용합니다.
- 어드민, AI 번역 파이프라인, SEO 메타 고도화는 포함하지 않았습니다.

## 구조

```
app/
  layout.tsx            전역 레이아웃·폰트·스토어
  (tabs)/               하단 탭 영역: 홈, expressions, archive
  contents/[id]/        상세 (서버 컴포넌트가 params 처리, Reader 가 클라이언트)
components/             Reader, Feed, TabBar, Overlays(시트·토스트) …
lib/content.ts          RAW → 문장/표현 파싱
lib/store.tsx           하이라이트·코멘트·표현·로그인 상태 (localStorage)
data/raw.ts             샘플 콘텐츠
```

## 다음 단계 제안

1. 디자인 리뷰 후 문구·인터랙션 수정
2. Supabase 연결 (익명 로그인 → `linkIdentity`, 테이블/RLS)
3. 어드민 3화면(목록 / 등록·검수 / 미리보기·게시)
