import type { ReactNode } from "react";
import { AppBar } from "@/components/AppBar";
import { TabBar } from "@/components/TabBar";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppBar />
      <div className="pb-[104px]">{children}</div>
      <TabBar />
    </>
  );
}
