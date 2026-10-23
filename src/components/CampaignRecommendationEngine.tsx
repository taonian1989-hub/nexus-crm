import React, { useState, useEffect } from 'react';
import { Account, Campaign, CampaignRecommendation, CampaignSimulationResult } from '../types/crm';
import { Sparkles, RefreshCw, TrendingUp, CheckCircle, ArrowRight, BarChart2, ShieldCheck, Zap, Mail, MessageSquare, Share2 } from 'lucide-react';

interface CampaignRecommendationEngineProps {
  accounts: Account[];
  pastCampaigns: Campaign[];
  onApplyRecommendation: (campaign: Campaign) => void;
}

export const CampaignRecommendationEngine: React.FC<CampaignRecommendationEngineProps> = ({
  accounts,
  pastCampaigns,
  onApplyRecommendation,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('Tier-1 基础设施与云原生大客户群');
  const [loading, setLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<CampaignSimulationResult | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm/recommend-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSegment: selectedSegment,
          accounts,
          pastCampaigns,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedSegment]);

  const handleLaunchCampaign = (rec: CampaignRecommendation) => {
    const newCamp: Campaign = {
      id: `camp_ai_${Date.now()}`,
      name: `AI 推荐: ${rec.campaignType.split('(')[0].trim()}`,
      type: 'abm_executive',
      status: 'active',
      targetAccountCount: Math.min(8, accounts.length),
      touchpointCadence: [
        `触点 1: ${rec.bestChannel} 首轮精准切入`,
        '触点 2: FDE 架构白皮书与基准测试数据分享',
        '触点 3: 专属 15 分钟技术对齐与 POC 预演',
      ],
      openRate: 72,
      replyRate: rec.predictedImpact.expectedReplyRate || 38,
      createdDate: '刚刚生成',
      description: `${rec.whyThisWorks} 渠道组合: ${rec.channelMixAllocation.map((c) => `${c.channel} (${c.percentage}%)`).join(', ')}`,
    };
    onApplyRecommendation(newCamp);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Control Header */}
      <div className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              智能营销活动推荐与转化预测引擎 (Smart Campaign Recommender)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            结合目标群体客户画像拓扑与过往营销效能数据，自动推演最优活动形态与多渠道触达组合。
          </p>
        </div>

        {/* Segment selector & rerun button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="Tier-1 基础设施与云原生大客户群" className="bg-[#141721]">Tier-1 基础设施大客户群 (Snowflake/Stripe等)</option>
            <option value="高意向待转化群体 (High Intent Surge)" className="bg-[#141721]">高意向待转化客户 (7天内活跃访客)</option>
            <option value="全量潜在客户 (All Target Prospects)" className="bg-[#141721]">全量潜在客户 (全周期培育)</option>
          </select>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'AI 算法推演中...' : '重新推演'}</span>
          </button>
        </div>
      </div>

      {simulationResult ? (
        <div className="space-y-4">
          {/* Executive Simulation Overview */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-medium text-indigo-300">全局推演预测概览</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {simulationResult.strategicSummary}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div>
                  <div className="text-[11px] text-slate-400">综合预期转化率</div>
                  <div className="text-base font-semibold font-mono tabular-nums text-emerald-400">
                    +{simulationResult.overallProjectedConversion}%
                  </div>
                </div>
                <div className="h-7 w-px bg-white/[0.08]" />
                <div>
                  <div className="text-[11px] text-slate-400">最佳触达时段</div>
                  <div className="text-xs font-mono text-slate-200 mt-0.5">
                    {simulationResult.bestTimeToDeliver}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Campaigns Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {simulationResult.recommendedCampaigns.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#0E1017] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Confidence */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {rec.campaignType}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.5 rounded shrink-0">
                      置信度 {rec.confidenceScore}%
                    </span>
                  </div>

                  {/* Best Channel */}
                  <div className="text-xs text-slate-400 mb-2.5">
                    <span className="text-slate-500 font-medium">最佳渠道: </span>
                    <span className="text-indigo-300 font-medium">{rec.bestChannel}</span>
                  </div>

                  {/* Predicted Impact Badges */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-white/[0.02] border border-white/[0.04] mb-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">预期转化提升</div>
                      <div className="font-mono font-semibold text-emerald-400 text-xs">
                        {rec.predictedImpact.conversionLift}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">新增管线潜力</div>
                      <div className="font-mono font-semibold text-indigo-300 text-xs">
                        {rec.predictedImpact.estimatedPipelineUplift}
                      </div>
                    </div>
                  </div>

                  {/* Why this works */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {rec.whyThisWorks}
                  </p>

                  {/* Channel Mix Allocation Simulation */}
                  <div className="mb-3">
                    <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                      推荐渠道组合配比 (Channel Mix):
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.06] mb-1.5">
                      {rec.channelMixAllocation.map((c, i) => (
                        <div
                          key={i}
                          title={`${c.channel}: ${c.percentage}%`}
                          style={{ width: `${c.percentage}%` }}
                          className={
                            i === 0
                              ? 'bg-indigo-500'
                              : i === 1
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                          }
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                      {rec.channelMixAllocation.map((c, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              i === 0 ? 'bg-indigo-400' : i === 1 ? 'bg-sky-400' : 'bg-emerald-400'
                            }`}
                          />
                          {c.channel} {c.percentage}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Optimization Tips */}
                  <div className="space-y-1 mb-4 pt-2 border-t border-white/[0.04]">
                    <div className="text-[11px] text-slate-500 font-medium">执行优化建议:</div>
                    {rec.optimizationTips.map((tip, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                        <span className="text-indigo-400">·</span>
                        <span className="leading-tight">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Launch Action */}
                <button
                  onClick={() => handleLaunchCampaign(rec)}
                  className="w-full py-1.5 px-3 text-xs font-medium text-white bg-white/[0.06] hover:bg-indigo-600 border border-white/[0.08] hover:border-indigo-500 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>一键采纳并创建该活动</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs">
          正在加载 AI 智能推荐模型...
        </div>
      )}
    </div>
  );
};
