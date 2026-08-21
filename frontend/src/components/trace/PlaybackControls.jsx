import React from 'react';
import { Play, RotateCcw, FastForward, Gauge } from 'lucide-react';

export const PlaybackControls = ({ speed = 'instant', onSpeedChange, onReplay, isRunning = false }) => {
  return (
    <div className="flex items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs">
      <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] pr-2 border-r border-slate-800">
        <Gauge size={13} className="text-cyan-400" />
        <span>Execution Speed:</span>
      </div>

      <div className="flex items-center gap-1">
        {['instant', '1x', '2x'].map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange && onSpeedChange(s)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
              speed === s
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {onReplay && (
        <button
          onClick={onReplay}
          disabled={isRunning}
          className="ml-auto flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50"
        >
          <RotateCcw size={12} />
          <span>Replay Trace</span>
        </button>
      )}
    </div>
  );
};
