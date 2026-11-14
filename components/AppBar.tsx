"use client";

import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { IconAvatar, IconSparkle } from "./icons";
import { useStore } from "@/lib/store";

/**
 * 탭 화면 공통 상단 바.
 * 홈·탐색·아카이브 탭 모두 서비스 로고(초록 별 포함) + 프로필 아이콘.
 */
export function AppBar() {
  const { ready, loggedIn } = useStore();
  return (
    <div className="sticky top-0 z-30 flex h-12 items-center justify-between bg-surface pr-4 pl-6">
      <Link
        href="/"
        aria-label="crumbit 홈"
        className="relative font-logo text-headline font-bold tracking-display text-pd-ink no-underline"
      >
        crumbit
        <IconSparkle size={12} className="absolute top-0 -right-2.5 text-brand" />
      </Link>

      {/* ready 전에는 자리만 확보해 로그인 ↔ 프로필 깜빡임을 막는다 */}
      <div className="flex h-11 items-center">
        {ready && (
          <Link
            href="/mypage"
            aria-label="프로필"
            className="mr-0.5 flex size-11 items-center justify-center no-underline"
          >
            {loggedIn ? <ProfileAvatar size={32} /> : <IconAvatar size={32} />}
          </Link>
        )}
      </div>
    </div>
  );
}
