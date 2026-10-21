"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** 라우트가 바뀔 때마다 Page View 이벤트를 보낸다. */
export function Analytics() {
  const pathname = usePathname();
  const last = useRef("");

  useEffect(() => {
    // 개발 모드(Strict Mode)에서 effect가 두 번 도는 것을 막는다.
    if (last.current === pathname) return;
    last.current = pathname;
    const m = pathname.match(/^\/contents\/([^/]+)/);
    track("Page View", { path: pathname, ...(m ? { article_id: decodeURIComponent(m[1]) } : {}) });
  }, [pathname]);

  return null;
}
