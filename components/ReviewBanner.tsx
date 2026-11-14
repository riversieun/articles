"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { FeedbackDialog } from "./FeedbackDialog";

/** 설문(사용 후기) 주소. 정해지면 NEXT_PUBLIC_REVIEW_URL 에 넣는다. 없으면 배너를 눌렀을 때 피드백 다이얼로그를 연다. */
const REVIEW_URL = process.env.NEXT_PUBLIC_REVIEW_URL;

const BOX =
  "flex w-full items-center gap-4 rounded-card border-0 bg-pd-note px-6 py-5 text-left text-pd-ink no-underline";

/** 홈의 사용 후기 안내 배너(노란 면 + 말풍선 일러스트, Figma 홈 프레임). */
export function ReviewBanner() {
  const [open, setOpen] = useState(false);

  const inner = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-title-sm font-semibold tracking-body">크럼빗 사용 후기를 들려주세요</span>
        <span className="text-note tracking-body text-pd-ink-muted">
          더 나은 서비스를 위해 의견을 듣고 싶어요. 커피 한 잔 기프티콘도 준비했어요 🎁
        </span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/illustrations/message-detail.svg" alt="" aria-hidden="true" width="71.487" height="68" className="shrink-0" />
    </>
  );

  const clicked = () => track("Home Banner Clicked", { banner: "review", destination: REVIEW_URL ? "survey" : "feedback" });

  return (
    <section aria-label="사용 후기 안내" className="px-6 pt-3 pb-2">
      {REVIEW_URL ? (
        <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" onClick={clicked} className={BOX}>
          {inner}
        </a>
      ) : (
        <>
          <button
            onClick={() => {
              clicked();
              setOpen(true);
            }}
            className={BOX}
          >
            {inner}
          </button>
          <FeedbackDialog open={open} onOpenChange={setOpen} />
        </>
      )}
    </section>
  );
}
