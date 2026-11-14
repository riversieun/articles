"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * 주제 필터 칩(홈·탐색). Paper 디자인: 6px 모서리, 선택하면 검정 면 + 흰 굵은 글자,
 * 선택 안 되면 연회색 면 + 회색 글자. 가로로 스크롤되는 줄 안에서 줄어들지 않는다.
 */
export function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button
      variant={on ? "default" : "secondary"}
      aria-pressed={on}
      onClick={onClick}
      className={`shrink-0 rounded-sm border-0 px-3 text-body-md ${
        on ? "bg-pd-ink font-semibold text-white hover:bg-pd-ink" : "bg-pd-chip font-normal text-pd-ink-muted hover:bg-pd-chip"
      }`}
    >
      {children}
    </Button>
  );
}
