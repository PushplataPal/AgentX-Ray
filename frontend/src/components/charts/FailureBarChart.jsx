import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const FailureBarChart = ({ data = [], height = 240 }) => {
  const defaultData = [
    { category: 'Unsafe Action', count: 6, color: '#F43F5E' },
    { category: 'Tool Misuse', count: 4, color: '#FB923C' },
    { category: 'Prompt Inj.', count: 3, color: '#FBBF24' },
    { category: 'Goal Drift', count: 2, color: '#38BDF8' },
    { category: 'Hallucination', count: 1, color: '#A855F7' },
    { category: 'Tool Loop', count: 2, color: '#E879F9' },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
          <div className="font-semibold text-slate-200">{payload[0].payload.category}</div>
          <div className="text-slate-300 font-mono mt-1">
            Incidents: <span className="font-bold text-rose-400">{payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis 
            dataKey="category" 
            tick={{ fill: '#94A3B8', fontSize: 10 }} 
            interval={0}
            angle={-20}
            textAnchor="end"
            stroke="#334155" 
          />
          <YAxis tick={{ fill: '#64748B', fontSize: 10 }} stroke="#334155" allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#F43F5E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
