"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ProfileAvatar } from "./ProfileAvatar";
import { IconAvatar } from "./icons";
import { TABS } from "./tabs";
import { useStore } from "@/lib/store";

const ITEM =
  "flex h-12 items-center gap-3 rounded-md px-3 text-body-md no-underline transition-colors hover:bg-pd-chip focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * 탭 화면의 좌측 내비(md, 768px 이상). 위에서부터 로고 · 홈/탐색/아카이브 · 프로필.
 * 폭 192px(w-48)은 `crumbit` 글자 로고가 들어가는 최소 폭이다. 모바일에서는 하단 탭바와 상단 앱 바가 대신한다.
 */
export function SideNav() {
  const pathname = usePathname();
  const { ready, loggedIn } = useStore();
  const onProfile = pathname.startsWith("/mypage");

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-y-0 left-0 z-40 hidden w-48 flex-col border-r border-pd-line bg-surface px-3 py-5 md:flex"
    >
      <div className="flex h-12 items-center px-3">
        <Logo />
      </div>

      <ul className="m-0 mt-6 flex list-none flex-col gap-1 p-0">
        {TABS.map(({ href, label, icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={`${ITEM} ${on ? "font-semibold text-pd-ink" : "text-pd-ink-muted"}`}
              >
                {icon}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ready 전에는 자리만 확보해 로그인 ↔ 프로필 깜빡임을 막는다 */}
      <div className="mt-auto h-12">
        {ready && (
          <Link
            href="/mypage"
            aria-current={onProfile ? "page" : undefined}
            className={`${ITEM} ${onProfile ? "font-semibold text-pd-ink" : "text-pd-ink-muted"}`}
          >
            {loggedIn ? <ProfileAvatar size={32} /> : <IconAvatar size={32} />}
            프로필
          </Link>
        )}
      </div>
    </nav>
  );
}
