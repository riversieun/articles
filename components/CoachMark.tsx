"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useStore } from "@/lib/store";

const STEPS: [title: string, body: string][] = [
  ["추천하기", "다른 사람에게도 도움이 될 내용이라면 추천을 눌러주세요."],
  ["내 생각 기록", "나만의 생각을 기록하고 쌓아가며 인사이트를 늘려요."],
  ["아티클 저장", "인상적인 아티클은 저장하고 아카이브에서 꺼내 읽어요."],
];

/** 막 색. 검정(#1E1E28) 40%. 예전 시안의 60%보다 밝게(2026-11-23) */
const SCRIM = "rgba(30,30,40,0.4)";
const TIP_W = 300;
const CARET_W = 20;
const CARET_H = 10;
const TIP_GAP = 8;
const PILL_EXTRA = 12; // 버튼 폭(44) + 12 = 56

type R = { x: number; y: number; w: number; h: number };
type Rects = { bar: R; btns: R[] };

const rectOf = (el: Element): R => {
  const b = el.getBoundingClientRect();
  return { x: b.left, y: b.top, w: b.width, h: b.height };
};

/**
 * 아티클 상세 하단 플로팅 바 첫 방문 안내(말풍선 순차 투어, 3단계).
 * 막 위에 바만 구멍을 내고, 지금 설명하는 버튼 뒤에 연초록 알약을 깔고 나머지 버튼은 흐리게 한다.
 * 건너뛰기는 없고 "다음"으로만 넘어간다. 단계는 "1/3"처럼 숫자로 보여준다. 처음 나타날 때 이미 본 것으로 기록한다.
 */
export function CoachMark() {
  const [step, setStep] = useState<number | null>(null); // null: 안 보임
  const [rects, setRects] = useState<Rects | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { coach } = useStore();
  const started = useRef(false);

  // 처음 방문이면 시작. 로그인 계정의 "봤음" 기록까지 확인한 뒤에 정한다(다른 기기에서 본 사람에게 다시 뜨지 않게).
  // 시작한 뒤에는 "봤음"이 기록돼도 끊지 않는다. 다른 화면 안에 끼워 넣은 미리보기(iframe)에서는 띄우지 않는다.
  useEffect(() => {
    if (started.current || !coach.ready || coach.seen) return;
    if (window.self !== window.top) return;
    started.current = true;
    setStep(0);
  }, [coach.ready, coach.seen]);

  const active = step !== null && step < 3;

  // 바 버튼 위치를 읽는다(크기 변화·불러오는 중 대응)
  useEffect(() => {
    if (!active) return;
    const read = () => {
      const bar = document.querySelector(".fb-bar > div");
      const btns = [...document.querySelectorAll(".fb-bar .fb-btn")];
      if (!bar || btns.length < 3) return;
      const next = { bar: rectOf(bar), btns: btns.slice(0, 3).map(rectOf) };
      setRects((prev) =>
        JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
      );
      setVp({ w: window.innerWidth, h: window.innerHeight });
    };
    read();
    const t = setInterval(read, 250);
    window.addEventListener("resize", read);
    return () => {
      clearInterval(t);
      window.removeEventListener("resize", read);
    };
  }, [active]);

  // 투어 중에는 본문이 스크롤되지 않게 한다
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // 설명하는 버튼 말고는 흐리게
  useEffect(() => {
    if (!active || step === null) return;
    const btns = [...document.querySelectorAll<HTMLElement>(".fb-bar .fb-btn")];
    btns.forEach((b, i) => {
      b.style.transition = "opacity 240ms ease-out";
      b.style.opacity = i === step ? "" : "0.35";
    });
    return () => btns.forEach((b) => (b.style.opacity = ""));
  }, [active, step, rects]);

  // 단계가 보일 때: 기록·분석, 버튼으로 초점
  useEffect(() => {
    if (!active || step === null || !rects) return;
    if (step === 0) coach.markSeen();
    track("Coach Mark Step Viewed", { step: step + 1 });
    ctaRef.current?.focus({ preventScroll: true });
    // 단계가 바뀔 때마다 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step, rects !== null]);

  if (!active || step === null || !rects) return null;

  const target = rects.btns[step];
  const cx = target.x + target.w / 2;
  const cy = target.y + target.h / 2;
  const tipW = Math.min(TIP_W, vp.w - 32);
  const left = Math.min(Math.max(cx - tipW / 2, 16), vp.w - 16 - tipW);
  const bottom = vp.h - rects.bar.y + TIP_GAP + CARET_H;
  const last = step === 2;

  const next = () => {
    if (last) {
      track("Coach Mark Completed");
      setStep(3);
    } else setStep(step + 1);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="아티클 사용 안내"
        className="fixed inset-0 z-50"
      >
        {/* 막: 바만 구멍. 본문을 누르거나 스크롤해도 아무 일도 없다 */}
        <svg className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <mask id="coach-hole">
              <rect width="100%" height="100%" fill="#fff" />
              <rect
                x={rects.bar.x}
                y={rects.bar.y}
                width={rects.bar.w}
                height={rects.bar.h}
                rx={rects.bar.h / 2}
                fill="#000"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={SCRIM}
            mask="url(#coach-hole)"
          />
        </svg>
        <div
          className="absolute rounded-box bg-surface px-5 py-5 text-on-surface shadow-[0_12px_28px_rgba(30,30,40,0.28)] transition-[left] duration-360 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{ left, bottom, width: tipW }}
        >
          <p className="m-0 text-title-sm font-bold tracking-body">
            {STEPS[step][0]}
          </p>
          <p className="mt-3 mb-0 text-body-md leading-6 tracking-body text-on-surface-muted [word-break:keep-all]">
            {STEPS[step][1]}
          </p>
          <div className="mt-5 flex items-center justify-between gap-2">
            <span
              className="text-body-sm text-on-surface-muted"
              aria-label={`${step + 1}단계, 전체 3단계`}
            >
              {step + 1}/3
            </span>
            {/* 눈에 보이는 높이는 40px, 눌리는 영역(투명)은 44px */}
            <button
              ref={ctaRef}
              type="button"
              onClick={next}
              className="relative h-10 cursor-pointer rounded-full border-0 bg-brand px-5 text-label-md font-semibold whitespace-nowrap text-on-accent after:absolute after:-inset-0.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface active:scale-[0.97] motion-reduce:active:scale-100"
            >
              {last ? "알겠어요" : "다음"}
            </button>
          </div>
          <span
            aria-hidden="true"
            className="absolute top-full bg-surface transition-[left] duration-360 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{
              left: cx - left - CARET_W / 2,
              width: CARET_W,
              height: CARET_H,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>
      </div>
      {/* 강조 알약(플로팅 바와 같은 모양). 막 안에 두면 곱하기가 바까지 닿지 않아 바깥에 둔다 */}
      <span
        aria-hidden="true"
        className="pointer-events-none fixed z-50 rounded-full bg-brand-tint mix-blend-multiply transition-[left,width] duration-360 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{
          left: cx - (target.w + PILL_EXTRA) / 2,
          top: cy - target.h / 2,
          width: target.w + PILL_EXTRA,
          height: target.h,
        }}
      />
    </>
  );
}
