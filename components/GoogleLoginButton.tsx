"use client";

import { Button } from "@/components/ui/button";
import { IconGoogle } from "./icons";

/** 구글 로그인 버튼. 로그인 시트("Google로 계속하기")와 프로필 페이지("Google로 로그인하기")가 같이 쓴다. */
export function GoogleLoginButton({
  onClick,
  label = "Google로 계속하기",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      variant="accent"
      onClick={onClick}
      className={`h-[52px] gap-3 rounded-pill text-body-md font-semibold ${className ?? ""}`}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface">
        <IconGoogle size={16} />
      </span>
      {label}
    </Button>
  );
}
