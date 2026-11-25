"use client";

import { useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TOPICS, lib } from "@/lib/content";
import { track } from "@/lib/analytics";
import { ArticleRow } from "./ArticleRow";
import { ChipRow } from "./ChipRow";
import { FilterChip } from "./FilterChip";

/** 홈의 "더보기"로 들어올 때만 스크롤을 맨 위로 둔다(뒤로가기로 돌아올 때는 보던 위치를 지키려고 따로 표시한다) */
export const EXPLORE_TOP_KEY = "articles:explore-top";

/** 탐색 탭 필터. "최신"(= all)은 전체 글을 최신순으로 보여준다. */
const FILTERS: [key: string, label: string][] = [["all", "최신"], ...TOPICS];

/** 탐색 탭: 주제 필터 칩 + 글 목록. 필터는 주소의 ?topic= 으로 유지한다. */
export function Feed() {
  const router = useRouter();
  const params = useSearchParams();

  const topic = params.get("topic") ?? "all";

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(EXPLORE_TOP_KEY) === "1") {
        sessionStorage.removeItem(EXPLORE_TOP_KEY);
        window.scrollTo(0, 0);
      }
    } catch {
      /* 무시 */
    }
  }, []);

  const go = (next: string) => {
    track("Feed Filter Selected", { topic: next });
    router.replace(next === "all" ? "/explore" : `/explore?topic=${next}`, { scroll: false });
  };

  const feed = lib.arts
    .filter((a) => topic === "all" || a.topic === topic)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="tracking-body">
      <ChipRow className="ns sticky top-12 z-20 flex md:top-0 gap-2 overflow-x-auto bg-surface px-6 pt-2 pb-1">
        {FILTERS.map(([key, label]) => (
          <FilterChip key={key} on={topic === key} onClick={() => go(key)}>
            {label}
          </FilterChip>
        ))}
      </ChipRow>

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
