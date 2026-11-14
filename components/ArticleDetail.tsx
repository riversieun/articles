"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { articleProps, track } from "@/lib/analytics";
import { TOPIC_LABEL, lib } from "@/lib/content";
import { goBackInApp } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { useReadTracking } from "@/lib/useReadTracking";
import { useScrollChrome } from "@/lib/useScrollChrome";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackDialog } from "./FeedbackDialog";
import { RatingCard } from "./RatingCard";
import { SourceLine } from "./ArticleRow";
import { IconArrowUpRight, IconBack, IconBookmark, IconPenEdit, IconSparkle, IconThumbUp } from "./icons";

const SECTION = "flex flex-col gap-5 px-6 pt-8 pb-10";
const HEADING = "m-0 text-heading font-bold tracking-display text-pd-ink";
const FOOTER_BUTTON = "h-11.5 rounded-md border-pd-line px-4 text-body-md font-semibold text-pd-ink-soft";

/**
 * 아티클 상세(요약형). 한 줄 요약 → 핵심 인사이트 → 원문 인용 → 업무 적용 → 별점 카드 → 피드백·원문 읽기.
 * 하단에 떠 있는 바에 추천해요(엄지 척, 1개 이상일 때만 숫자) · 내 생각 기록 · 저장이 있다.
 * 문장 병기 읽기(하이라이트·코멘트)는 이 화면에서 쓰지 않는다. 기능은 /contents/[id]/read 에 그대로 있다.
 */
