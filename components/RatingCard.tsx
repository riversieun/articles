"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useStore } from "@/lib/store";
import { STAR_PATH } from "./icons";
import "./rating-card.css";

/** default(별 5개) → rated(고른 별까지 채움) → done(감사 문구 + 체크) → leaving(접힘) → gone */
type Phase = "idle" | "rated" | "done" | "leaving" | "gone";

// motion-lab 의 F3(롤링 + 스프링, 기본 속도)에서 확정한 단계별 시간. 세부 속도 값은 rating-card.css 에 있다.
const RATED_MS = 700; // 고른 별까지 차오르는 스프링이 끝날 때까지
const DONE_MS = 1600; // 감사 문구와 체크가 머무는 시간
const LEAVE_MS = 340; // 카드가 접히며 사라지는 시간

/** 체크 원. 초록 원 위로 흰 체크 선이 그려지듯 이어진다. (Figma 아티클 평가_Done 에셋) */
function CheckSvg() {
  return (
    <svg aria-hidden="true" viewBox="-1.5 -1.5 36 36" fill="none">
      <circle className="c" cx="16.5" cy="16.5" r="15" />
      <path className="p" d="M10.5002 17.2499L15.0002 21.7499L22.5002 12.7499" pathLength="1" />
    </svg>
  );
}

/**
 * 아티클 본문 아래의 "이 아티클 얼마나 도움됐나요?" 별점 카드.
 * 별을 고르면 별이 스프링으로 차오르고, 문구가 롤링으로 "의견 감사합니다"로 바뀌며 체크가 그려진다.
 * 모션이 끝나면 카드가 접히며 사라지고, 이미 평가한 글에서는 처음부터 보이지 않는다.
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

  const done = phase === "done" || phase === "leaving";

  return (
    <section aria-label="아티클 평가" className="rc-slot" data-phase={phase}>
      <div className="rc-slot-inner">
        <div className="flex items-center justify-center px-6 pt-5 pb-3">
          <div className="rc-card" data-phase={phase} data-done={done}>
            <div className="rc-titlewin">
              <p className="rc-t rc-t1">이 아티클 얼마나 도움됐나요?</p>
              <p className="rc-t rc-t2" aria-hidden="true">
                의견 감사합니다
              </p>
            </div>
            <div className="rc-stage">
              <div className="rc-row" role="group" aria-label="별점">
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="rc-star"
                    data-on={i < value}
                    style={{ "--i": i } as CSSProperties}
                    disabled={phase !== "idle"}
                    aria-label={`${i + 1}점`}
                    onClick={() => pick(i + 1)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d={STAR_PATH} />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="rc-check">
                <CheckSvg />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        {done ? "의견 감사합니다" : ""}
      </span>
    </section>
  );
}
