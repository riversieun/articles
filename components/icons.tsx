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
  <Svg {...p} fill="currentColor" sw={1}>
    <path d="M3.5 20.5v-3.8L16.4 3.8a1.6 1.6 0 0 1 2.3 0l1.5 1.5a1.6 1.6 0 0 1 0 2.3L7.3 20.5z" />
  </Svg>
);
export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconTrash = (p: P) => (
  <Svg {...p} fill="currentColor" sw={1}>
    <path d="M9 3h6l1 2h4v2H4V5h4zM6 9h12l-.9 10.6a1.5 1.5 0 0 1-1.5 1.4H8.4a1.5 1.5 0 0 1-1.5-1.4z" />
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

/** 원저자 표시용 네 꼭지점 별. 글자색(currentColor)을 따른다. */
export function IconSparkle({ size = 16, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5C11.1 16.9 7.1 12.9 1.5 12 7.1 11.1 11.1 7.1 12 1.5Z" />
    </svg>
  );
}

/** 선(stroke) 형태. 팝오버 메뉴처럼 라벨 옆에 쓰는 연필·휴지통. */
export const IconPenLine = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3" />
  </Svg>
);
export const IconTrashLine = (p: P) => (
  <Svg {...p} sw={1.8}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
  </Svg>
);

/** 구글 로고(원색 G). 흰 원 안에 넣어 쓴다. */
export function IconGoogle({ size = 16, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/** 로그인 전 프로필 자리표시. 회색 원 안에 머리와 어깨 실루엣. */
export function IconAvatar({ size = 40, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 40 40" className={className}>
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="20" className="fill-border" />
      <g clipPath="url(#avatar-clip)" className="fill-subtle/50">
        <circle cx="20" cy="15.5" r="7" />
        <ellipse cx="20" cy="39" rx="14.5" ry="12" />
      </g>
    </svg>
  );
}
