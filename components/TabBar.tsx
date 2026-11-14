"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBookmark, IconCompassFill, IconHomeFill } from "./icons";

const TABS = [
  { href: "/", label: "홈", icon: <IconHomeFill /> },
  { href: "/explore", label: "탐색", icon: <IconCompassFill /> },
  { href: "/archive", label: "아카이브", icon: <IconBookmark filled size={24} /> },
];

function useCompactTabBar() {
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const scrollY = Math.max(window.scrollY, 0);
      const delta = scrollY - lastScrollY.current;

      if (scrollY <= 24) {
        setIsCompact(false);
      } else if (delta > 2) {
        setIsCompact(true);
      } else if (delta < -2) {
        setIsCompact(false);
      }

      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isCompact;
}

/**
 * 화면 하단에 떠 있는 흰색 탭바(홈·탐색·아카이브). 채움 아이콘 위, 레이블 아래. 선택하면 primary, 아니면 subtle.
 * 아래로 스크롤하면 레이블을 숨기며 작아지고, 위로 스크롤하거나 화면 상단으로 돌아오면 원래대로 돌아온다.
 * 폭은 애니메이션을 위해 고정값이다: 탭 3개 × 88px + 간격 2 × 8px + 좌우 여백 16px = 296px, 줄어들면 탭 78px 기준 266px.
 */
export function TabBar() {
  const pathname = usePathname();
  const isCompact = useCompactTabBar();

  return (
    <nav
      aria-label="주요 탭"
      data-compact={isCompact}
      className="pointer-events-none fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-[430px] px-5"
    >
      <div
        className={`tab-bar-motion pointer-events-auto mx-auto flex items-center gap-2 overflow-hidden rounded-full bg-surface px-2 shadow-sm ring-1 ring-border transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCompact ? "h-14 w-[266px]" : "h-16 w-[296px]"
        }`}
      >
        {TABS.map(({ href, label, icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`tab-bar-motion flex h-12 flex-col items-center justify-center gap-0.5 text-label-sm font-medium no-underline transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCompact ? "w-[78px]" : "w-[88px]"
              } ${
                on ? "text-pd-ink" : "text-subtle"
              }`}
            >
              {icon}
              <span
                className={`tab-bar-motion overflow-hidden whitespace-nowrap transition-[max-height,opacity,transform] duration-200 ease-out ${
                  isCompact ? "max-h-0 -translate-y-1 opacity-0" : "max-h-5 translate-y-0 opacity-100"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
