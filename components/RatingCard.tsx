"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { IconStar } from "./icons";

/** default(별 5개) → rated(고른 별까지 채움) → done("의견 감사합니다" + 체크 모션) → leaving(접힘) → gone */
type Phase = "idle" | "rated" | "done" | "leaving" | "gone";

const RATED_MS = 600; // 고른 별까지 채워진 모습을 보여주는 시간
const DONE_MS = 1800; // 체크 모션(0.25초 뒤 시작, 0.45초)이 끝나고 잠깐 더 머무는 시간
const LEAVE_MS = 350; // 카드가 접히며 사라지는 시간

/** 체크 원. 초록 원이 먼저 나타나고 흰 체크 선이 그려지듯 이어진다. (Figma 아티클 평가_Done 에셋) */
function CheckCircle() {
  return (
    <svg aria-hidden="true" width="36" height="36" viewBox="-1.5 -1.5 36 36" fill="none" className="check-pop">
      <circle cx="16.5" cy="16.5" r="15" strokeWidth="3" className="fill-brand stroke-brand" />
      <path
        d="M10.5002 17.2499L15.0002 21.7499L22.5002 12.7499"
        pathLength="1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="check-trace stroke-white"
      />
    </svg>
  );
}

/**
 * 아티클 본문 아래의 "이 아티클 얼마나 도움됐나요?" 별점 카드.
 * 별을 고르면 별이 채워졌다가 "의견 감사합니다"와 체크 모션이 나오고, 모션이 끝나면 카드가 접히며 사라진다.
 * 이미 평가한 글에서는 처음부터 보이지 않는다.
 */
export function RatingCard({ aid }: { aid: string }) {
  const { ready, rated, rateArticle } = useStore();
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState(0);
  const touched = useRef(false);

  useEffect(() => {
    const next: Partial<Record<Phase, [Phase, number]>> = {
      rated: ["done", RATED_MS],
      done: ["leaving", DONE_MS],
      leaving: ["gone", LEAVE_MS],
    };
    const step = next[phase];
    if (!step) return;
    const t = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [phase]);

  // 평가를 마친 글이거나 모션이 끝났으면 카드를 그리지 않는다. (저장된 기록은 불러온 뒤에야 알 수 있어서 ready 를 기다린다)
  if (!ready || phase === "gone" || (!touched.current && rated[aid])) return null;

  const pick = (n: number) => {
    if (phase !== "idle") return;
    touched.current = true;
    setValue(n);
    setPhase("rated");
    rateArticle(aid, n);
  };

  const leaving = phase === "leaving";

  return (
    <section
      aria-label="아티클 평가"
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
      style={{ gridTemplateRows: leaving ? "0fr" : "1fr", opacity: leaving ? 0 : 1 }}
    >
      <div className="overflow-hidden">
        <div className="flex items-center justify-center px-6 pt-5 pb-3">
          <div className="flex h-32 w-64 flex-col items-center justify-center rounded-box bg-pd-tint px-9 py-7">
            {phase === "done" || leaving ? (
              <div key="done" className="pop flex flex-col items-center">
                <p className="m-0 text-body-md leading-6 font-semibold tracking-body text-pd-ink-soft">의견 감사합니다</p>
                <div className="flex h-12 min-w-11 items-center justify-center p-3">
                  <CheckCircle />
                </div>
              </div>
            ) : (
              <div key="stars" className="flex flex-col items-center">
                <p className="m-0 text-body-md leading-6 font-semibold tracking-body text-pd-ink-soft">이 아티클 얼마나 도움됐나요?</p>
                <div role="group" aria-label="별점" className="flex min-w-11 items-center justify-center gap-0.5 p-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => pick(n)}
                      disabled={phase !== "idle"}
                      aria-label={`${n}점`}
                      className="relative flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 after:absolute after:-inset-1 after:content-['']"
                    >
                      <IconStar filled={n <= value} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
