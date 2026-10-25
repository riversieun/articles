"use client";

import Link from "next/link";
import { articleProps, track } from "@/lib/analytics";
import { SOURCE_LABEL, TOPIC_LABEL, formatDate } from "@/lib/content";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { IconBookmark, IconSparkle } from "./icons";

/** 탐색 피드와 아카이브 "저장한 글"에서 쓰는 글 카드. 오른쪽 아래 책갈피로 글을 저장한다. */
export function ArticleRow({
  a,
  position,
  entryPoint = "feed",
}: {
  a: Article;
  position: number;
  entryPoint?: string;
}) {
  const { savedA, toggleA } = useStore();

  const saved = !!savedA[a.id];

  return (
    <div>
      {position > 0 && <div aria-hidden="true" className="mx-5 h-px bg-border" />}
      <Link
        href={`/contents/${a.id}`}
        onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: entryPoint, position })}
        className="flex flex-col gap-2 px-5 pt-6 text-left text-on-surface no-underline"
      >
        <span className="flex">
          <Badge variant="secondary" className="h-7 rounded-md px-3 text-label-sm">
            {TOPIC_LABEL[a.topic]}
          </Badge>
        </span>
        <span lang="en" className="text-headline font-bold tracking-headline [text-wrap:pretty]">
          {a.titleEn}
        </span>
        <span className="text-body-md text-on-surface-muted">{a.titleKo}</span>
      </Link>
      <div className="flex items-center justify-between gap-3 pt-1 pr-2.5 pb-3 pl-5">
        <span className="flex min-w-0 items-center gap-1 text-body-sm text-on-surface-muted">
          <IconSparkle className="shrink-0 text-on-surface" />
          <span className="truncate">
            <span className="text-on-surface">{SOURCE_LABEL[a.src]}</span> · {formatDate(a.date)}
          </span>
        </span>
        <button
          onClick={() => toggleA(a.id)}
          aria-label={saved ? "글 저장 해제" : "글 저장"}
          aria-pressed={saved}
          className={`flex size-11 shrink-0 items-center justify-center border-0 bg-transparent ${
            saved ? "text-on-surface" : "text-on-surface-muted"
          }`}
        >
          <IconBookmark filled={saved} />
        </button>
      </div>
    </div>
  );
}
