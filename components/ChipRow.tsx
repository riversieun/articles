"use client";

import { useEffect, useRef, type ReactNode } from "react";

const EDGE = 24; // 화면 좌우 여백(px-6)
const DURATION_MS = 320; // motion-lab 에서 H1(빠름)으로 확정
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** 줄 안에서 칩의 왼쪽·오른쪽 위치(스크롤 0 기준) */
function span(row: HTMLElement, el: HTMLElement) {
  const left = el.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
  return { left, right: left + el.offsetWidth };
}

/**
 * 눌린 칩과 그 이웃 칩이 모두 온전히 보이도록 필요한 만큼만 최소로 민 목표 위치.
 * 오른쪽 칩이면 다음 칩이, 왼쪽 칩이면 이전 칩이 전부 보이고, 줄 끝 칩은 끝에서 멈춘다. 이미 다 보이면 움직이지 않는다.
 */
function targetLeft(row: HTMLElement, chip: HTMLElement) {
  const max = row.scrollWidth - row.clientWidth;
  const cur = row.scrollLeft;
  const prev = chip.previousElementSibling as HTMLElement | null;
  const next = chip.nextElementSibling as HTMLElement | null;
  const need0 = prev ? span(row, prev).left - EDGE : 0;
  const need1 = next ? span(row, next).right + EDGE : row.scrollWidth;
  let to = cur;
  if (need0 < cur) to = need0;
  else if (need1 > cur + row.clientWidth) to = need1 - row.clientWidth;
  return Math.max(0, Math.min(max, to));
}

/**
 * 주제 칩 줄(홈·탐색). 가로로 스크롤되고, 칩을 누르면 화면 끝에 잘린 칩과 이웃 칩이 온전히 보이게 줄이 안쪽으로 이동한다.
 * 모션 줄이기 설정이면 애니메이션 없이 바로 이동하고, 줄을 직접 밀면 이동은 바로 멈춘다.
 */
export function ChipRow({ className, children }: { className?: string; children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const animateTo = (to: number) => {
    const row = rowRef.current;
    if (!row) return;
    cancelAnimationFrame(raf.current);
    const from = row.scrollLeft;
    if (Math.abs(to - from) < 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      row.scrollLeft = to;
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION_MS);
      row.scrollLeft = from + (to - from) * easeOut(p);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  return (
    <div
      ref={rowRef}
      className={className}
      onWheel={() => cancelAnimationFrame(raf.current)}
      onTouchStart={() => cancelAnimationFrame(raf.current)}
      onClick={(e) => {
        const row = rowRef.current;
        const chip = (e.target as HTMLElement).closest("button");
        if (!row || !chip || chip.parentElement !== row) return;
        animateTo(targetLeft(row, chip));
      }}
    >
      {children}
    </div>
  );
}
