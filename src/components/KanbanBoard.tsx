import React from 'react';
import { Account, AccountStage } from '../types/crm';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface KanbanBoardProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onUpdateStage: (accountId: string, newStage: AccountStage) => void;
  onRunAIAudit: (account: Account) => void;
}

const STAGES: { id: AccountStage; label: string; description: string }[] = [
  { id: 'target', label: 'Target', description: 'ICP Accounts to nurture' },
  { id: 'engaged', label: 'Engaged', description: 'Signal or content response' },
  { id: 'qualified', label: 'Qualified', description: 'FDE Discovery verified' },
  { id: 'opportunity', label: 'Opportunity', description: 'Active POC & proposal' },
  { id: 'closed_won', label: 'Closed Won', description: 'Enterprise customer' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  accounts,
  onSelectAccount,
  onUpdateStage,
  onRunAIAudit,
}) => {
  const getNextStage = (current: AccountStage): AccountStage | null => {
    const sequence: AccountStage[] = ['target', 'engaged', 'qualified', 'opportunity', 'closed_won'];
    const idx = sequence.indexOf(current);
    return idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  const getPrevStage = (current: AccountStage): AccountStage | null => {
    const sequence: AccountStage[] = ['target', 'engaged', 'qualified', 'opportunity', 'closed_won'];
    const idx = sequence.indexOf(current);
    return idx > 0 ? sequence[idx - 1] : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full pb-6">
      {STAGES.map((stage) => {
        const stageAccounts = accounts.filter((a) => a.stage === stage.id);
        const stageARR = stageAccounts.reduce((sum, a) => sum + (a.arrPotential || 0), 0);

        return (
          <div
            key={stage.id}
            className="flex flex-col rounded-lg bg-[#0E1017] border border-white/[0.08] min-h-[550px]"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">{stage.label}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {stageAccounts.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                  ${(stageARR / 1000).toFixed(0)}k ARR
                </div>
              </div>
            </div>

            {/* Account Cards Container */}
            <div className="p-2 flex-1 flex flex-col gap-2 overflow-y-auto">
              {stageAccounts.map((account) => {
                const next = getNextStage(account.stage);
                const prev = getPrevStage(account.stage);

                return (
                  <div
                    key={account.id}
                    onClick={() => onSelectAccount(account)}
                    className="p-3 rounded-md bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group flex flex-col gap-2 shadow-xs"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-medium text-slate-100 group-hover:text-indigo-400 transition-colors">
                          {account.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {account.domain} · {account.tier.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs font-semibold tabular-nums text-slate-300">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            account.icpScore >= 90
                              ? 'bg-emerald-400'
                              : account.icpScore >= 80
                              ? 'bg-indigo-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        {account.icpScore}
                      </div>
                    </div>

                    {/* Metric / ARR */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.04] pt-2">
                      <span className="font-mono tabular-nums text-slate-200">
                        ${(account.arrPotential || 0).toLocaleString()}
                      </span>
                      <span
                        className={
                          account.intentVelocity === 'surge'
                            ? 'text-amber-400 font-medium'
                            : 'text-slate-500'
                        }
                      >
                        {account.intentVelocity === 'surge' ? 'Intent Surge' : `${account.intentSignals.length} signals`}
                      </span>
                    </div>

                    {/* Key Contact */}
                    {account.contacts[0] && (
                      <div className="text-[10px] text-slate-500 truncate">
                        Lead: <span className="text-slate-300">{account.contacts[0].name}</span> ({account.contacts[0].role})
                      </div>
                    )}

                    {/* Quick Card Controls */}
                    <div
                      className="flex items-center justify-between pt-1 border-t border-white/[0.04] opacity-80 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onRunAIAudit(account)}
                        title="AI Lead Audit"
                        className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-white/[0.06] rounded transition-colors text-[10px] flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>AI Audit</span>
                      </button>

                      <div className="flex items-center gap-0.5">
                        {prev && (
                          <button
                            onClick={() => onUpdateStage(account.id, prev)}
                            title="Move back"
                            className="p-1 text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] rounded transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {next && (
                          <button
                            onClick={() => onUpdateStage(account.id, next)}
                            title="Advance stage"
                            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06] rounded transition-colors flex items-center gap-0.5 text-[10px]"
                          >
                            <span>Move</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {stageAccounts.length === 0 && (
                <div className="py-8 text-center text-slate-600 text-xs italic">
                  No accounts in {stage.label}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
