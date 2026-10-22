import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { Overlays } from "@/components/Overlays";
import { Analytics } from "@/components/Analytics";
import { AmplitudeInit } from "@/components/AmplitudeInit";
import "./globals.css";

// 영문은 Noto Sans(next/font), 한글은 아래 링크의 Noto Sans KR로 보인다.
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export const metadata: Metadata = {
  title: "articles",
  description: "해외 프로덕트·UX 디자인 글을 한국어 요약과 영어 원문 병기로 읽고, 표현과 생각을 기록하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={notoSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          {/* 모바일 웹 기준 단일 컬럼. 데스크톱에서는 가운데 정렬된 폰 폭으로 보여준다. */}
          <div className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-paper sm:shadow-[0_0_0_1px_var(--color-line)]">
            {children}
          </div>
          <Overlays />
          <Analytics />
          <AmplitudeInit />
        </StoreProvider>
      </body>
    </html>
  );
}
