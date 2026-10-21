"use client";

import { useStore } from "@/lib/store";

/** 로그인하지 않은 상태에서 기록이 있을 때, 기록이 이 기기에만 있음을 알리고 백업을 제안한다. */
export function GuestNotice() {
  const { loggedIn, hasRecords, openLogin } = useStore();
  if (loggedIn || !hasRecords) return null;

  return (
    <div className="mx-5 mb-4 flex items-center justify-between gap-3 rounded-2xl bg-panel py-1 pr-2 pl-4 text-[13.5px] leading-normal text-sub">
      <span>지금 기록은 이 기기에만 저장돼 있어요.</span>
      <button
        onClick={openLogin}
        className="min-h-11 shrink-0 border-0 bg-transparent px-2 text-[13.5px] font-semibold text-ink underline underline-offset-4"
      >
        백업하기
      </button>
    </div>
  );
}
