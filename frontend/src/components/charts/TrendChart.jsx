import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export const TrendChart = ({ data = [], height = 240 }) => {
  const defaultData = [
    { run: 'Run #1', score: 62, timestamp: '10:00' },
    { run: 'Run #2', score: 65, timestamp: '10:15' },
    { run: 'Run #3', score: 68, timestamp: '10:30' },
    { run: 'Run #4 (Fixed)', score: 94, timestamp: '10:45' },
    { run: 'Run #5', score: 95, timestamp: '11:00' },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
          <div className="font-semibold text-slate-300">{payload[0].payload.run || label}</div>
          <div className="text-cyan-400 font-mono font-bold mt-1">
            Reliability: {payload[0].value}/100
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="run" tick={{ fill: '#64748B', fontSize: 10 }} stroke="#334155" />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} stroke="#334155" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#06B6D4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
