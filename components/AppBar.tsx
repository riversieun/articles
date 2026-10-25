"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileAvatar } from "./ProfileAvatar";
import { IconAvatar } from "./icons";
import { useStore } from "@/lib/store";

const TITLES: Record<string, string> = {
  "/archive": "아카이브",
};

/**
 * 탭 화면 공통 상단 바.
 * 탐색 탭: 서비스명(로고 자리) + 로그인 버튼 → 로그인 후 프로필.
 * 그 밖의 탭: 왼쪽에 페이지 타이틀만.
 */
export function AppBar() {
  const { ready, loggedIn } = useStore();
  const title = TITLES[usePathname()];

  if (title) {
    return (
      <div className="sticky top-0 z-30 flex h-14 items-center bg-surface px-5">
        <h1 className="m-0 text-headline font-bold tracking-headline">{title}</h1>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-surface px-5">
      <Link
        href="/"
        aria-label="Lume 홈"
        className="text-headline font-bold tracking-headline text-on-surface no-underline"
      >
        Lume
      </Link>

      {/* ready 전에는 자리만 확보해 로그인 ↔ 프로필 깜빡임을 막는다 */}
      <div className="flex h-11 items-center">
        {ready && (
          <Link
            href="/mypage"
            aria-label="프로필"
            className="flex size-11 items-center justify-center no-underline"
          >
            {loggedIn ? <ProfileAvatar size={32} /> : <IconAvatar size={32} />}
          </Link>
        )}
      </div>
    </div>
  );
}
