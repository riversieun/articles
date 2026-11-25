"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "./tabs";

/**
 * 탭 이동 내비(LNB). 하단 탭바(~767px)가 768px 이상에서 왼쪽으로 옮겨 온 것으로, 로고·프로필은 상단 헤더(AppBar)에 그대로 둔다.
 * - 768~959px(md): 폭 80px 레일. 아이콘 위·라벨 아래(하단 탭바와 같은 모양), 항목 64×64px, 간격 16px.
 * - 960px~(lg): 폭 192px 사이드바. 아이콘 옆 라벨, 항목 높이 48px.
 * 헤더(48px) 아래에서 화면 바닥까지 붙어 있고, 첫 항목은 본문 첫 줄과 같은 높이(위 20px)에서 시작한다.
 */
export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 탭"
      className="fixed top-12 bottom-0 left-0 z-20 hidden w-20 flex-col border-r border-pd-line bg-surface px-2 pt-5 md:flex lg:w-48 lg:px-3"
    >
      <ul className="m-0 flex list-none flex-col gap-4 p-0 lg:gap-1">
        {TABS.map(({ href, label, icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 rounded-md text-label-sm no-underline transition-colors hover:bg-pd-chip focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-body-md ${
                  on ? "font-semibold text-pd-ink" : "font-medium text-subtle"
                }`}
              >
                {icon}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