export function ArticleDetail({ aid }: { aid: string }) {
  const art = lib.byId[aid];
  const router = useRouter();
  const { liked, savedA, toggleLike, toggleA, openThought, likeCount, refreshLikeCounts } = useStore();
  const { progress, endRef } = useReadTracking(aid);
  const { hidden, atEnd } = useScrollChrome(endRef);
  const showBar = !hidden || atEnd; // 내려 읽는 중에는 숨고, 끝까지 읽으면 다시 나온다
  const [fbOpen, setFbOpen] = useState(false);

  // 열 때마다 서버의 추천 수를 새로 받아온다
  useEffect(() => {
    void refreshLikeCounts();
  }, [refreshLikeCounts, aid]);

  const isLiked = !!liked[aid];
  const isSaved = !!savedA[aid];
  const count = likeCount(aid);

  return (
    <div className="min-h-dvh bg-surface tracking-body">
      {/* 상단 고정: 뒤로가기 + 읽기 진행(초록 선). 내려 읽으면 앱 바는 위로 들어가고 초록 선만 맨 위에 남는다. */}
      <div className="pointer-events-none sticky top-0 z-30">
        <div
          className={cn(
            "pointer-events-auto transition-transform ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            hidden ? "-translate-y-12 duration-220" : "duration-300",
          )}
        >
          <div inert={hidden} className="flex h-12 items-center justify-between bg-surface px-3">
            <button
              onClick={() => goBackInApp(router)}
              aria-label="목록으로 돌아가기"
              className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-pd-ink"
            >
              <IconBack size={22} sw={1.75} />
            </button>
          </div>
          <div
            role="progressbar"
            aria-label="읽은 정도"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-0.5 bg-surface"
          >
            <div className="h-0.5 bg-brand transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <article>
        <header className="flex flex-col gap-4.5 bg-pd-tint px-6 py-5">
          <span className="w-fit rounded-sm bg-brand-tint px-2.5 py-1.5 text-body-sm leading-4.5 font-medium text-brand-strong">
            {TOPIC_LABEL[art.topic]}
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="m-0 text-title font-bold text-pd-ink">{art.titleKo}</h1>
            <p lang="en" className="m-0 text-body-md leading-6 text-pd-ink-muted">
              {art.titleEn}
            </p>
          </div>
          <div className="flex h-6 items-center">
            <SourceLine a={art} large />
          </div>
        </header>

        <section aria-label="한 줄 요약" className="flex flex-col px-6 pt-8 pb-5">
          <div className="flex flex-col gap-3 rounded-panel border border-pd-line bg-pd-tint px-2 pt-4 pb-2">
            <div className="flex items-center gap-0.5 px-2">
              <span className="relative size-4.5 shrink-0 overflow-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/text-description.svg"
                  alt=""
                  aria-hidden="true"
                  width="15.075"
                  height="11.8"
                  className="absolute max-w-none"
                  style={{ left: 1.74, top: 4.2 }}
                />
              </span>
              <h2 className="m-0 text-body-sm leading-4.5 font-semibold text-pd-label">한 줄 요약</h2>
            </div>
            <p className="m-0 rounded-md bg-surface p-4 text-body-md leading-6 text-pd-ink [word-break:normal]">{art.summary}</p>
          </div>
        </section>

        {art.insights.length > 0 && (
          <section className={SECTION}>
            <h2 className={HEADING}>핵심 인사이트예요</h2>
            <ol className="m-0 flex list-none flex-col gap-7 p-0">
              {art.insights.map((it, i) => (
                <li key={i} className="flex flex-col gap-2">
                  <span className="text-body-md leading-6.25 font-bold text-brand-soft">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-title-sm font-bold text-pd-ink">{it.title}</h3>
                    <p className="m-0 text-body-md leading-6 text-pd-ink">{it.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {art.quotes.length > 0 && (
          <section className={SECTION}>
            <h2 className={HEADING}>원문은 이렇게 말해요</h2>
            <div className="flex flex-col gap-5">
              {art.quotes.map((q, i) => (
                <blockquote key={i} className="m-0 flex flex-col gap-2.5 border-0 border-l-2 border-solid border-brand-soft pl-4">
                  <p lang="en" className="m-0 font-quote text-body-lg leading-6 text-pd-ink italic">
                    “{q.en}”
                  </p>
                  <p className="m-0 text-body-sm leading-5.25 text-pd-ink-soft">{q.ko}</p>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {art.actions.length > 0 && (
          <section className={SECTION}>
            <h2 className={HEADING}>업무에 적용해보세요</h2>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {art.actions.map((t, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="flex size-5.5 shrink-0 items-center justify-center text-brand-soft">
                    <IconSparkle size={18} />
                  </span>
                  <span className="min-w-0 flex-1 text-body-md leading-6 text-pd-ink">{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 본문 끝 표식 — 프로그레스 100%의 기준 */}
        <div ref={endRef} />

        <RatingCard aid={aid} />

        <div className="flex items-center justify-center gap-3 px-6 pt-5 pb-25">
          <button onClick={() => setFbOpen(true)} className={cn(buttonVariants({ variant: "outline" }), FOOTER_BUTTON)}>
            피드백 보내기
          </button>
          <a
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("Original Article Clicked", articleProps(aid))}
            className={cn(buttonVariants({ variant: "outline" }), FOOTER_BUTTON, "gap-1 no-underline")}
          >
            원문 읽기
            <IconArrowUpRight />
          </a>
        </div>
      </article>

      {/* 하단에 떠 있는 바: 추천해요(엄지) · 내 생각 기록 · 저장 */}
      <div
        inert={!showBar}
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto flex w-full max-w-[430px] justify-center px-6 transition-[transform,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-opacity",
          showBar ? "duration-300" : "translate-y-[calc(100%+24px)] opacity-0 duration-220 motion-reduce:translate-y-0",
        )}
      >
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-surface px-4 py-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => toggleLike(aid)}
            aria-label={count > 0 ? `추천해요 ${count}` : "추천해요"}
            aria-pressed={isLiked}
            className={`flex h-11 min-w-11 items-center justify-center gap-1 border-0 bg-transparent ${isLiked ? "text-brand" : "text-pd-ink"}`}
          >
            <IconThumbUp filled={isLiked} />
            {count > 0 && <span className="text-body-sm leading-4.5 tracking-body text-pd-ink-muted">{count}</span>}
          </button>
          <button
            onClick={() => openThought(aid)}
            aria-label="내 생각 기록"
            className="flex size-11 items-center justify-center border-0 bg-transparent text-pd-ink"
          >
            <IconPenEdit />
          </button>
          <button
            onClick={() => toggleA(aid)}
            aria-label={isSaved ? "글 저장 해제" : "글 저장"}
            aria-pressed={isSaved}
            className={`flex size-11 items-center justify-center border-0 bg-transparent ${isSaved ? "text-brand" : "text-pd-ink"}`}
          >
            <IconBookmark filled={isSaved} size={20} />
          </button>
        </div>
      </div>

      <FeedbackDialog open={fbOpen} onOpenChange={setFbOpen} />
    </div>
  );
}
