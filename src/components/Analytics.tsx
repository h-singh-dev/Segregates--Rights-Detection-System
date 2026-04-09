import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ClassificationHistory, WasteCategory } from "../types";

export default function Analytics() {
  const [history, setHistory] = useState<ClassificationHistory[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('segregate_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const totalScans = history.length;
  const avgConfidence = totalScans > 0 
    ? (history.reduce((sum, curr) => sum + curr.item.confidence, 0) / totalScans * 100).toFixed(1)
    : "0.0";

  const categoryCounts = history.reduce((acc, curr) => {
    acc[curr.item.category] = (acc[curr.item.category] || 0) + 1;
    return acc;
  }, {} as Record<WasteCategory, number>);

  const wetCount = categoryCounts['WET'] || 0;
  const dryCount = categoryCounts['DRY'] || 0;
  const hazardCount = categoryCounts['HAZARD'] || 0;

  const mostCommon = totalScans > 0 
    ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a as WasteCategory] > categoryCounts[b as WasteCategory] ? a : b)
    : "N/A";

  const chartData = [
    { name: 'WET', value: wetCount, color: '#54e98a' },
    { name: 'DRY', value: dryCount, color: '#92ccff' },
    { name: 'HAZARD', value: hazardCount, color: '#ffbfb5' }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12">
        <p className="text-secondary font-headline text-[0.6875rem] font-semibold uppercase tracking-[0.2em] mb-4">Insights & Accuracy</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter leading-tight text-on-surface">
          Global <span className="text-secondary italic">Analytics</span>
        </h1>
      </section>

      {totalScans === 0 ? (
        <div className="bg-surface-container-low rounded-xl p-16 flex flex-col items-center justify-center border border-outline-variant/10 text-center">
          <h2 className="text-xl font-headline font-semibold text-on-surface mb-2">No data yet</h2>
          <p className="text-on-surface-variant">Classify some items on the home page to start generating insights.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-[10px] uppercase font-headline tracking-widest text-on-surface-variant mb-2">Total Scans</h3>
              <p className="text-4xl font-headline font-bold text-on-surface">{totalScans}</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-[10px] uppercase font-headline tracking-widest text-on-surface-variant mb-2">Avg Confidence</h3>
              <p className="text-4xl font-headline font-bold text-secondary">{avgConfidence}%</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-[10px] uppercase font-headline tracking-widest text-on-surface-variant mb-2">Most Common</h3>
              <p className={`text-4xl font-headline font-bold uppercase ${
                mostCommon === 'WET' ? 'text-primary' : mostCommon === 'DRY' ? 'text-secondary' : 'text-tertiary'
              }`}>{mostCommon}</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-8">Category Distribution</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181c22', border: '1px solid rgba(61, 74, 62, 0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#dfe2eb' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
