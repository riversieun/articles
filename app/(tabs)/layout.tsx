import type { ReactNode } from "react";
import { AppBar } from "@/components/AppBar";
import { Column } from "@/components/Column";
import { TabBar } from "@/components/TabBar";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <Column>
      <AppBar />
      <div className="pb-[104px]">{children}</div>
      <TabBar />
    </Column>
  );
}
