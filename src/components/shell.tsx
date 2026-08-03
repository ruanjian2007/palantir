import Link from "next/link";
import { BrainCircuit, CandlestickChart, GitCompare, History, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "首页", icon: LayoutDashboard },
  { href: "/compare", label: "对比", icon: GitCompare },
  { href: "/agent-runs", label: "Agent", icon: BrainCircuit },
  { href: "/valuations/cxmt", label: "估值", icon: CandlestickChart }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
              公司价值决策系统
            </Link>
            <p className="mt-1 text-xs text-slate-500">Ontology-driven research, valuation, and agent-assisted updates</p>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="mx-auto flex max-w-7xl items-center gap-2 px-4 pb-10 pt-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        <History className="h-4 w-4" />
        当前阶段：Roma 测试环境 V1
      </footer>
    </div>
  );
}
