import { notFound } from "next/navigation";
import { ArrowUpRight, Link2, Radar, ShieldAlert } from "lucide-react";

import { Panel, StatGrid } from "@/components/panel";
import { getCompanyPageData } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function pickLatestMetrics(metrics: Array<{ metricKey: string; metricLabel: string; metricValue: string; metricGroup: string }>) {
  const seen = new Set<string>();
  return metrics.filter((item) => {
    if (seen.has(item.metricKey)) return false;
    seen.add(item.metricKey);
    return true;
  }).slice(0, 10);
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const company = await getCompanyPageData(resolvedParams.slug);
  if (!company) notFound();

  const latestMetrics = pickLatestMetrics(company.metricSnapshots);
  const latestValuationByModel = new Map<string, (typeof company.valuationRuns)[number]>();
  for (const item of company.valuationRuns) {
    if (!latestValuationByModel.has(item.model)) {
      latestValuationByModel.set(item.model, item);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title={company.name} subtitle={company.englishName}>
          <div className="space-y-4">
            <p className="text-sm leading-7 text-slate-600">{company.description}</p>
            <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{company.investmentThesis}</p>
            <StatGrid
              items={[
                { label: "市场", value: `${company.market ?? "Private"} ${company.ticker ? `· ${company.ticker}` : ""}`.trim() },
                { label: "地区", value: company.region, tone: "default" },
                { label: "赛道", value: company.sector, tone: "warning" },
                { label: "护城河摘要", value: company.moatSummary, tone: "positive" }
              ]}
            />
          </div>
        </Panel>

        <Panel title="估值结果" subtitle="每次事件更新后自动重算两套模型">
          <div className="space-y-4">
            {[...latestValuationByModel.values()].map((valuation) => (
              <div key={valuation.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-950">
                      {valuation.model === "BUFFETT_QUALITY_DCF" ? "巴菲特模型 · 质量 DCF" : "成长股模型 · 成长 PS/PEG"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{valuation.currentView}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Base</div>
                    <div className="text-lg font-semibold text-slate-950">{valuation.baseValue.toFixed(1)}</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Bear</div>
                    <div className="mt-1 font-semibold text-slate-900">{valuation.bearValue.toFixed(1)}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Base</div>
                    <div className="mt-1 font-semibold text-slate-900">{valuation.baseValue.toFixed(1)}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Bull</div>
                    <div className="mt-1 font-semibold text-slate-900">{valuation.bullValue.toFixed(1)}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-600">{valuation.driverSummary}</div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="关键状态变量" subtitle="这些是会直接改变估值判断的对象状态">
        <StatGrid
          items={latestMetrics.map((item) => ({
            label: item.metricLabel,
            value: item.metricValue,
            tone: item.metricGroup === "valuation" ? "warning" : "default"
          }))}
        />
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="对象层面板" subtitle="本体对象不是附件，而是系统主结构">
          <div className="space-y-5 text-sm text-slate-700">
            <div>
              <div className="font-medium text-slate-950">业务线</div>
              <ul className="mt-2 space-y-2">
                {company.businessLines.map((item) => (
                  <li key={item.id} className="rounded-xl bg-slate-50 p-3">{item.name} · {item.summary}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-950">产品</div>
              <ul className="mt-2 space-y-2">
                {company.products.map((item) => (
                  <li key={item.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="mt-1 text-slate-600">{item.summary}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-950">技术节点 / 产能 / 资本开支</div>
              <ul className="mt-2 space-y-2">
                {[...company.technologyNodes, ...company.capacities, ...company.capexPrograms].map((item: any) => (
                  <li key={item.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="font-medium text-slate-900">{item.name ?? item.label}</div>
                    <div className="mt-1 text-slate-600">{item.summary}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        <Panel title="关系视图" subtitle="估值不是平面数据，而是对象关系的投影">
          <div className="space-y-3">
            {company.relationships.map((relationship) => (
              <div key={relationship.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Link2 className="h-4 w-4" />
                  {relationship.fromLabel} → {relationship.toLabel}
                </div>
                <div className="mt-2 text-sm text-slate-600">{relationship.summary}</div>
                <div className="mt-3 text-xs text-slate-500">关系强度 {relationship.strength}/10</div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="事件时间线" subtitle="每条事件都能回溯到对象变化">
          <div className="space-y-4">
            {company.events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-slate-950">{event.title}</div>
                  <div className="text-xs text-slate-500">{formatDate(event.occurredAt)}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{event.extractedSummary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.targets.map((target) => (
                    <span key={target.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {target.label}
                    </span>
                  ))}
                </div>
                <a href={event.sourceUrl} target="_blank" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                  {event.sourceName}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="风险与 Agent" subtitle="自动更新后的解释和审计都在这里">
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                <ShieldAlert className="h-4 w-4" />
                当前风险项
              </div>
              <div className="mt-2 text-sm leading-6 text-amber-800">
                {[...latestValuationByModel.values()][0]?.topRisk ?? "暂无风险提示"}
              </div>
            </div>
            <div className="space-y-3">
              {company.agentRuns.map((run) => (
                <div key={run.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-slate-950">{run.summary}</div>
                    <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{run.status}</div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">{formatDate(run.createdAt)} · {run.sourceName}</div>
                  {run.changes.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {run.changes.map((change) => (
                        <li key={change.id} className="rounded-xl bg-slate-50 p-3">
                          <div className="font-medium text-slate-800">{change.fieldName}</div>
                          <div className="mt-1">{change.beforeValue ?? "—"} → {change.afterValue ?? "—"}</div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <Panel title="数据源配置概览" subtitle="第一版先提供只读视图，管理入口可继续维护">
        <div className="grid gap-3 md:grid-cols-2">
          {company.dataSources.map((source) => (
            <div key={source.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-950">{source.name}</div>
                <div className="text-xs text-slate-500">{source.cadence}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">{source.sourceType}</div>
              <a href={source.url} target="_blank" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                查看来源
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
