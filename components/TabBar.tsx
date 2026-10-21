"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { on: boolean };

/** 비활성: 회색 스트로크 / 활성: 검정 채움. 채움 아이콘 안쪽 선은 흰색으로 비운다. */
function Svg({ on, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const GlobeIcon = ({ on }: IconProps) => (
  <Svg on={on}>
    <circle cx="12" cy="12" r="9" />
    <g stroke={on ? "#fff" : "currentColor"}>
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </g>
  </Svg>
);

const ArchiveIcon = ({ on }: IconProps) => (
  <Svg on={on}>
    <path d="M4 5h16v4H4z" />
    <path d="M6 9v10h12V9" />
    <path d="M10 13h4" stroke={on ? "#fff" : "currentColor"} />
  </Svg>
);

const AaIcon = ({ on }: IconProps) => (
  <span
    aria-hidden="true"
    className={`flex h-6 items-center font-serif text-[21px] leading-none ${on ? "font-bold" : "font-normal"}`}
  >
    Aa
  </span>
);

const TABS = [
  { href: "/", label: "탐색", Icon: GlobeIcon },
  { href: "/expressions", label: "표현", Icon: AaIcon },
  { href: "/archive", label: "아카이브", Icon: ArchiveIcon },
];

/** 화면 하단에 떠 있는 흰색 탭바. 아이콘 위, 레이블 아래. */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="주요 탭"
      className="pointer-events-none fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-[430px] px-5"
    >
      <div className="pointer-events-auto grid h-16 grid-cols-3 rounded-[32px] bg-white px-1.5 shadow-[0_0_0_1px_var(--color-line),0_10px_28px_rgba(17,17,17,0.14)]">
        {TABS.map(({ href, label, Icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 text-xs no-underline ${
                on ? "font-bold text-ink" : "font-medium text-sub"
              }`}
            >
              <Icon on={on} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
