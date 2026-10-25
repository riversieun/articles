"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TOPICS, lib } from "@/lib/content";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { ArticleRow } from "./ArticleRow";

export function Feed() {
  const router = useRouter();
  const params = useSearchParams();

  const topic = params.get("topic") ?? "all";

  const go = (next: string) => {
    track("Feed Filter Selected", { topic: next });
    router.replace(next === "all" ? "/" : `/?topic=${next}`, { scroll: false });
  };

  const feed = lib.arts.filter((a) => topic === "all" || a.topic === topic);

  return (
    <div>
      <div className="ns sticky top-14 z-20 flex gap-2 overflow-x-auto bg-surface px-5 pb-3">
        {TOPICS.map(([key, label]) => {
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

      <div className="-mt-3 flex flex-col pb-4">
        {feed.map((a, i) => (
          <ArticleRow key={a.id} a={a} position={i} />
        ))}
      </div>
    </div>
  );
}
