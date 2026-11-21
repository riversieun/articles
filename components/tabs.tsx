import type { ReactNode } from "react";
import { IconBookmark, IconCompassFill, IconHomeFill } from "./icons";

/** 주요 탭(홈·탐색·아카이브). 하단 탭바(모바일)와 좌측 내비(md 이상)가 같은 목록을 쓴다. */
export const TABS: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/", label: "홈", icon: <IconHomeFill /> },
  { href: "/explore", label: "탐색", icon: <IconCompassFill /> },
  { href: "/archive", label: "아카이브", icon: <IconBookmark filled size={24} /> },
];
