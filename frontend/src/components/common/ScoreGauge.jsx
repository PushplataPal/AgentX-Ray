import React from 'react';

export const ScoreGauge = ({ score = 68, size = 140, strokeWidth = 10, showLabel = true, subtitle = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#F59E0B'; // Amber
  let glowColor = 'rgba(245, 158, 11, 0.25)';
  let statusText = 'Needs Attention';

  if (clampedScore >= 94) {
    color = '#10B981'; // Emerald
    glowColor = 'rgba(16, 185, 129, 0.35)';
    statusText = 'Excellent';
  } else if (clampedScore >= 80) {
    color = '#06B6D4'; // Cyan
    glowColor = 'rgba(6, 182, 212, 0.3)';
    statusText = 'Good';
  } else if (clampedScore >= 60) {
    color = '#F59E0B'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.25)';
    statusText = 'Needs Attention';
  } else {
    color = '#F43F5E'; // Rose
    glowColor = 'rgba(244, 63, 94, 0.35)';
    statusText = 'Critical Risk';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight font-mono" style={{ color }}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
            {statusText}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
};
