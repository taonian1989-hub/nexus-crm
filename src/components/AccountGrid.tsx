import React, { useState } from 'react';
import { Account, AccountStage } from '../types/crm';
import { ArrowUpDown, ChevronRight, Sparkles, Building2, ExternalLink } from 'lucide-react';

interface AccountGridProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onUpdateStage: (accountId: string, newStage: AccountStage) => void;
  onRunAIAudit: (account: Account) => void;
}

export const AccountGrid: React.FC<AccountGridProps> = ({
  accounts,
  onSelectAccount,
  onUpdateStage,
  onRunAIAudit,
}) => {
  const [sortField, setSortField] = useState<'name' | 'icpScore' | 'arrPotential'>('icpScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'icpScore' | 'arrPotential') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'icpScore') {
      comparison = a.icpScore - b.icpScore;
    } else if (sortField === 'arrPotential') {
      comparison = a.arrPotential - b.arrPotential;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getStageLabel = (stage: AccountStage) => {
    switch (stage) {
      case 'target':
        return 'Target';
      case 'engaged':
        return 'Engaged';
      case 'qualified':
        return 'Qualified';
      case 'opportunity':
        return 'Opportunity';
      case 'closed_won':
        return 'Closed Won';
      case 'closed_lost':
        return 'Closed Lost';
      default:
        return stage;
    }
  };

  const getStageColor = (stage: AccountStage) => {
    switch (stage) {
      case 'closed_won':
        return 'text-emerald-400';
      case 'opportunity':
        return 'text-indigo-400';
      case 'qualified':
        return 'text-sky-400';
      case 'engaged':
        return 'text-amber-400';
      case 'closed_lost':
        return 'text-slate-500';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#0E1017]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-medium select-none">
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 font-medium hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Account &amp; Domain</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('icpScore')}
                className="py-3 px-4 font-medium hover:text-white cursor-pointer transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>AI ICP Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Stage</th>
              <th
                onClick={() => handleSort('arrPotential')}
                className="py-3 px-4 font-medium hover:text-white cursor-pointer transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>ARR Target</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Intent Velocity</th>
              <th className="py-3 px-4 font-medium">Key Champion</th>
              <th className="py-3 px-4 font-medium">Tech Stack</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {sortedAccounts.map((account) => {
              const primaryContact = account.contacts[0];
              const scorePercent = account.icpScore;

              return (
                <tr
                  key={account.id}
                  onClick={() => onSelectAccount(account)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Account Name & Domain */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-semibold text-slate-300 text-xs shrink-0">
                        {account.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{account.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {account.tier.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <span>{account.domain}</span>
                          <span aria-hidden="true">·</span>
                          <span>{account.employeeCount}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AI ICP Score */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-mono text-sm font-semibold text-slate-100 tabular-nums">
                        {account.icpScore}
                      </span>
                      <div className="w-16 h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            scorePercent >= 90
                              ? 'bg-emerald-500'
                              : scorePercent >= 80
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Stage Dropdown */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={account.stage}
                      onChange={(e) => onUpdateStage(account.id, e.target.value as AccountStage)}
                      className={`bg-transparent text-xs font-medium focus:outline-hidden cursor-pointer ${getStageColor(
                        account.stage
                      )}`}
                    >
                      <option value="target" className="bg-[#141721] text-slate-300">Target</option>
                      <option value="engaged" className="bg-[#141721] text-slate-300">Engaged</option>
                      <option value="qualified" className="bg-[#141721] text-slate-300">Qualified</option>
                      <option value="opportunity" className="bg-[#141721] text-slate-300">Opportunity</option>
                      <option value="closed_won" className="bg-[#141721] text-slate-300">Closed Won</option>
                      <option value="closed_lost" className="bg-[#141721] text-slate-300">Closed Lost</option>
                    </select>
                  </td>

                  {/* ARR Target */}
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-200 tabular-nums">
                    ${(account.arrPotential || 0).toLocaleString()}
                  </td>

                  {/* Intent Velocity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`font-medium ${
                          account.intentVelocity === 'surge'
                            ? 'text-amber-400'
                            : account.intentVelocity === 'high'
                            ? 'text-indigo-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {account.intentVelocity === 'surge'
                          ? 'Surge'
                          : account.intentVelocity === 'high'
                          ? 'High'
                          : 'Normal'}
                      </span>
                      <span className="text-[11px] text-slate-600 font-mono">
                        {account.intentSignals.length} signals
                      </span>
                    </div>
                  </td>

                  {/* Key Champion */}
                  <td className="py-3 px-4">
                    {primaryContact ? (
                      <div className="min-w-0">
                        <div className="text-slate-200 truncate">{primaryContact.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{primaryContact.title}</div>
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">No contact assigned</span>
                    )}
                  </td>

                  {/* Tech Stack */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 max-w-[180px] overflow-hidden text-[11px] text-slate-400 font-mono">
                      {account.techStack.slice(0, 3).join(' · ')}
                      {account.techStack.length > 3 && (
                        <span className="text-slate-600">+{account.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onRunAIAudit(account)}
                        title="Run AI Account Audit"
                        className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-white/[0.06] rounded transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectAccount(account)}
                        title="Open Details"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedAccounts.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No target accounts found matching criteria.</p>
        </div>
      )}
    </div>
  );
};
