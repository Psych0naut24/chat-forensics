import React from 'react';
import { ChatMetrics } from '../types';
import { TrendingUp, Sun } from 'lucide-react';

interface ActivityChartsProps {
  metrics: ChatMetrics;
}

export const ActivityCharts: React.FC<ActivityChartsProps> = ({ metrics }) => {
  const [p1, p2] = metrics.participants;

  // Hourly data (0 to 23)
  const hourly = Object.values(metrics.hourlyActivity);
  const maxHourlyCount = Math.max(...hourly.map((h) => Math.max(h.countA, h.countB)), 1);

  // Weekly velocity
  const weekly = metrics.weeklyVelocity;
  const maxWeeklyCount = Math.max(...weekly.map((w) => w.countA + w.countB), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 24-Hour Circadian Cadence Heatmap */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-450">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-serif">Circadian Activity (24h)</h3>
              <p className="text-xs text-slate-400">Peak messaging hours for {p1} vs {p2}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-450" /> {p1}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" /> {p2}
            </span>
          </div>
        </div>

        {/* 24 Bar Columns */}
        <div className="pt-4">
          <div className="h-40 flex items-end gap-1.5 border-b border-obsidian-800 pb-2">
            {hourly.map((h) => {
              const heightA = Math.round((h.countA / maxHourlyCount) * 100);
              const heightB = Math.round((h.countB / maxHourlyCount) * 100);

              return (
                <div key={h.hour} className="flex-1 flex items-end justify-center gap-0.5 h-full group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 p-2 rounded-lg bg-obsidian-950 border border-obsidian-700 text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-xl pointer-events-none">
                    <div>Hour: {h.hour}:00</div>
                    <div className="text-amber-400">{p1}: {h.countA} msgs</div>
                    <div className="text-slate-400">{p2}: {h.countB} msgs</div>
                  </div>

                  {/* Bar Person A */}
                  <div
                    className="w-full bg-amber-500 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${Math.max(4, heightA)}%` }}
                  />
                  {/* Bar Person B */}
                  <div
                    className="w-full bg-slate-600 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${Math.max(4, heightB)}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 px-1">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      {/* Weekly Velocity / Inflection Curve */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-serif">Weekly Velocity Curve</h3>
              <p className="text-xs text-slate-400">Volume trajectory and momentum over time</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {weekly.length} Active Weeks
          </span>
        </div>

        <div className="pt-4">
          <div className="h-40 flex items-end gap-2 border-b border-obsidian-800 pb-2">
            {weekly.map((w, idx) => {
              const total = w.countA + w.countB;
              const heightPct = Math.round((total / maxWeeklyCount) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 p-2 rounded-lg bg-obsidian-950 border border-obsidian-700 text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-xl pointer-events-none">
                    <div>{w.weekLabel}</div>
                    <div className="text-emerald-400">Total: {total} msgs</div>
                    <div>{p1}: {w.countA} | {p2}: {w.countB}</div>
                  </div>

                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${Math.max(6, heightPct)}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 px-1">
            <span>{weekly[0]?.weekLabel || 'Start'}</span>
            <span>Midpoint</span>
            <span>{weekly[weekly.length - 1]?.weekLabel || 'Current'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
