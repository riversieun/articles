"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { setGuestState, track } from "@/lib/analytics";
import { useStore } from "@/lib/store";

/** 로그인 상태(is_guest)를 두 도구에 반영하고, 라우트가 바뀔 때마다 Page View 이벤트를 보낸다. */
export function Analytics() {
  const pathname = usePathname();
  const { ready, loggedIn } = useStore();
  const last = useRef("");

  // 저장된 로그인 상태를 읽은 뒤에 반영해야 첫 Page View부터 is_guest가 맞다. (아래 effect보다 먼저 선언)
  useEffect(() => {
    if (ready) setGuestState(!loggedIn);
  }, [ready, loggedIn]);

  useEffect(() => {
    if (!ready) return;
    // 개발 모드(Strict Mode)에서 effect가 두 번 도는 것을 막는다.
    if (last.current === pathname) return;
    last.current = pathname;
    const m = pathname.match(/^\/contents\/([^/]+)/);
    track("Page View", { path: pathname, ...(m ? { article_id: decodeURIComponent(m[1]) } : {}) });
  }, [pathname, ready]);

  return null;
}
