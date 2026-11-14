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

/** 원저자 표시·로고 별로 쓰는 네 꼭지점 별(Figma 홈 프레임의 에셋 경로). 글자색(currentColor)을 따른다. */
export function IconSparkle({ size = 14, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 14 14" fill="currentColor" className={className}>
      <path d="M12.2027 6.49904L10.551 5.67321L9.07556 4.93547L9.05904 4.91896L8.32131 3.44348L7.49548 1.79183C7.30829 1.41745 6.69718 1.41745 6.50999 1.79183L5.68417 3.44348L4.94643 4.91896L4.92992 4.93547L3.45444 5.67321L1.80279 6.49904C1.6156 6.59263 1.49999 6.78532 1.49999 6.98903C1.49999 7.19273 1.6156 7.38542 1.80279 7.47902L3.45444 8.30484L4.92992 9.04258L4.94643 9.0591L5.68417 10.5346L6.50999 12.1862C6.60359 12.3734 6.79628 12.489 6.99999 12.489C7.20369 12.489 7.39638 12.3734 7.48998 12.1862L8.3158 10.5346L9.05354 9.0591L9.07006 9.04258L10.5455 8.30484L12.1972 7.47902C12.3844 7.38542 12.5 7.19273 12.5 6.98903C12.5 6.78532 12.3844 6.59263 12.1972 6.49904H12.2027Z" />
    </svg>
  );
}

/** 하단 탭바 아이콘(Figma 홈 프레임의 에셋 경로). 글자색(currentColor)을 따른다. */
export function IconHomeFill({ size = 24, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.5427 2.82415C10.9495 2.47832 11.4661 2.28843 12 2.28843C12.5339 2.28843 13.0505 2.47832 13.4573 2.82415L20.2073 8.5613C20.4558 8.77251 20.6553 9.03521 20.7922 9.33119C20.9291 9.62717 21 9.94936 21 10.2755V19.2478C21 19.7068 20.8177 20.147 20.4931 20.4716C20.1685 20.7962 19.7283 20.9785 19.2692 20.9785H16.5C16.041 20.9785 15.6007 20.7962 15.2762 20.4716C14.9516 20.147 14.7692 19.7068 14.7692 19.2478V14.7478C14.7692 14.3816 14.6242 14.0304 14.3659 13.7709C14.1076 13.5114 13.757 13.3648 13.3908 13.3631H10.6085C10.2424 13.365 9.89203 13.5117 9.63386 13.7711C9.37569 14.0306 9.23076 14.3817 9.23077 14.7478V19.2478C9.23077 19.4751 9.186 19.7001 9.09902 19.9101C9.01204 20.1201 8.88456 20.3109 8.72384 20.4716C8.56312 20.6323 8.37232 20.7598 8.16234 20.8468C7.95235 20.9338 7.72729 20.9785 7.5 20.9785H4.73077C4.27174 20.9785 3.83151 20.7962 3.50693 20.4716C3.18235 20.147 3 19.7068 3 19.2478V10.2755C3.00002 9.94936 3.07092 9.62717 3.20779 9.33119C3.34467 9.03521 3.54424 8.77251 3.79269 8.5613L10.5427 2.82415Z" />
    </svg>
  );
}
export function IconCompassFill({ size = 24, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.485 2 2 6.485 2 12C2 17.515 6.485 22 12 22C17.515 22 22 17.515 22 12C22 6.485 17.515 2 12 2ZM16.925 8.075L14.06 14.065L8.07 16.93C7.93002 16.9974 7.77257 17.0196 7.61942 16.9936C7.46626 16.9676 7.32495 16.8947 7.215 16.785C7.10526 16.675 7.03237 16.5337 7.0064 16.3806C6.98042 16.2274 7.00265 16.07 7.07 15.93L9.935 9.94L15.925 7.075C16.0651 7.00838 16.2224 6.98655 16.3754 7.0125C16.5284 7.03844 16.6697 7.1109 16.78 7.22C16.8897 7.32995 16.9626 7.47126 16.9886 7.62442C17.0146 7.77757 16.9924 7.93502 16.925 8.075Z" />
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

/** 로그인 전 프로필 자리표시. 원형 선 안에 머리와 어깨 실루엣(Figma 홈 프레임의 boxicons user-circle-filled 에셋 경로). */
export function IconAvatar({ size = 40, className }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" className={className}>
      <path
        className="fill-border-strong"
        d="M16 2.66667C8.65333 2.66667 2.66667 8.65333 2.66667 16C2.66667 23.3467 8.65333 29.3333 16 29.3333C23.3467 29.3333 29.3333 23.3467 29.3333 16C29.3333 8.65333 23.3467 2.66667 16 2.66667ZM16 9.33333C18.3067 9.33333 20 11.0267 20 13.3333C20 15.64 18.3067 17.3333 16 17.3333C13.6933 17.3333 12 15.64 12 13.3333C12 11.0267 13.6933 9.33333 16 9.33333ZM16 26.6667C13.2826 26.6664 10.6684 25.6264 8.69333 23.76C9.77333 21.5467 12.04 20 14.6667 20H17.3333C19.96 20 22.2133 21.5467 23.2933 23.76C21.3246 25.6279 18.7138 26.6684 16 26.6667Z"
      />
    </svg>
  );
}
