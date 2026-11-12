"use client";

import Link from "next/link";
import { articleProps, track } from "@/lib/analytics";
import { SOURCE_LABEL, formatDate } from "@/lib/content";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { IconBookmark, IconSparkle } from "./icons";

/** 출처 · 발행일 한 줄. 별 아이콘 + 출처, 점, 날짜 */
export function SourceLine({ a }: { a: Article }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-body-sm leading-4.5 tracking-body">
      <span className="flex shrink-0 items-center gap-0.5 text-pd-ink">
        <IconSparkle size={14} />
        {SOURCE_LABEL[a.src]}
      </span>
      <span aria-hidden="true" className="size-0.75 shrink-0 rounded-full bg-pd-dot" />
      <span className="truncate text-pd-ink-muted">{formatDate(a.date)}</span>
    </span>
  );
}

/** 글 저장 책갈피. 저장하면 브랜드 초록으로 채운다. 눈에 보이는 크기는 24px, 누르는 영역은 44px. */
export function SaveButton({ aid, className = "" }: { aid: string; className?: string }) {
  const { savedA, toggleA } = useStore();
  const saved = !!savedA[aid];
  return (
    <button
      onClick={() => toggleA(aid)}
      aria-label={saved ? "글 저장 해제" : "글 저장"}
      aria-pressed={saved}
      className={`flex size-11 shrink-0 items-center justify-center border-0 bg-transparent ${
        saved ? "text-brand" : "text-pd-ink"
      } ${className}`}
    >
      <IconBookmark filled={saved} size={20} />
    </button>
  );
}

/** 홈·탐색·아카이브 "저장한 글"에서 쓰는 글 카드. 한글 제목이 위, 영어 제목이 부제. 오른쪽 아래 책갈피로 글을 저장한다. */
export function ArticleRow({
  a,
  position,
  entryPoint = "feed",
}: {
  a: Article;
  position: number;
  entryPoint?: string;
}) {
  return (
    <div>
      {position > 0 && <div aria-hidden="true" className="mx-6 h-px bg-pd-line" />}
      <Link
        href={`/contents/${a.id}`}
        onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: entryPoint, position })}
        className="flex flex-col gap-1.5 px-6 pt-6 text-left text-pd-ink no-underline"
      >
        <span className="text-title-sm font-semibold tracking-body">{a.titleKo}</span>
        <span lang="en" className="text-body-md leading-6 tracking-body text-pd-ink-muted">
          {a.titleEn}
        </span>
      </Link>
      <div className="mt-3.5 mb-6 flex h-6 items-center justify-between gap-3 pr-3.5 pl-6">
        <SourceLine a={a} />
        <SaveButton aid={a.id} className="-my-2.5" />
      </div>
    </div>
  );
}
