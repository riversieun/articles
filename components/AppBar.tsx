"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { ProfileAvatar } from "./ProfileAvatar";
import { IconAvatar } from "./icons";
import { useStore } from "@/lib/store";

/**
 * 탭 화면 공통 상단 헤더. 서비스 로고(초록 별 포함) + 프로필 아이콘. 모든 해상도에서 유지한다.
 * - ~767px: 본문 컬럼(430px) 안에서 위에 붙는다(sticky).
 * - 768px~(md): 화면 전체 폭으로 펼쳐 위에 고정하고(fixed) 아래에 구분선을 둔다. 탭 이동만 좌측 내비(SideNav)가 맡는다.
 *   고정 높이 48px만큼의 자리는 탭 레이아웃이 위 여백으로 비워 둔다.
 */
export function AppBar() {
  const { ready, loggedIn } = useStore();
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between bg-surface pr-4 pl-6 md:fixed md:inset-x-0 md:border-b md:border-pd-line">
      <Logo />

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
    </header>
  );
}
