import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 화면 한 컬럼의 폭을 정한다. 모바일은 430px, md(768px) 이상은 읽기 폭 680px.
 * 430~767px 구간에서는 폰 폭 가운데 컬럼이 떠 있도록 얇은 테두리를 둔다(md 이상은 테두리 없음).
 */
export function Column({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto min-h-dvh w-full max-w-[430px] bg-surface sm:max-md:shadow-[0_0_0_1px_var(--color-border)] md:max-w-170",
        className,
      )}
    >
      {children}
    </div>
  );
}
