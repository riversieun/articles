"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FILTERS, lib } from "@/lib/content";
import { track } from "@/lib/analytics";
import { useStore } from "@/lib/store";
import { ArticleRow } from "./ArticleRow";

export function Feed() {
  const router = useRouter();
  const params = useSearchParams();
  const { loadSample, resetAll } = useStore();

  const src = params.get("src") ?? "all";

  const go = (next: string) => {
    track("Feed Filter Selected", { source: next });
    router.replace(next === "all" ? "/" : `/?src=${next}`, { scroll: false });
  };

  const filters = FILTERS;
  const feed = lib.arts.filter((a) => src === "all" || a.src === src);

  return (
    <div>
      <div className="ns flex gap-2 overflow-x-auto px-5">
        {filters.map(([key, label]) => {
          const on = src === key;
          return (
            <button
              key={key}
              aria-pressed={on}
              onClick={() => go(key)}
              className={`h-11 shrink-0 rounded-[22px] border px-4 text-sm font-medium whitespace-nowrap ${
                on ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-col">
        {feed.map((a, i) => (
          <ArticleRow key={a.id} a={a} position={i} />
        ))}
      </div>

      <footer className="mx-5 mt-4 mb-8 rounded-[16px] bg-panel px-4 py-3.5 text-[12.5px] leading-[1.6] text-sub">
        <div className="font-semibold text-ink">프로토타입 안내</div>
        <p className="m-0 mt-1">
          이 화면의 글·번역·출처 표기는 UI 확인용 샘플이며 실제 원문이 아닙니다. 기록은 이 브라우저의
          localStorage에만 저장됩니다.
        </p>
        <div className="mt-2.5 flex gap-2">
          <button
            onClick={loadSample}
            className="h-11 rounded-[22px] border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink"
          >
            샘플 기록 채우기
          </button>
          <button
            onClick={resetAll}
            className="h-11 rounded-[22px] border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink"
          >
            기록 초기화
          </button>
        </div>
      </footer>
    </div>
  );
}
