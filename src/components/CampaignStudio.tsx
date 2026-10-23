import React, { useState } from 'react';
import { Campaign, Account } from '../types/crm';
import { Sparkles, Plus, CheckCircle2, Target, Lightbulb } from 'lucide-react';
import { CampaignRecommendationEngine } from './CampaignRecommendationEngine';

interface CampaignStudioProps {
  campaigns: Campaign[];
  accounts: Account[];
  onCreateCampaign: (campaign: Campaign) => void;
  onSelectAccount: (account: Account) => void;
}

export const CampaignStudio: React.FC<CampaignStudioProps> = ({
  campaigns,
  accounts,
  onCreateCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'campaigns'>('recommendations');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState<Campaign['type']>('abm_executive');
  const [objective, setObjective] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName) return;

    setIsGenerating(true);
    // Simulate / fetch AI playbook generation
    setTimeout(() => {
      const newCamp: Campaign = {
        id: `camp_${Date.now()}`,
        name: campaignName,
        type: campaignType,
        status: 'active',
        targetAccountCount: Math.min(8, accounts.length),
        touchpointCadence: [
          'Touch 1: Executive FDE Peer Outreach (Multi-Region Benchmark)',
          'Touch 2: LinkedIn Connection Request with Architecture Visual',
          'Touch 3: Private Sandbox Instance Provisioning Invitation',
          'Touch 4: 15-Minute Technical Discovery & Q4 Alignment'
        ],
        openRate: 68,
        replyRate: 34,
        createdDate: 'Today',
        description: objective || 'Autonomous multi-touch ABM acceleration playbook for target accounts.'
      };
      onCreateCampaign(newCamp);
      setIsGenerating(false);
      setShowCreateModal(false);
      setCampaignName('');
      setObjective('');
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0E1017] border border-white/[0.08]">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <span>ABM 营销战役工作室 &amp; 智能推荐中心</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            编排针对高价值大客户的个性化多触点营销工作流，利用 AI 算法推演最佳活动类型与渠道组合。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-md border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'recommendations'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 活动推荐与预测</span>
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === 'campaigns'
                  ? 'bg-white/[0.1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              进行中战役 ({campaigns.length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建战役</span>
          </button>
        </div>
      </div>

      {/* Render AI Recommendation Engine or Active Campaigns Grid */}
      {activeTab === 'recommendations' ? (
        <CampaignRecommendationEngine
          accounts={accounts}
          pastCampaigns={campaigns}
          onApplyRecommendation={(newCamp) => {
            onCreateCampaign(newCamp);
            setActiveTab('campaigns');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-100 line-clamp-1">
                    {camp.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      camp.status === 'active'
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                        : 'text-slate-400 bg-white/[0.04]'
                    }`}
                  >
                    {camp.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {camp.description}
                </p>

                {/* Cadence Steps */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] text-slate-500 font-medium">执行触点序列:</div>
                  {camp.touchpointCadence.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{step}</span>
                    </div>
                  ))}
                  {camp.touchpointCadence.length > 3 && (
                    <div className="text-[10px] text-slate-500 pl-5">
                      +{camp.touchpointCadence.length - 3} 更多触点
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Strip */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono tabular-nums">
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  <span>{camp.targetAccountCount} 目标客户</span>
                </div>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span>打开率 {camp.openRate}%</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-indigo-400 font-medium">回复率 {camp.replyRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg bg-[#12151F] border border-white/[0.1] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>生成 AI 原生 ABM 营销战役</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>

            <form onSubmit={handleGenerateAndSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  营销战役名称
                </label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="例如：Tier-1 基础设施大客户技术置换计划"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  战役模式 / 类型
                </label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value as any)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  <option value="abm_executive" className="bg-[#141721]">高管直通 ABM (Executive Peer Outreach)</option>
                  <option value="technical_deep_dive" className="bg-[#141721]">FDE 架构评测与基准对比 (Technical Deep Dive)</option>
                  <option value="competitor_displace" className="bg-[#141721]">竞品置换攻坚 (Competitor Displacement)</option>
                  <option value="product_launch" className="bg-[#141721]">新产品/特性定向催化 (Targeted Feature Launch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  营销目标与核心诉求
                </label>
                <textarea
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="描述目标人群核心痛点、预期产出（如邀约技术评审会议）..."
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'AI 编排中...' : '生成并启动战役'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
