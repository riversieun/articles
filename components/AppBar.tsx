"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_PROFILE } from "@/lib/profile";
import { useStore } from "@/lib/store";

const TITLES: Record<string, string> = {
  "/expressions": "저장한 표현",
  "/archive": "아카이브",
};

/**
 * 탭 화면 공통 상단 바.
 * 탐색 탭: 서비스명(로고 자리) + 로그인 버튼 → 로그인 후 프로필.
 * 그 밖의 탭: 왼쪽에 페이지 타이틀만.
 */
export function AppBar() {
  const { ready, loggedIn, openLogin } = useStore();
  const title = TITLES[usePathname()];

  if (title) {
    return (
      <div className="sticky top-0 z-30 flex h-14 items-center bg-paper px-5">
        <h1 className="m-0 text-2xl leading-[1.3] font-bold tracking-[-0.03em]">{title}</h1>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-paper px-5">
      <Link
        href="/"
        aria-label="Articles 홈"
        className="text-[22px] leading-none font-bold tracking-[-0.03em] text-ink no-underline"
      >
        Articles
      </Link>

      {/* ready 전에는 자리만 확보해 로그인 ↔ 프로필 깜빡임을 막는다 */}
      <div className="flex h-11 items-center">
        {ready &&
          (loggedIn ? (
            <Link
              href="/mypage"
              aria-label="마이페이지"
              className="flex size-11 items-center justify-center no-underline"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-lime text-[15px] font-bold text-ink">
                {MOCK_PROFILE.initial}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => openLogin("app_bar")}
              className="h-11 rounded-[22px] border-[1.5px] border-ink bg-white px-[18px] text-sm font-semibold text-ink"
            >
              로그인
            </button>
          ))}
      </div>
    </div>
  );
}
