import { notFound } from "next/navigation";

import { Panel } from "@/components/panel";
import { getCompanyPageData } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ValuationPage({ params }: { params: { company: string } }) {
  const company = await getCompanyPageData(params.company);
  if (!company) notFound();

  const byModel = new Map<string, (typeof company.valuationRuns)[number][]>();
  for (const run of company.valuationRuns) {
    byModel.set(run.model, [...(byModel.get(run.model) ?? []), run]);
  }

  return (
    <div className="space-y-8">
      <Panel title={`${company.name} 估值总览`} subtitle="两套模型并行运行，核心是暴露分歧来源">
        <div className="grid gap-6 xl:grid-cols-2">
          {[...byModel.entries()].map(([model, runs]) => {
            const latest = runs[0];
            return (
              <div key={model} className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm font-medium text-slate-950">
                  {model === "BUFFETT_QUALITY_DCF" ? "巴菲特模型 · 质量 DCF" : "成长股模型 · 成长 PS/PEG"}
                </div>
                <div className="mt-2 text-sm text-slate-600">{latest.headline}</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Bear</div>
                    <div className="mt-1 font-semibold text-slate-900">{latest.bearValue.toFixed(1)}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Base</div>
                    <div className="mt-1 font-semibold text-slate-900">{latest.baseValue.toFixed(1)}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Bull</div>
                    <div className="mt-1 font-semibold text-slate-900">{latest.bullValue.toFixed(1)}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-600">{latest.driverSummary}</div>
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  当前分歧点：{latest.disagreement}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        {[...byModel.entries()].map(([model, runs]) => (
          <Panel
            key={model}
            title={model === "BUFFETT_QUALITY_DCF" ? "质量 DCF 假设" : "成长 PS/PEG 假设"}
            subtitle="保留每次重算结果，方便你回看假设是怎么变的"
          >
            <div className="space-y-4">
              {runs.slice(0, 5).map((run) => (
                <div key={run.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-slate-950">{run.currentView}</div>
                    <div className="text-xs text-slate-500">{formatDate(run.generatedAt)}</div>
                  </div>
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-700">
                    {JSON.stringify(run.assumptionsJson, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </section>
    </div>
  );
}
