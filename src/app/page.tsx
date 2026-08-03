import Link from "next/link";
import { ArrowRight, BrainCircuit, DatabaseZap, Radar } from "lucide-react";

import { CompanyCard } from "@/components/company-card";
import { Panel, StatGrid } from "@/components/panel";
import { getHomePageData } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { companies, recentEvents, recentRuns } = await getHomePageData();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-panel">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <BrainCircuit className="h-4 w-4" />
            Ontology + Valuation + Agent
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
            用本体建模把公司研究、估值判断和事件更新拉进同一套系统
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            第一版围绕长鑫存储及 5 家相关上市公司构建对象层、关系层、状态变量、双估值模型和自动 Agent 更新链路。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/companies/cxmt"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              进入长鑫存储
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              查看 6 家对比
            </Link>
          </div>
        </div>
        <Panel title="系统当前状态" subtitle="面向 Roma 测试环境的 V1 里程碑">
          <StatGrid
            items={[
              { label: "公司样本", value: `${companies.length} 家`, tone: "positive" },
              { label: "最近事件", value: `${recentEvents.length} 条`, tone: "default" },
              { label: "Agent 运行", value: `${recentRuns.length} 次`, tone: "warning" },
              { label: "估值模型", value: "2 套", tone: "default" }
            ]}
          />
        </Panel>
      </section>

      <Panel title="公司入口" subtitle="6 家公司都接入完整本体建模，不是只读样本卡片">
        <div className="grid gap-4 xl:grid-cols-2">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="最新事件变化" subtitle="Agent 入库后自动影响对象状态与估值">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-slate-950">{event.title}</div>
                  <div className="text-xs text-slate-500">{formatDate(event.occurredAt)}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{event.extractedSummary}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>{event.company.name}</span>
                  <span>{event.sourceName}</span>
                  <span>{event.impactDirection}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="最近 Agent 运行" subtitle="全自动入库，但保留审计和变化解释">
          <div className="space-y-4">
            {recentRuns.map((run) => (
              <div key={run.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-slate-950">{run.company.name}</div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{run.status}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{run.summary}</div>
                <div className="mt-3 text-xs text-slate-500">
                  {formatDate(run.createdAt)} · {run.sourceName}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Panel title="本体层" subtitle="公司、产品、节点、产能、客户、供应商、事件">
          <div className="text-sm leading-7 text-slate-600">
            研究不是堆材料，而是维护一个可更新的业务世界模型。
          </div>
        </Panel>
        <Panel title="估值层" subtitle="质量 DCF + 成长 PS/PEG">
          <div className="text-sm leading-7 text-slate-600">
            两套模型同时运行，专门暴露“为什么分歧”。
          </div>
        </Panel>
        <Panel title="Agent 层" subtitle="抓事件、入库、重算、解释">
          <div className="text-sm leading-7 text-slate-600">
            事件不再停留在新闻摘要，而是直接映射到对象状态和估值变化。
          </div>
        </Panel>
      </section>
    </div>
  );
}
