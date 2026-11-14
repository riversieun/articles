"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { TOPICS, lib } from "@/lib/content";
import { articleProps, track } from "@/lib/analytics";
import type { Article, TopicKey } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArticleRow, SaveButton, SourceLine } from "./ArticleRow";
import { FilterChip } from "./FilterChip";
import { ReviewBanner } from "./ReviewBanner";

/** 홈 위쪽 캐러셀에 올리는 최신 글 개수 */
const HERO_COUNT = 3;
/** 주제별 보기에서 한 번에 보여주는 글 개수. 더 있으면 "더보기"로 탐색 탭에 보낸다. */
const TOPIC_LIMIT = 3;

/** 최신 등록 글 카드. 위쪽 가운데에 초록 빛이 번지는 면 위에 제목·출처를 올린다. 높이는 200px 이상(Figma 홈 프레임). */
function HeroCard({ a, position }: { a: Article; position: number }) {
  return (
    <div
      className="flex min-h-50 w-full shrink-0 snap-start flex-col gap-5 rounded-hero px-6 pt-5 pb-6"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 71.5% 91.8% at 50% -8.2%, var(--color-pd-glow) 0%, var(--color-pd-glow-mid) 36.058%, var(--color-pd-glow-soft) 57.059%, var(--color-pd-tint) 100%)",
      }}
    >
      <p className="m-0 text-center text-body-sm leading-4.5 font-medium tracking-body text-brand-strong">새로 등록된 글</p>
      <div className="flex flex-1 flex-col justify-between gap-3.5">
        <Link
          href={`/contents/${a.id}`}
          onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "home_new", position })}
          className="flex flex-col gap-1.5 text-left text-pd-ink no-underline"
        >
          <span className="text-title-md font-semibold tracking-body">{a.titleKo}</span>
          <span lang="en" className="text-body-md leading-6 tracking-body text-pd-ink-muted">
            {a.titleEn}
          </span>
        </Link>
        <div className="flex h-6 items-center justify-between gap-3">
          <SourceLine a={a} />
          <SaveButton aid={a.id} className="-my-2.5 -mr-2.5" />
        </div>
      </div>
    </div>
  );
}

/**
 * 홈 탭. 새로 등록된 글 캐러셀 → 사용 후기 배너 → 주제별 보기(칩 + 글 3개 + 더보기).
 * "주목할 만한 아티클"(좋아요 순위)은 이번 배포에 넣지 않는다. 좋아요 데이터가 쌓인 뒤에 추가한다.
 */
export function Home() {
  const router = useRouter();
  // 처음에는 첫 번째 칩이 선택돼 있다
  const [topic, setTopic] = useState<TopicKey>(TOPICS[0][0]);
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const latest = [...lib.arts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, HERO_COUNT);
  const inTopic = lib.arts.filter((a) => a.topic === topic).sort((a, b) => b.date.localeCompare(a.date));
  const shown = inTopic.slice(0, TOPIC_LIMIT);

  const onScroll = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    // 카드 폭 + 카드 사이 간격(12px)만큼 넘기면 한 장
    setSlide(Math.round(el.scrollLeft / (first.offsetWidth + 12)));
  };

  const pick = (next: TopicKey) => {
    track("Feed Filter Selected", { topic: next, entry_point: "home" });
    setTopic(next);
  };

  return (
    <div className="tracking-body">
      <section aria-label="새로 등록된 글" className="flex flex-col gap-1 py-2">
        {/* 좌우 여백 24px 안에서 카드 한 장 폭으로 넘기고, 다음 카드의 끝이 12px쯤 보인다 */}
        <div ref={trackRef} onScroll={onScroll} className="ns flex scroll-px-6 snap-x snap-mandatory gap-3 overflow-x-auto px-6">
          {latest.map((a, i) => (
            <HeroCard key={a.id} a={a} position={i} />
          ))}
        </div>
        {latest.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-3 pb-2" aria-hidden="true">
            {latest.map((a, i) => (
              <span key={a.id} className={`size-2 rounded-full ${i === slide ? "bg-pd-ink-muted" : "bg-border-strong"}`} />
            ))}
          </div>
        )}
      </section>

      <ReviewBanner />

      <section aria-labelledby="home-topics">
        <h2 id="home-topics" className="m-0 px-6 pt-8 pb-3 text-title leading-7 font-semibold tracking-display text-pd-ink">
          주제별 보기
        </h2>
        <div className="ns flex gap-2 overflow-x-auto px-6 pt-3 pb-1">
          {TOPICS.map(([key, label]) => (
            <FilterChip key={key} on={topic === key} onClick={() => pick(key)}>
              {label}
            </FilterChip>
          ))}
        </div>

        {shown.length > 0 ? (
          <div className="flex flex-col">
            {shown.map((a, i) => (
              <ArticleRow key={a.id} a={a} position={i} entryPoint="home_topic" />
            ))}
          </div>
        ) : (
          <p className="m-0 px-6 py-12 text-center text-body-md text-on-surface-muted">아직 이 주제의 글이 없어요</p>
        )}

        {inTopic.length > TOPIC_LIMIT && (
          <div className="px-6">
            <Button
              variant="secondary"
              onClick={() => router.push(`/explore?topic=${topic}`)}
              className="h-13 w-full rounded-panel bg-pd-tint text-pd-ink hover:bg-pd-tint"
            >
              더보기
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
