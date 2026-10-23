import React from 'react';
import { Search, Sparkles, Plus, Command } from 'lucide-react';

interface NavbarProps {
  activeView: 'grid' | 'kanban' | 'persona' | 'intent' | 'campaigns';
  setActiveView: (view: 'grid' | 'kanban' | 'persona' | 'intent' | 'campaigns') => void;
  onOpenCopilot: () => void;
  onOpenNewAccount: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenCopilot,
  onOpenNewAccount,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3 bg-[#0B0D14]/90 backdrop-blur-md border-b border-white/[0.08]">
      {/* Zone 1: Brand Wordmark (Single clean text element in display face) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm">
            N
          </div>
          <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
            Nexus <span className="text-indigo-400 font-mono text-xs font-normal">CRM</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Single-line, concise labels with subtle underline/state) */}
      <nav className="hidden md:flex items-center gap-1 shrink-0 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
        <button
          onClick={() => setActiveView('grid')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'grid'
              ? 'bg-white/[0.1] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          数据总览 (Ledger)
        </button>
        <button
          onClick={() => setActiveView('kanban')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'kanban'
              ? 'bg-white/[0.1] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          商机看板 (Pipeline)
        </button>
        <button
          onClick={() => setActiveView('persona')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'persona'
              ? 'bg-white/[0.1] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          客户画像 (Persona)
        </button>
        <button
          onClick={() => setActiveView('intent')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'intent'
              ? 'bg-white/[0.1] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          意向雷达 (Radar)
        </button>
        <button
          onClick={() => setActiveView('campaigns')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeView === 'campaigns'
              ? 'bg-white/[0.1] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          营销战役 (ABM Studio)
        </button>
      </nav>

      {/* Zone 3: Actions & Affordances */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search */}
        <div className="relative hidden lg:block w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md pl-8 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-500 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.08]">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/40 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Copilot</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenNewAccount}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Account</span>
        </button>
      </div>
    </header>
  );
};
