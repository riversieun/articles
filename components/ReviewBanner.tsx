"use client";

import { track } from "@/lib/analytics";

/** 설문(사용 후기) 주소. 설문 플로우가 정해지면 NEXT_PUBLIC_REVIEW_URL 에 넣는다. 없으면 배너는 안내만 하고 눌러도 이동하지 않는다. */
const REVIEW_URL = process.env.NEXT_PUBLIC_REVIEW_URL;

const BOX = "flex w-full items-center gap-4 rounded-card bg-pd-note px-6 py-5 text-left text-pd-ink no-underline";

/**
 * 홈의 사용 후기 안내 배너(노란 면 + 말풍선 일러스트, Figma 홈 프레임).
 * 피드백을 충분히 받은 뒤에는 이 컴포넌트와 Home 의 <ReviewBanner /> 한 줄을 지우면 된다.
 * 여러 단계의 설문 플로우로 이어질 예정이라 기존 피드백 다이얼로그는 연결하지 않는다.
 */
export function ReviewBanner() {
  const inner = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-title-sm font-semibold tracking-body">크럼빗 사용 후기를 들려주세요</span>
        <span className="text-note tracking-body text-pd-ink-muted">
          더 나은 서비스를 위해 의견을 듣고 싶어요. 추첨으로 커피 기프티콘 드려요 🎁
        </span>
      </span>
      {/* 일러스트는 원본(71.487×68) 비율 그대로 높이 62px */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/illustrations/message-detail.svg" alt="" aria-hidden="true" width="65.18" height="62" className="shrink-0" />
    </>
  );

  return (
    <section aria-label="사용 후기 안내" className="px-6 pt-3 pb-2">
      {REVIEW_URL ? (
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("Home Banner Clicked", { banner: "review" })}
          className={BOX}
        >
          {inner}
        </a>
      ) : (
        <div className={BOX}>{inner}</div>
      )}
    </section>
  );
}
