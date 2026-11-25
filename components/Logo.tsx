import Link from "next/link";
import { IconSparkle } from "./icons";

/** 서비스 로고: `crumbit` 글자 + 별 아이콘. 상단 앱 바(모바일)와 좌측 내비(md 이상)가 함께 쓴다. */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="crumbit 홈"
      className="relative font-logo text-headline font-bold tracking-display text-pd-ink-soft no-underline"
    >
      crumbit
      <IconSparkle size={12} className="absolute top-0 -right-2.5 text-brand" />
    </Link>
  );
}
