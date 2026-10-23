import React, { useState } from 'react';
import { Account, IntentSignal } from '../types/crm';
import { Zap, Eye, Briefcase, TrendingUp, Search, Terminal, ArrowUpRight } from 'lucide-react';

interface IntentRadarProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onOpenOutreach: (account: Account) => void;
}

export const IntentRadar: React.FC<IntentRadarProps> = ({
  accounts,
  onSelectAccount,
  onOpenOutreach,
}) => {
  const [filterIntensity, setFilterIntensity] = useState<'all' | 'high' | 'medium'>('all');

  // Flatten all signals with account reference
  const allSignals = accounts.flatMap((acc) =>
    acc.intentSignals.map((sig) => ({
      ...sig,
      account: acc,
    }))
  );

  const filteredSignals = allSignals.filter((item) => {
    if (filterIntensity === 'all') return true;
    return item.intensity === filterIntensity;
  });

  const getSignalIcon = (type: IntentSignal['type']) => {
    switch (type) {
      case 'pricing_view':
        return <Eye className="w-3.5 h-3.5 text-amber-400" />;
      case 'hiring_surge':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-400" />;
      case 'funding':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'competitor_search':
        return <Search className="w-3.5 h-3.5 text-rose-400" />;
      case 'tech_install':
        return <Terminal className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* View Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Intent Velocity Radar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry and 3rd-party buying intent signals captured across target accounts.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-md border border-white/[0.06]">
          <button
            onClick={() => setFilterIntensity('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              filterIntensity === 'all'
                ? 'bg-white/[0.1] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Signals ({allSignals.length})
          </button>
          <button
            onClick={() => setFilterIntensity('high')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              filterIntensity === 'high'
                ? 'bg-white/[0.1] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Intensity ({allSignals.filter((s) => s.intensity === 'high').length})
          </button>
          <button
            onClick={() => setFilterIntensity('medium')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              filterIntensity === 'medium'
                ? 'bg-white/[0.1] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Moderate ({allSignals.filter((s) => s.intensity === 'medium').length})
          </button>
        </div>
      </div>

      {/* Signals List */}
      <div className="rounded-lg border border-white/[0.08] bg-[#0E1017] divide-y divide-white/[0.04]">
        {filteredSignals.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectAccount(item.account)}
            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-white/[0.04] border border-white/[0.08] shrink-0 mt-0.5">
                {getSignalIcon(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {item.account.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.account.domain}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    ICP {item.account.icpScore}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>Source: {item.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 md:self-center self-end" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onOpenOutreach(item.account)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/40 rounded transition-colors flex items-center gap-1.5"
              >
                <span>Draft ABM Touchpoint</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filteredSignals.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            No intent signals found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
