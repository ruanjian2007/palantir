import { notFound } from "next/navigation";

import { Panel } from "@/components/panel";
import { getAgentRunsPageData, getComparePageData } from "@/lib/data/queries";
import { assertOpsSecret, assertOpsSession } from "@/lib/ops";
import { formatDate } from "@/lib/utils";
import { ingestAction, recomputeAction, addDataSourceAction, addMetricSnapshotAction } from "@/app/ops-console/actions";

export const dynamic = "force-dynamic";

export default async function OpsConsolePage({ params }: { params: Promise<{ secret: string }> }) {
  const resolvedParams = await params;
  try {
    assertOpsSecret(resolvedParams.secret);
    await assertOpsSession();
  } catch {
    notFound();
  }

  const [companies, runs] = await Promise.all([getComparePageData(), getAgentRunsPageData()]);

  return (
    <div className="space-y-8">
      <Panel title="隐藏管理入口" subtitle="这页不公开导航，用于系统运维、数据录入和重算">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">公司对象：{companies.length} 家</div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">最近 Agent 运行：{runs.length} 次</div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">隐藏路径：/ops-console-{resolvedParams.secret}</div>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="事件中心" subtitle="手动投喂原始文本，Agent 自动入库并触发估值重算">
          <form action={ingestAction} className="space-y-3">
            <input type="hidden" name="secret" value={resolvedParams.secret} />
            <select name="companySlug" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {companies.map((company) => (
                <option key={company.id} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </select>
            <input name="sourceName" defaultValue="手动录入" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="来源名称" />
            <input name="sourceUrl" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="来源 URL" />
            <input name="occurredAt" type="datetime-local" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <textarea name="rawText" rows={6} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="输入原始新闻、公告、访谈纪要或链路观察" />
            <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">提交给 Agent</button>
          </form>
        </Panel>

        <Panel title="任务中心" subtitle="不等新事件也可以手动重算公司估值">
          <div className="space-y-3">
            {companies.map((company) => (
              <form key={company.id} action={recomputeAction} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <input type="hidden" name="secret" value={resolvedParams.secret} />
                <input type="hidden" name="companySlug" value={company.slug} />
                <div>
                  <div className="text-sm font-medium text-slate-950">{company.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{company.summary}</div>
                </div>
                <button className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">重算估值</button>
              </form>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="数据源配置" subtitle="给某家公司增加跟踪来源">
          <form action={addDataSourceAction} className="space-y-3">
            <input type="hidden" name="secret" value={resolvedParams.secret} />
            <select name="companySlug" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {companies.map((company) => (
                <option key={company.id} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </select>
            <input name="name" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="数据源名称" />
            <input name="sourceType" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="来源类型，如 official / news / pricing" />
            <input name="url" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="URL" />
            <input name="cadence" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="更新频率，如 daily / weekly" />
            <textarea name="notes" rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="备注" />
            <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">新增数据源</button>
          </form>
        </Panel>

        <Panel title="状态维护" subtitle="直接补一条关键状态变量，立即进入公司页和估值层">
          <form action={addMetricSnapshotAction} className="space-y-3">
            <input type="hidden" name="secret" value={resolvedParams.secret} />
            <select name="companySlug" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {companies.map((company) => (
                <option key={company.id} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </select>
            <input name="metricGroup" defaultValue="states" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="metricGroup" />
            <input name="metricKey" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="metricKey，如 node_gap" />
            <input name="metricLabel" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="指标名称" />
            <input name="metricValue" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="指标显示值" />
            <input name="valueNumber" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="数值（可选）" />
            <input name="unit" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="单位（可选）" />
            <input name="asOfDate" type="datetime-local" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <textarea name="note" rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="备注" />
            <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">写入状态</button>
          </form>
        </Panel>
      </section>

      <Panel title="最近 Agent 审计" subtitle="确认 Agent 不是黑盒直接改库">
        <div className="space-y-4">
          {runs.slice(0, 10).map((run) => (
            <div key={run.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-slate-950">{run.company.name}</div>
                <div className="text-xs text-slate-500">{formatDate(run.createdAt)}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">{run.summary}</div>
              <div className="mt-3 text-xs text-slate-500">{run.sourceName} · {run.status}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
