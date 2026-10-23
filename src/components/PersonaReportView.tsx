import React, { useState } from 'react';
import { Account, CustomerPersona } from '../types/crm';
import { Sparkles, RefreshCw, Copy, Check, Users, Target, ShieldCheck, ArrowUpRight, Compass, Zap } from 'lucide-react';

interface PersonaReportViewProps {
  accounts: Account[];
  selectedAccount: Account;
  onSelectAccount: (account: Account) => void;
  onUpdateAccountPersona: (accountId: string, newPersona: CustomerPersona) => void;
  onOpenOutreach: (account: Account) => void;
}

export const PersonaReportView: React.FC<PersonaReportViewProps> = ({
  accounts,
  selectedAccount,
  onSelectAccount,
  onUpdateAccountPersona,
  onOpenOutreach,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const persona = selectedAccount.persona;

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: selectedAccount }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateAccountPersona(selectedAccount.id, data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = () => {
    if (persona?.actionableMarketingInsights?.tailoredPitchKicker) {
      navigator.clipboard.writeText(persona.actionableMarketingInsights.tailoredPitchKicker);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lifecycleStages = ['Prospect', 'High-Intent Evaluator', 'Active POC', 'Expansion Candidate', 'Advocate'];
  const currentStageIndex = persona ? lifecycleStages.indexOf(persona.lifecycleStage) : 0;

  return (
    <div className="space-y-5">
      {/* Top Header & Account Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI 客户画像智能报告 (Customer Persona Intelligence)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            深度整合客户基础数据、意向轨迹、技术栈特征及购买委员会偏好，生成多维可执行画像。
          </p>
        </div>

        {/* Account Selector + Regenerate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedAccount.id}
            onChange={(e) => {
              const acc = accounts.find((a) => a.id === e.target.value);
              if (acc) onSelectAccount(acc);
            }}
            className="bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#141721] text-slate-200">
                {a.name} (ICP {a.icpScore})
              </option>
            ))}
          </select>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'AI 分析中...' : '生成/更新画像'}</span>
          </button>
        </div>
      </div>

      {/* Main Persona Report Canvas */}
      {persona ? (
        <div className="space-y-4">
          {/* 1. Account Summary & Lifecycle Bar */}
          <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-white/[0.1] flex items-center justify-center font-bold text-base text-indigo-300">
                  {selectedAccount.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white">{selectedAccount.name}</span>
                    <span className="text-xs font-mono text-slate-400">{selectedAccount.domain}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-indigo-400">{selectedAccount.tier.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {persona.demographics.companyType}
                  </div>
                </div>
              </div>

              {/* Expansion & Churn Risk Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[11px] text-slate-400">增购与扩张潜力</div>
                  <div className="text-base font-semibold font-mono tabular-nums text-emerald-400">
                    {persona.expansionPotential}%
                  </div>
                </div>
                <div className="h-7 w-px bg-white/[0.08]" />
                <div>
                  <div className="text-[11px] text-slate-400">流失/阻滞风险</div>
                  <div className={`text-base font-semibold font-mono ${
                    persona.churnRisk === 'Low' ? 'text-slate-200' : 'text-amber-400'
                  }`}>
                    {persona.churnRisk}
                  </div>
                </div>
                <div className="h-7 w-px bg-white/[0.08]" />
                <div>
                  <div className="text-[11px] text-slate-400">决策速度</div>
                  <div className="text-base font-semibold text-slate-200 font-mono">
                    {persona.behavioralTraits.decisionVelocity}
                  </div>
                </div>
              </div>
            </div>

            {/* Lifecycle Stepper */}
            <div className="pt-4">
              <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                <span>客户全生命周期阶段 (Customer Lifecycle Position)</span>
                <span className="font-mono text-indigo-400 text-xs font-medium">{persona.lifecycleStage}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {lifecycleStages.map((stageName, idx) => {
                  const isCurrent = idx === currentStageIndex;
                  const isCompleted = idx < currentStageIndex;
                  return (
                    <div key={stageName} className="flex flex-col gap-1">
                      <div
                        className={`h-1.5 rounded-full transition-colors ${
                          isCurrent
                            ? 'bg-indigo-500'
                            : isCompleted
                            ? 'bg-indigo-900/80'
                            : 'bg-white/[0.06]'
                        }`}
                      />
                      <span className={`text-[10px] truncate ${isCurrent ? 'text-indigo-300 font-medium' : 'text-slate-500'}`}>
                        {stageName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Structured Persona Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Demographics & Firmographics */}
            <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Demographics &amp; 企业画像拓扑</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">组织类型</span>
                  <span className="text-slate-200 font-medium text-right">{persona.demographics.companyType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">地理区域</span>
                  <span className="text-slate-200 text-right">{persona.demographics.geography}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">规模与员工体量</span>
                  <span className="text-slate-200 text-right">{persona.demographics.scale}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">技术成熟度</span>
                  <span className="text-slate-200 text-right">{persona.demographics.techMaturity}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">关键决策人画像</span>
                  <span className="text-indigo-300 font-medium text-right">{persona.demographics.decisionMakerPersona}</span>
                </div>
              </div>
            </div>

            {/* Behavioral Traits & Channels */}
            <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>行为特征与渠道偏好 (Behavioral Pattern)</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">价格敏感度</span>
                  <span className="text-slate-200 font-mono">{persona.behavioralTraits.priceSensitivity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">决策与审批速度</span>
                  <span className="text-slate-200 font-mono">{persona.behavioralTraits.decisionVelocity}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">最有效沟通触达渠道</span>
                  <span className="text-slate-200 leading-relaxed block bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                    {persona.behavioralTraits.channelPreference}
                  </span>
                </div>
              </div>
            </div>

            {/* Interests & Buying Motives */}
            <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>兴趣偏好与核心购买动机</span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">关注技术与业务诉求:</span>
                  <div className="space-y-1">
                    {persona.interestsAndPreferences.map((pref, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-indigo-400 select-none">·</span>
                        <span>{pref}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-white/[0.04]">
                  <span className="text-[11px] text-slate-400 block mb-1.5">核心驱动动机 (Buying Motives):</span>
                  <div className="space-y-1">
                    {persona.buyingMotives.map((motive, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 select-none">·</span>
                        <span>{motive}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Latent Needs & Unexpressed Requirements */}
            <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>潜在深层需求挖掘 (Latent Architectural Needs)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                AI 基于其技术栈与行业演进所预测的潜在痛点与需求缺口：
              </p>
              <div className="space-y-2">
                {persona.latentNeeds.map((need, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200"
                  >
                    {need}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Actionable Marketing Insights (Guiding GTM Strategy) */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-700/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">
                  可执行市场策略建议 (Actionable GTM &amp; Marketing Insights)
                </span>
              </div>
              <button
                onClick={() => onOpenOutreach(selectedAccount)}
                className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1.5"
              >
                <span>基于此画像生成触达信</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-3 rounded bg-black/30 border border-white/[0.06]">
                <div className="text-[11px] text-indigo-300 font-medium mb-1">推荐营销策略定位:</div>
                <div className="text-slate-200">{persona.actionableMarketingInsights.strategy}</div>
              </div>
              <div className="p-3 rounded bg-black/30 border border-white/[0.06]">
                <div className="text-[11px] text-indigo-300 font-medium mb-1">首选切入角度 (Campaign Angle):</div>
                <div className="text-slate-200">{persona.actionableMarketingInsights.proposedCampaignAngle}</div>
              </div>
            </div>

            {/* Tailored Pitch Kicker */}
            <div className="p-3 rounded bg-black/40 border border-white/[0.08]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="font-mono text-indigo-400">定制化价值钩子 (Tailored Pitch Hook):</span>
                <button
                  onClick={handleCopyPitch}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '已复制' : '复制钩子'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                "{persona.actionableMarketingInsights.tailoredPitchKicker}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Zero-state */
        <div className="p-12 text-center rounded-lg bg-[#0E1017] border border-white/[0.08]">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-white mb-1">该客户尚未生成 AI 画像</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            点击下方按钮，由系统整合其历史数据、技术栈及意向信号，自主提炼关键特征与洞察报告。
          </p>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            {loading ? 'AI 智能分析中...' : '立即生成客户画像'}
          </button>
        </div>
      )}
    </div>
  );
};
