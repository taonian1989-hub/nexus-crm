import React, { useState } from 'react';
import { Account, AccountTier } from '../types/crm';
import { X, Sparkles, Building2 } from 'lucide-react';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Account) => void;
}

export const NewAccountModal: React.FC<NewAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('AI & Data Infrastructure');
  const [employeeCount, setEmployeeCount] = useState('1,000+');
  const [arrPotential, setArrPotential] = useState('180000');
  const [tier, setTier] = useState<AccountTier>('tier1');
  const [techStackInput, setTechStackInput] = useState('Kubernetes, Go, TypeScript, React');
  const [championName, setChampionName] = useState('');
  const [championTitle, setChampionTitle] = useState('');
  const [championEmail, setChampionEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);

    const generatedDomain = domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const techStack = techStackInput.split(',').map((s) => s.trim()).filter(Boolean);

    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name,
      domain: generatedDomain,
      industry,
      employeeCount,
      headquarters: 'San Francisco, CA',
      arrPotential: parseInt(arrPotential) || 150000,
      stage: 'target',
      tier,
      icpScore: 88,
      intentVelocity: 'high',
      techStack,
      lastActivity: '刚刚添加',
      summary: `${name} 是 ${industry} 领域重点关注的目标企业。`,
      contacts: championName
        ? [
            {
              id: `c_${Date.now()}`,
              name: championName,
              title: championTitle || 'VP of Engineering / GTM',
              email: championEmail || `contact@${generatedDomain}`,
              role: 'Champion',
              engagementScore: 75,
              lastContacted: '刚刚录入',
            },
          ]
        : [],
      intentSignals: [
        {
          id: `sig_${Date.now()}`,
          type: 'pricing_view',
          title: `访问了企业级定制集成 SLA 文档`,
          source: 'Reverse DNS',
          timestamp: '刚刚',
          intensity: 'high',
        },
      ],
    };

    // Auto run AI scoring in background
    try {
      const res = await fetch('/api/crm/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: newAccount }),
      });
      if (res.ok) {
        const scoreData = await res.json();
        newAccount.aiAnalysis = scoreData;
        newAccount.icpScore = scoreData.overallScore || 88;
      }
    } catch (err) {
      console.error(err);
    }

    onAddAccount(newAccount);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-lg bg-[#12151F] border border-white/[0.1] p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">录入新目标客户并启动 AI 审计</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">企业名称 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：Palantir"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">官方域名</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="例如：palantir.com"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">所属行业</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">企业规模 (FTEs)</label>
              <input
                type="text"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">预估 ARR 规模 (USD)</label>
              <input
                type="number"
                value={arrPotential}
                onChange={(e) => setArrPotential(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">客户优先级分级</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="tier1" className="bg-[#141721]">Tier 1 (战略高优先级)</option>
                <option value="tier2" className="bg-[#141721]">Tier 2 (重点跟进)</option>
                <option value="tier3" className="bg-[#141721]">Tier 3 (标准观察)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">技术栈标签 (逗号分隔)</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              关联主要技术联系人 (可选)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="姓名"
                value={championName}
                onChange={(e) => setChampionName(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="职务 (如 VP Eng)"
                value={championTitle}
                onChange={(e) => setChampionTitle(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-hidden"
              />
              <input
                type="email"
                placeholder="工作邮箱"
                value={championEmail}
                onChange={(e) => setChampionEmail(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'AI 正在自动画像与打分...' : '确认录入并启动 AI 审计'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
