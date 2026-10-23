import React from 'react';
import { Account } from '../types/crm';
import { TrendingUp, Target, Zap, DollarSign } from 'lucide-react';

interface KPIRowProps {
  accounts: Account[];
}

export const KPIRow: React.FC<KPIRowProps> = ({ accounts }) => {
  const totalARR = accounts.reduce((acc, curr) => acc + (curr.arrPotential || 0), 0);
  const avgICP = Math.round(
    accounts.reduce((acc, curr) => acc + curr.icpScore, 0) / (accounts.length || 1)
  );
  const surgeCount = accounts.filter(
    (a) => a.intentVelocity === 'surge' || a.intentVelocity === 'high'
  ).length;
  const activeOpportunities = accounts.filter(
    (a) => a.stage === 'opportunity' || a.stage === 'qualified'
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Pipeline Value</span>
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="text-xl font-semibold text-white font-mono tabular-nums tracking-tight">
          ${(totalARR / 1000000).toFixed(2)}M
        </div>
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span>{accounts.length} Target Accounts</span>
          <span aria-hidden="true">·</span>
          <span>ARR In Scope</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Active Opportunities</span>
          <Target className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-semibold text-white font-mono tabular-nums tracking-tight">
          {activeOpportunities} <span className="text-xs text-slate-500 font-normal">deals</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span>Qualified &amp; Active</span>
          <span aria-hidden="true">·</span>
          <span>In POC / Evaluation</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Avg ICP Match Score</span>
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="text-xl font-semibold text-white font-mono tabular-nums tracking-tight">
          {avgICP} <span className="text-xs text-slate-500 font-normal">/ 100</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span>Autonomous AI Fit</span>
          <span aria-hidden="true">·</span>
          <span>Multi-factor scored</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>High-Intent Signals</span>
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-xl font-semibold text-white font-mono tabular-nums tracking-tight">
          {surgeCount} <span className="text-xs text-slate-500 font-normal">accounts</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span>Active Web / Hiring Surges</span>
          <span aria-hidden="true">·</span>
          <span>Last 7 days</span>
        </div>
      </div>
    </div>
  );
};
