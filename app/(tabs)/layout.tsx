import type { ReactNode } from "react";
import { AppBar } from "@/components/AppBar";
import { Column } from "@/components/Column";
import { SideNav } from "@/components/SideNav";
import { TabBar } from "@/components/TabBar";

/**
 * 탭 화면(홈·탐색·아카이브). 상단 헤더는 모든 해상도에서 유지하고, 탭 이동만 해상도에 따라 바뀐다.
 * - ~767px: 헤더 + 본문 430px + 하단 탭바
 * - 768~1279px(md): 전체 폭 헤더 + 좌측 레일 80px + 남은 영역 가운데 본문 680px
 * - 1280px~(xl): 전체 폭 헤더 + 좌측 사이드바 192px + 남은 영역 가운데 본문 680px
 */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideNav />
      <div className="md:pl-20 lg:pl-48">
        <Column>
          <AppBar />
          {/* md 이상: 헤더가 위에 고정(48px)이라 그만큼 + 20px을 비워 좌측 내비 첫 항목과 시작선을 맞춘다 */}
          <div className="pb-[104px] md:pt-17 md:pb-10">{children}</div>
          <TabBar />
        </Column>
      </div>
    </>
  );
}
