import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { Overlays } from "@/components/Overlays";
import { Analytics } from "@/components/Analytics";
import { AmplitudeInit } from "@/components/AmplitudeInit";
// Pretendard Variable (npm `pretendard`, 직접 호스팅하는 동적 서브셋). 폰트 이름: "Pretendard Variable"
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
// 원문 인용(영어 이탤릭) 전용 글꼴. 라틴 글자만 쓰므로 400 이탤릭 한 벌만 불러온다.
import "@fontsource/roboto/latin-400-italic.css";
// 로고(crumbit) 전용 글꼴. 700 한 벌만 불러온다.
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "crumbit",
  description: "해외 프로덕트·UX 디자인 글을 한국어 요약과 영어 원문 병기로 읽고, 내 생각을 기록하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StoreProvider>
          {/* 모바일 웹 기준 단일 컬럼. 데스크톱에서는 가운데 정렬된 폰 폭으로 보여준다. */}
          <div className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-surface sm:shadow-[0_0_0_1px_var(--color-border)]">
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
