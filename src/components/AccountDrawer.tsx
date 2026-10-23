import React, { useState, useEffect } from 'react';
import { Account, AccountStage, Contact, AIScoreBreakdown, CustomerPersona } from '../types/crm';
import { X, Sparkles, Send, Copy, Check, ExternalLink, RefreshCw, Users, Shield, Target, Zap, Clock, Terminal } from 'lucide-react';

interface AccountDrawerProps {
  account: Account | null;
  onClose: () => void;
  onUpdateStage: (accountId: string, newStage: AccountStage) => void;
  onUpdateAnalysis: (accountId: string, newAnalysis: AIScoreBreakdown) => void;
  onUpdatePersona: (accountId: string, newPersona: CustomerPersona) => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  account,
  onClose,
  onUpdateStage,
  onUpdateAnalysis,
  onUpdatePersona,
}) => {
  const [activeTab, setActiveTab] = useState<'persona' | 'scoring' | 'contacts' | 'outreach' | 'signals'>('persona');
  const [scoringLoading, setScoringLoading] = useState(false);
  const [personaLoading, setPersonaLoading] = useState(false);

  // Outreach Studio State
  const [outreachContact, setOutreachContact] = useState<Contact | null>(account?.contacts[0] || null);
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'linkedin'>('email');
  const [outreachObjective, setOutreachObjective] = useState('预约 15 分钟 FDE 架构与性能基准评测');
  const [generatedOutreach, setGeneratedOutreach] = useState<string>('');
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // Sync contact when account changes
  useEffect(() => {
    if (account?.contacts?.[0]) {
      setOutreachContact(account.contacts[0]);
    }
  }, [account?.id]);

  if (!account) return null;

  // Trigger Re-score with AI
  const handleRescore = async () => {
    setScoringLoading(true);
    try {
      const res = await fetch('/api/crm/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateAnalysis(account.id, data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setScoringLoading(false);
    }
  };

  // Trigger Regenerate Persona
  const handleRegeneratePersona = async () => {
    setPersonaLoading(true);
    try {
      const res = await fetch('/api/crm/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdatePersona(account.id, data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPersonaLoading(false);
    }
  };

  // Generate Outreach via Gemini
  const handleGenerateOutreach = async () => {
    setOutreachLoading(true);
    try {
      const res = await fetch('/api/crm/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account,
          contact: outreachContact,
          channel: outreachChannel,
          objective: outreachObjective,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedOutreach(data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOutreachLoading(false);
    }
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(generatedOutreach);
    setCopiedOutreach(true);
    setTimeout(() => setCopiedOutreach(false), 2000);
  };

  const analysis = account.aiAnalysis;
  const persona = account.persona;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl h-full bg-[#0E1017] border-l border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0A0C13]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-bold text-base text-slate-100 shrink-0">
                {account.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white tracking-tight">
                    {account.name}
                  </h2>
                  <span className="text-xs font-mono text-slate-500">{account.tier.toUpperCase()}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <a
                    href={`https://${account.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>{account.domain}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{account.industry}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{account.employeeCount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar & Stage Selector */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] text-slate-500 block">ARR 潜力:</span>
                <span className="font-mono font-semibold text-slate-200 tabular-nums">
                  ${(account.arrPotential || 0).toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-px bg-white/[0.08]" />
              <div>
                <span className="text-[11px] text-slate-500 block">AI ICP 得分:</span>
                <span className="font-mono font-semibold text-indigo-400 tabular-nums">
                  {account.icpScore} / 100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">管线阶段:</span>
              <select
                value={account.stage}
                onChange={(e) => onUpdateStage(account.id, e.target.value as AccountStage)}
                className="bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="target" className="bg-[#141721]">Target</option>
                <option value="engaged" className="bg-[#141721]">Engaged</option>
                <option value="qualified" className="bg-[#141721]">Qualified</option>
                <option value="opportunity" className="bg-[#141721]">Opportunity</option>
                <option value="closed_won" className="bg-[#141721]">Closed Won</option>
                <option value="closed_lost" className="bg-[#141721]">Closed Lost</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4 pt-2 border-t border-white/[0.04] overflow-x-auto">
            <button
              onClick={() => setActiveTab('persona')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'persona'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI 客户画像 (Persona)</span>
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'scoring'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>智能评分 &amp; 审计</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'contacts'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>决策委员会 ({account.contacts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'outreach'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>个性化触达工作台</span>
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'signals'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>意向流水 ({account.intentSignals.length})</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: AI CUSTOMER PERSONA */}
          {activeTab === 'persona' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  多维客户画像与购买特征分析
                </span>
                <button
                  onClick={handleRegeneratePersona}
                  disabled={personaLoading}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${personaLoading ? 'animate-spin' : ''}`} />
                  <span>{personaLoading ? '分析中...' : '重新生成画像'}</span>
                </button>
              </div>

              {persona ? (
                <div className="space-y-3">
                  {/* Demographics Card */}
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-xs space-y-2">
                    <div className="text-[11px] text-indigo-400 font-mono font-medium">
                      01. DEMOGRAPHICS &amp; 企业画像拓扑
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">公司属性:</span>
                        <span>{persona.demographics.companyType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">地理区域:</span>
                        <span>{persona.demographics.geography}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">技术成熟度:</span>
                        <span>{persona.demographics.techMaturity}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">核心决策者:</span>
                        <span className="text-indigo-300">{persona.demographics.decisionMakerPersona}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interests & Motives */}
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-xs space-y-3">
                    <div className="text-[11px] text-indigo-400 font-mono font-medium">
                      02. 兴趣诉求与核心购买动机
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">关注技术领域:</span>
                      <div className="space-y-1">
                        {persona.interestsAndPreferences.map((pref, i) => (
                          <div key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400">·</span>
                            <span>{pref}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.04]">
                      <span className="text-[10px] text-slate-500 block mb-1">关键推动动机 (Motives):</span>
                      <div className="space-y-1">
                        {persona.buyingMotives.map((motive, i) => (
                          <div key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400">·</span>
                            <span>{motive}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Latent Needs */}
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-xs space-y-2">
                    <div className="text-[11px] text-indigo-400 font-mono font-medium">
                      03. 潜在隐性需求挖掘 (LATENT NEEDS)
                    </div>
                    <div className="space-y-1.5">
                      {persona.latentNeeds.map((need, i) => (
                        <div key={i} className="p-2 rounded bg-white/[0.02] text-slate-300 text-xs">
                          {need}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actionable Hook */}
                  <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-700/30 text-xs space-y-2">
                    <div className="text-[11px] text-indigo-300 font-medium">
                      推荐切入价值钩子 (Tailored Pitch Hook):
                    </div>
                    <p className="text-slate-200 leading-relaxed font-mono">
                      "{persona.actionableMarketingInsights.tailoredPitchKicker}"
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('outreach');
                        setOutreachObjective(persona.actionableMarketingInsights.strategy);
                      }}
                      className="mt-2 px-3 py-1 text-[11px] font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors cursor-pointer"
                    >
                      直接基于此画像发起触达 &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  暂无画像数据，请点击右上角立即生成。
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI LEAD SCORING & AUDIT */}
          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  多维度可解释 AI 评分矩阵
                </span>
                <button
                  onClick={handleRescore}
                  disabled={scoringLoading}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${scoringLoading ? 'animate-spin' : ''}`} />
                  <span>{scoringLoading ? 'AI 计算中...' : '重新计算评分'}</span>
                </button>
              </div>

              {analysis ? (
                <div className="space-y-4">
                  {/* Overall & 4 Sub-Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 block">企业画像匹配</span>
                      <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                        {analysis.firmographicScore}/100
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 block">技术栈适配度</span>
                      <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                        {analysis.techStackScore}/100
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 block">意向活跃烈度</span>
                      <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                        {analysis.intentScore}/100
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-500 block">采购预算准备度</span>
                      <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                        {analysis.readinessScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Strategic Angle & Rationale */}
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">核心切入角度 (Strategic Wedge):</span>
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {analysis.strategicAngle}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/[0.04]">
                      <span className="text-slate-500 text-[10px] block">评分综合推导逻辑 (Rationale):</span>
                      <p className="text-slate-400 leading-relaxed">
                        {analysis.rationale}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Next Action */}
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs">
                    <span className="text-indigo-400 font-medium block text-[11px] mb-1">
                      FDE 推荐执行策略:
                    </span>
                    <p className="text-slate-200">
                      {analysis.recommendedNextAction}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  暂无深度审计数据，点击右上角重新计算。
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BUYING COMMITTEE */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white block">
                购买决策委员会成员与活跃度
              </span>

              {account.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100">{contact.name}</span>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
                        {contact.role}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-0.5">{contact.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {contact.email}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">活跃分</div>
                    <div className="font-mono text-sm font-semibold text-emerald-400 tabular-nums">
                      {contact.engagementScore}
                    </div>
                    <button
                      onClick={() => {
                        setOutreachContact(contact);
                        setActiveTab('outreach');
                      }}
                      className="mt-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                    >
                      拟写触达 &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: OUTREACH STUDIO */}
          {activeTab === 'outreach' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-white block">
                  AI 个性化 ABM 触达信工坊
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  由 Gemini 融合该客户技术栈、购买动机及决策人画像，生成同行对同行的专业触达文案。
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">触达对象</label>
                    <select
                      value={outreachContact?.id}
                      onChange={(e) => {
                        const c = account.contacts.find((x) => x.id === e.target.value);
                        if (c) setOutreachContact(c);
                      }}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
                    >
                      {account.contacts.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#141721]">
                          {c.name} ({c.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">触达渠道</label>
                    <select
                      value={outreachChannel}
                      onChange={(e) => setOutreachChannel(e.target.value as any)}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
                    >
                      <option value="email" className="bg-[#141721]">FDE 点对点深度邮件</option>
                      <option value="linkedin" className="bg-[#141721]">LinkedIn InMail</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">核心诉求 / 目标</label>
                  <input
                    type="text"
                    value={outreachObjective}
                    onChange={(e) => setOutreachObjective(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={handleGenerateOutreach}
                  disabled={outreachLoading}
                  className="w-full py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${outreachLoading ? 'animate-spin' : ''}`} />
                  <span>{outreachLoading ? '正在基于画像生成文案...' : '生成定制化 ABM 触达信'}</span>
                </button>

                {/* Generated Content Box */}
                {generatedOutreach && (
                  <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>文案预览:</span>
                      <button
                        onClick={handleCopyOutreach}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedOutreach ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedOutreach ? '已复制' : '复制文案'}</span>
                      </button>
                    </div>
                    <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {generatedOutreach}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INTENT SIGNALS */}
          {activeTab === 'signals' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white block">
                意向轨迹与遥测信号流水
              </span>
              {account.intentSignals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-medium">{sig.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>数据源: {sig.source}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sig.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
