"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiCompassFill } from "@remixicon/react";
import { IconBookmark } from "./icons";

const TABS = [
  { href: "/", label: "탐색", icon: <RiCompassFill className="size-6" aria-hidden="true" /> },
  { href: "/archive", label: "아카이브", icon: <IconBookmark filled size={24} /> },
];

/** 화면 하단에 떠 있는 흰색 탭바. 채움 아이콘 위, 레이블 아래. 선택하면 primary, 아니면 subtle. */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="주요 탭"
      className="pointer-events-none fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-[430px] px-5"
    >
      <div className="pointer-events-auto mx-auto flex h-16 w-fit items-center gap-2 rounded-full bg-surface px-2 shadow-sm ring-1 ring-border">
        {TABS.map(({ href, label, icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex h-12 w-[88px] flex-col items-center justify-center gap-0.5 text-label-sm font-medium no-underline ${
                on ? "text-primary" : "text-on-surface-muted"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
