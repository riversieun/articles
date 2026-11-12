"use client";

import { useEffect, useRef, useState } from "react";
import { articleProps, track } from "@/lib/analytics";

const COMPLETE_AT = 90; // 완독 기준: 본문 영역 스크롤 90% (PRD F-41의 95%에서 변경)

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * 읽기 진행률과 체류 시간 분석. 아티클 상세와 문장 병기 리더가 같이 쓴다.
 * 반환한 endRef 를 "본문 끝" 표식에 달면 그 위치까지의 스크롤 진행률이 progress(0~100)가 된다.
 */
export function useReadTracking(aid: string) {
  const [progress, setProgress] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const maxPctRef = useRef(0);
  const completedRef = useRef(false);

  // 상단 프로그레스: 본문 끝 표식까지의 스크롤 진행률
  useEffect(() => {
    const update = () => {
      const end = endRef.current;
      if (!end) return;
      const endTop = end.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, endTop - window.innerHeight + 40);
      const pct = Math.round(clamp(window.scrollY / span, 0, 1) * 100);
      setProgress(pct);
      maxPctRef.current = Math.max(maxPctRef.current, pct);
      if (pct >= COMPLETE_AT) {
        if (!completedRef.current) {
          completedRef.current = true;
          track("Article Completed", articleProps(aid));
        }
      }
    };
    maxPctRef.current = 0;
    completedRef.current = false;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [aid]);

  // 체류 시간: 탭이 보이는 동안만 센다. 글을 떠나거나 탭을 닫을 때 한 번 보낸다.
  useEffect(() => {
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let sent = false;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since = Date.now();
      } else if (since) {
        visibleMs += Date.now() - since;
        since = 0;
      }
    };
    const send = () => {
      if (sent) return;
      sent = true;
      if (since) visibleMs += Date.now() - since;
      if (visibleMs < 1000) return;
      track("Article Read", {
        ...articleProps(aid),
        seconds_visible: Math.round(visibleMs / 1000),
        max_scroll_pct: maxPctRef.current,
        completed: completedRef.current,
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", send);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", send);
      send();
    };
  }, [aid]);

  return { progress, endRef };
}
