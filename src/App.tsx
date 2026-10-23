import React, { useState, useEffect } from 'react';
import { Account, AccountStage, AccountTier, Campaign, AIScoreBreakdown, CustomerPersona } from './types/crm';
import { INITIAL_ACCOUNTS, INITIAL_CAMPAIGNS } from './data/mockAccounts';
import { Navbar } from './components/Navbar';
import { KPIRow } from './components/KPIRow';
import { AccountGrid } from './components/AccountGrid';
import { KanbanBoard } from './components/KanbanBoard';
import { IntentRadar } from './components/IntentRadar';
import { CampaignStudio } from './components/CampaignStudio';
import { PersonaReportView } from './components/PersonaReportView';
import { AccountDrawer } from './components/AccountDrawer';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { NewAccountModal } from './components/NewAccountModal';
import { Filter, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeView, setActiveView] = useState<'grid' | 'kanban' | 'persona' | 'intent' | 'campaigns'>('grid');

  // Drawer & Modal States
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [personaAccount, setPersonaAccount] = useState<Account>(INITIAL_ACCOUNTS[0]);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<AccountStage | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<AccountTier | 'all'>('all');

  // Global Keyboard Shortcut: Cmd/Ctrl + K to open Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Account Stage
  const handleUpdateStage = (accountId: string, newStage: AccountStage) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, stage: newStage } : acc))
    );
    if (selectedAccount?.id === accountId) {
      setSelectedAccount((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  // Update Account Analysis
  const handleUpdateAnalysis = (accountId: string, newAnalysis: AIScoreBreakdown) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, aiAnalysis: newAnalysis, icpScore: newAnalysis.overallScore }
          : acc
      )
    );
    if (selectedAccount?.id === accountId) {
      setSelectedAccount((prev) =>
        prev
          ? { ...prev, aiAnalysis: newAnalysis, icpScore: newAnalysis.overallScore }
          : null
      );
    }
  };

  // Update Account Persona
  const handleUpdatePersona = (accountId: string, newPersona: CustomerPersona) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, persona: newPersona } : acc))
    );
    if (selectedAccount?.id === accountId) {
      setSelectedAccount((prev) => (prev ? { ...prev, persona: newPersona } : null));
    }
    if (personaAccount.id === accountId) {
      setPersonaAccount((prev) => ({ ...prev, persona: newPersona }));
    }
  };

  // Add Account
  const handleAddAccount = (newAccount: Account) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  // Create Campaign
  const handleCreateCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  // Open Drawer from anywhere
  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  // Quick Open Outreach from Intent Radar or Persona
  const handleOpenOutreach = (account: Account) => {
    setSelectedAccount(account);
  };

  // Filtered Accounts
  const filteredAccounts = accounts.filter((account) => {
    if (stageFilter !== 'all' && account.stage !== stageFilter) return false;
    if (tierFilter !== 'all' && account.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = account.name.toLowerCase().includes(q);
      const matchDomain = account.domain.toLowerCase().includes(q);
      const matchIndustry = account.industry.toLowerCase().includes(q);
      const matchTech = account.techStack.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDomain && !matchIndustry && !matchTech) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Bar Contract (Wordmark - Navigation Links - Actions) */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenNewAccount={() => setIsNewAccountModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* KPI Summary Strip */}
        <KPIRow accounts={accounts} />

        {/* Views Container */}
        {activeView === 'grid' && (
          <div className="space-y-4">
            {/* Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400 font-medium">快捷筛选:</span>

                {/* Stage Filter */}
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value as any)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-[#141721]">全阶段 (All Stages)</option>
                  <option value="target" className="bg-[#141721]">Target</option>
                  <option value="engaged" className="bg-[#141721]">Engaged</option>
                  <option value="qualified" className="bg-[#141721]">Qualified</option>
                  <option value="opportunity" className="bg-[#141721]">Opportunity</option>
                  <option value="closed_won" className="bg-[#141721]">Closed Won</option>
                </select>

                {/* Tier Filter */}
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as any)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-[#141721]">全部分级 (All Tiers)</option>
                  <option value="tier1" className="bg-[#141721]">Tier 1 (战略级)</option>
                  <option value="tier2" className="bg-[#141721]">Tier 2 (核心级)</option>
                  <option value="tier3" className="bg-[#141721]">Tier 3 (标准级)</option>
                </select>

                {(stageFilter !== 'all' || tierFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setStageFilter('all');
                      setTierFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 ml-1 cursor-pointer"
                  >
                    重置筛选
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500 font-mono tabular-nums">
                显示 {filteredAccounts.length} / {accounts.length} 家目标企业
              </div>
            </div>

            {/* High-Density Account Grid */}
            <AccountGrid
              accounts={filteredAccounts}
              onSelectAccount={handleSelectAccount}
              onUpdateStage={handleUpdateStage}
              onRunAIAudit={handleSelectAccount}
            />
          </div>
        )}

        {activeView === 'kanban' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div>
                <h2 className="text-xs font-semibold text-white">B2B ABM 商机推进看板</h2>
                <p className="text-[11px] text-slate-400">直观跟踪大客户从 Target、Engaged 到 Qualified 及 POC 签约全生命周期。</p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {accounts.length} 目标账户
              </div>
            </div>

            <KanbanBoard
              accounts={filteredAccounts}
              onSelectAccount={handleSelectAccount}
              onUpdateStage={handleUpdateStage}
              onRunAIAudit={handleSelectAccount}
            />
          </div>
        )}

        {activeView === 'persona' && (
          <PersonaReportView
            accounts={accounts}
            selectedAccount={personaAccount}
            onSelectAccount={(acc) => setPersonaAccount(acc)}
            onUpdateAccountPersona={handleUpdatePersona}
            onOpenOutreach={handleOpenOutreach}
          />
        )}

        {activeView === 'intent' && (
          <IntentRadar
            accounts={accounts}
            onSelectAccount={handleSelectAccount}
            onOpenOutreach={handleOpenOutreach}
          />
        )}

        {activeView === 'campaigns' && (
          <CampaignStudio
            campaigns={campaigns}
            accounts={accounts}
            onCreateCampaign={handleCreateCampaign}
            onSelectAccount={handleSelectAccount}
          />
        )}
      </main>

      {/* Slide-over Account Detail & AI Audit Drawer */}
      <AccountDrawer
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
        onUpdateStage={handleUpdateStage}
        onUpdateAnalysis={handleUpdateAnalysis}
        onUpdatePersona={handleUpdatePersona}
      />

      {/* Slide-over AI Copilot & Command Palette */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        accounts={accounts}
        onSelectAccountByName={(name) => {
          const acc = accounts.find((a) => a.name.toLowerCase() === name.toLowerCase());
          if (acc) setSelectedAccount(acc);
        }}
      />

      {/* New Account Creation Modal */}
      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
}
