"use client";

import { useEffect, useState, type RefObject } from "react";

const TOP_ZONE = 56; // 맨 위 근처에서는 항상 보인다(px)
const MIN_STEP = 8; // 이만큼 이상 움직여야 방향이 바뀐 것으로 본다(손떨림·트랙패드 잔진동 무시)

/**
 * 아티클 상세의 떠 있는 UI(앱 바·플로팅 바)를 스크롤 방향에 맞춰 숨기고 보여 준다.
 * - 내려 읽는 중이면 hidden = true (앱 바는 위로, 플로팅 바는 아래로 들어간다)
 * - 올리면 다시 나온다
 * - 본문 끝 표식(endRef)이 화면에 들어오면 다 읽은 것이라 atEnd = true (플로팅 바만 다시 나온다)
 * 값만 계산한다. 움직임은 transform transition 이라 중간에 방향이 바뀌어도 그 자리에서 되돌아간다.
 */
export function useScrollChrome(endRef: RefObject<HTMLElement | null>) {
  const [hidden, setHidden] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // iOS 의 고무줄 스크롤(맨 위·아래를 넘어간 값)은 방향으로 치지 않는다
      const y = Math.max(0, Math.min(max, window.scrollY));

      const end = endRef.current;
      if (end) setAtEnd(end.getBoundingClientRect().top <= window.innerHeight);

      if (y <= TOP_ZONE) {
        setHidden(false);
        lastY = y;
        return;
      }
      const dy = y - lastY;
      if (Math.abs(dy) < MIN_STEP) return;
      setHidden(dy > 0);
      lastY = y;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [endRef]);

  return { hidden, atEnd };
}
