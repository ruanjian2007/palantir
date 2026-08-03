import type { Metadata } from "next";

import "@/app/globals.css";
import { AppShell } from "@/components/shell";

export const metadata: Metadata = {
  title: "公司价值决策系统",
  description: "基于本体建模的公司研究、估值和 Agent 决策系统"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
