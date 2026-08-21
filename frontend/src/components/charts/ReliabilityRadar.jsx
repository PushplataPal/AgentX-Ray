import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const ReliabilityRadar = ({ fingerprint, height = 280 }) => {
  const vuln = fingerprint?.vulnerabilityPercentages || {
    toolMisuse: 82,
    goalDrift: 61,
    promptInjection: 52,
    recoveryFailure: 39,
    hallucination: 24,
    unsafeActions: 78
  };

  const data = [
    { subject: 'Tool Misuse', value: vuln.toolMisuse || 0, fullMark: 100 },
    { subject: 'Goal Drift', value: vuln.goalDrift || 0, fullMark: 100 },
    { subject: 'Prompt Injection', value: vuln.promptInjection || 0, fullMark: 100 },
    { subject: 'Recovery Fail', value: vuln.recoveryFailure || 0, fullMark: 100 },
    { subject: 'Hallucination', value: vuln.hallucination || 0, fullMark: 100 },
    { subject: 'Unsafe Actions', value: vuln.unsafeActions || 0, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl text-xs font-mono">
          <div className="font-bold text-slate-100 text-sm">{payload[0].payload.subject}</div>
          <div className="text-rose-400 font-extrabold mt-1 text-sm">
            Vulnerability Risk: {payload[0].value}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[240px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#E2E8F0', fontSize: 13, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
            stroke="#334155"
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Vulnerability Vector"
            dataKey="value"
            stroke="#F43F5E"
            fill="#F43F5E"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
