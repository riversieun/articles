import type { ReactNode } from "react";
import { AppBar } from "@/components/AppBar";
import { Column } from "@/components/Column";
import { SideNav } from "@/components/SideNav";
import { TabBar } from "@/components/TabBar";

/** 탭 화면. 모바일은 상단 앱 바 + 하단 탭바, md(768px) 이상은 좌측 내비 + 남은 영역 가운데 680px 컬럼. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideNav />
      <div className="md:pl-48">
        <Column>
          <AppBar />
          <div className="pb-[104px] md:pb-10">{children}</div>
          <TabBar />
        </Column>
      </div>
    </>
  );
}
