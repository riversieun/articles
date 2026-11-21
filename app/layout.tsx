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
          {/* 폭은 화면마다 Column이 정한다(모바일 430px, md 이상 680px). 탭 화면은 좌측 내비가 붙는다. */}
          {children}
          <Overlays />
          <Analytics />
          <AmplitudeInit />
        </StoreProvider>
      </body>
    </html>
  );
}
