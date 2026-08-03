import Link from "next/link";
import { ArrowRight, Building2, Globe2 } from "lucide-react";
import type { Company, MetricSnapshot, ValuationRun } from "@prisma/client";

type CompanyCardProps = {
  company: Company & {
    valuationRuns: ValuationRun[];
    metricSnapshots: MetricSnapshot[];
  };
};

export function CompanyCard({ company }: CompanyCardProps) {
  const latestBuffett = company.valuationRuns.find((item) => item.model === "BUFFETT_QUALITY_DCF");
  const latestGrowth = company.valuationRuns.find((item) => item.model === "GROWTH_PS_PEG");
  const keyMetric = company.metricSnapshots[0];

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            {company.name}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{company.englishName}</h3>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <Globe2 className="h-3.5 w-3.5" />
          {company.region}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{company.summary}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">质量 DCF</div>
          <div className="mt-2 text-base font-semibold text-slate-950">{latestBuffett?.baseValue.toFixed(1) ?? "--"}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">成长 PS/PEG</div>
          <div className="mt-2 text-base font-semibold text-slate-950">{latestGrowth?.baseValue.toFixed(1) ?? "--"}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">{keyMetric?.metricLabel ?? "关键状态"}</div>
          <div className="mt-2 text-sm font-medium text-slate-800">{keyMetric?.metricValue ?? "--"}</div>
        </div>
      </div>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
        查看公司本体
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
