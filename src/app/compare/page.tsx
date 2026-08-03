import { Panel } from "@/components/panel";
import { getComparePageData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const companies = await getComparePageData();

  return (
    <div className="space-y-8">
      <Panel title="6 家公司横向对比" subtitle="把长鑫估值关键外部变量放在同一张表里看">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4">公司</th>
                <th className="px-4">地区</th>
                <th className="px-4">赛道</th>
                <th className="px-4">质量 DCF</th>
                <th className="px-4">成长 PS/PEG</th>
                <th className="px-4">关键状态</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const buffett = company.valuationRuns.find((item) => item.model === "BUFFETT_QUALITY_DCF");
                const growth = company.valuationRuns.find((item) => item.model === "GROWTH_PS_PEG");
                const metric = company.metricSnapshots[0];
                return (
                  <tr key={company.id} className="rounded-2xl bg-white shadow-panel">
                    <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-950">{company.name}</td>
                    <td className="px-4 py-4 text-slate-600">{company.region}</td>
                    <td className="px-4 py-4 text-slate-600">{company.sector}</td>
                    <td className="px-4 py-4 text-slate-900">{buffett?.baseValue.toFixed(1) ?? "--"}</td>
                    <td className="px-4 py-4 text-slate-900">{growth?.baseValue.toFixed(1) ?? "--"}</td>
                    <td className="rounded-r-2xl px-4 py-4 text-slate-600">{metric?.metricValue ?? "--"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
