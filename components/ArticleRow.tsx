"use client";

import Link from "next/link";
import { articleProps, track } from "@/lib/analytics";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { IconBookmark } from "./icons";

/** 피드의 글 한 줄. 오른쪽 아래 책갈피로 글을 저장한다. */
export function ArticleRow({ a, position }: { a: Article; position: number }) {
  const { notes, hl, savedA, toggleA } = useStore();

  // 내 기록 = 코멘트·읽고 난 생각 + 코멘트 없이 남긴 하이라이트
  const marks =
    notes.filter((n) => n.aid === a.id).length +
    Object.keys(hl).filter((sid) => lib.sent[sid]?.aid === a.id && !notes.some((n) => n.sid === sid)).length;
  const saved = !!savedA[a.id];

  return (
    <div className="relative border-t border-line">
      <Link
        href={`/contents/${a.id}`}
        onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "feed", position })}
        className="flex flex-col gap-[7px] px-5 pt-5 pb-[18px] text-left text-ink no-underline"
      >
        <span className="flex justify-between gap-2 text-[12.5px] text-sub">
          <span>{a.sourceLine}</span>
          <span>{a.date}</span>
        </span>
        <span lang="en" className="text-[21px] leading-[1.25] font-bold tracking-[-0.02em] [text-wrap:pretty]">
          {a.titleEn}
        </span>
        <span className="text-sm leading-normal text-sub">{a.titleKo}</span>
        <span className="mt-1 flex min-h-[26px] flex-wrap items-center gap-2 pr-11 text-[12.5px] font-medium">
          <span className="rounded-md bg-lime px-2 py-[3px]">주요 표현 {a.xs.length}개</span>
          {marks > 0 && <span className="rounded-md bg-lilac px-2 py-[3px]">내 기록 {marks}</span>}
        </span>
      </Link>
      <button
        onClick={() => toggleA(a.id)}
        aria-label={saved ? "글 저장 해제" : "글 저장"}
        aria-pressed={saved}
        className="absolute right-[9px] bottom-[9px] flex size-11 items-center justify-center border-0 bg-transparent text-ink"
      >
        <IconBookmark filled={saved} />
      </button>
    </div>
  );
}
