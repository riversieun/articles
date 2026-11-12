"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TOPICS, lib } from "@/lib/content";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { ArticleRow } from "./ArticleRow";

/** 탐색 탭 필터. "최신"(= all)은 전체 글을 최신순으로 보여준다. */
const FILTERS: [key: string, label: string][] = [["all", "최신"], ...TOPICS];

/** 탐색 탭: 주제 필터 칩 + 글 목록. 필터는 주소의 ?topic= 으로 유지한다. */
export function Feed() {
  const router = useRouter();
  const params = useSearchParams();

  const topic = params.get("topic") ?? "all";

  const go = (next: string) => {
    track("Feed Filter Selected", { topic: next });
    router.replace(next === "all" ? "/explore" : `/explore?topic=${next}`, { scroll: false });
  };

  const feed = lib.arts
    .filter((a) => topic === "all" || a.topic === topic)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="tracking-body">
      <div className="ns sticky top-12 z-20 flex gap-2 overflow-x-auto bg-surface px-6 pt-2 pb-4">
        {FILTERS.map(([key, label]) => {
          const on = topic === key;
          return (
            <Button
              key={key}
              variant={on ? "default" : "secondary"}
              aria-pressed={on}
              onClick={() => go(key)}
              className="shrink-0 px-4"
            >
              {label}
            </Button>
          );
        })}
      </div>

      {feed.length > 0 ? (
        <div className="flex flex-col pb-4">
          {feed.map((a, i) => (
            <ArticleRow key={a.id} a={a} position={i} />
          ))}
        </div>
      ) : (
        <p className="m-0 px-6 py-12 text-center text-body-md text-on-surface-muted">아직 이 주제의 글이 없어요</p>
      )}
    </div>
  );
}
