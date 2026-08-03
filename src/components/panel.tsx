import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  children,
  className
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-panel", className)}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function StatGrid({
  items
}: {
  items: Array<{
    label: string;
    value: string;
    tone?: "default" | "positive" | "warning" | "danger";
  }>;
}) {
  const toneMap = {
    default: "bg-slate-50 text-slate-800",
    positive: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700"
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">{item.label}</div>
          <div className={cn("mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold", toneMap[item.tone ?? "default"])}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
