import { Panel } from "@/components/panel";
import { getAgentRunsPageData } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AgentRunsPage() {
  const runs = await getAgentRunsPageData();

  return (
    <div className="space-y-8">
      <Panel title="Agent 运行记录" subtitle="全自动入库，但每次更新都保留审计轨迹">
        <div className="space-y-4">
          {runs.map((run) => (
            <div key={run.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-950">{run.company.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatDate(run.createdAt)} · {run.sourceName}</div>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{run.status}</div>
              </div>
              <div className="mt-3 text-sm text-slate-600">{run.summary}</div>
              {run.changes.length ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {run.changes.map((change) => (
                    <div key={change.id} className="rounded-xl bg-slate-50 p-4">
                      <div className="text-sm font-medium text-slate-900">{change.fieldName}</div>
                      <div className="mt-2 text-sm text-slate-600">{change.beforeValue ?? "—"} → {change.afterValue ?? "—"}</div>
                      <div className="mt-2 text-xs text-slate-500">{change.note}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
