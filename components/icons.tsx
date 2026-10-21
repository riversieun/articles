import type { ReactNode } from "react";

type P = { size?: number; filled?: boolean; className?: string };

function Svg({
  size = 22,
  children,
  fill = "none",
  sw = 2,
  className,
}: {
  size?: number;
  children: ReactNode;
  fill?: string;
  sw?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconBack = (p: P) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const IconChevron = (p: P) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);
export const IconBookmark = ({ filled, ...p }: P) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"} sw={1.8}>
    <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
  </Svg>
);
export const IconComment = (p: P) => (
  <Svg {...p}>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  </Svg>
);
export const IconExternal = (p: P) => (
  <Svg {...p}>
    <path d="M8 16L16 8M9 8h7v7" />
  </Svg>
);
export const IconPen = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3" />
  </Svg>
);
export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconTrash = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
  </Svg>
);
export const IconGlobe = (p: P) => (
  <Svg {...p} sw={1.9}>
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Svg>
);
export const IconArchive = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="M4 5h16v4H4zM6 9v10h12V9M10 13h4" />
  </Svg>
);
export const IconHighlighter = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="m9 11-6 6v3h9l3-3" />
    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
  </Svg>
);
