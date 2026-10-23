import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client with standard telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Autonomous Lead Scoring Endpoint
app.post('/api/crm/score-lead', async (req: Request, res: Response) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ error: 'Account data is required' });
    }

    if (ai) {
      const prompt = `You are a world-class Forward Deployed Engineer (FDE) and B2B SaaS Enterprise Marketing Strategist.
Perform an in-depth, rigorous ICP fit and lead score audit for this enterprise account:
Name: ${account.name}
Domain: ${account.domain}
Industry: ${account.industry}
Employees: ${account.employeeCount}
Estimated ARR: $${account.arrPotential?.toLocaleString() || '150,000'}
Tech Stack: ${account.techStack ? account.techStack.join(', ') : 'Cloud Infrastructure, TypeScript, Go'}
Recent Signals: ${JSON.stringify(account.intentSignals || [])}

Score each dimension from 0 to 100 based on realistic enterprise B2B dynamics.
Return a clean JSON object conforming to the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER, description: 'Composite ICP score 0-100' },
              firmographicScore: { type: Type.INTEGER, description: 'Company size & revenue match 0-100' },
              techStackScore: { type: Type.INTEGER, description: 'Tech stack synergy 0-100' },
              intentScore: { type: Type.INTEGER, description: 'Intent signal strength 0-100' },
              readinessScore: { type: Type.INTEGER, description: 'Budget and buying readiness 0-100' },
              rationale: { type: Type.STRING, description: '2 sentence executive scoring rationale' },
              strategicAngle: { type: Type.STRING, description: 'Concrete value wedge for this account' },
              recommendedNextAction: { type: Type.STRING, description: 'Immediate high-impact action step' },
              estimatedARR: { type: Type.STRING, description: 'Estimated annual contract value e.g. $250,000 / yr' },
              keyRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 1-2 procurement or technical risks' },
              buyingTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 2 market or organizational triggers' },
            },
            required: [
              'overallScore',
              'firmographicScore',
              'techStackScore',
              'intentScore',
              'readinessScore',
              'rationale',
              'strategicAngle',
              'recommendedNextAction',
              'estimatedARR',
              'keyRisks',
              'buyingTriggers',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Dynamic fallback based on account signals if no API key is available
      const overall = Math.min(99, Math.max(65, Math.floor(75 + (account.arrPotential || 100000) / 15000)));
      return res.json({
        overallScore: overall,
        firmographicScore: Math.min(98, overall + 2),
        techStackScore: Math.min(96, overall - 1),
        intentScore: account.intentVelocity === 'surge' ? 97 : 86,
        readinessScore: Math.min(94, overall - 3),
        rationale: `Strong B2B ICP match for ${account.name}. High engagement velocity observed across platform telemetry and team expansion.`,
        strategicAngle: `Position zero-latency architectural integration with their core stack (${(account.techStack || ['Cloud']).slice(0, 3).join(', ')}).`,
        recommendedNextAction: `Coordinate technical sync with engineering leads; provide benchmark simulation results.`,
        estimatedARR: `$${account.arrPotential ? account.arrPotential.toLocaleString() : '180,000'} / yr`,
        keyRisks: ['Lengthy security questionnaire and procurement validation cycle'],
        buyingTriggers: ['Quarterly enterprise infrastructure modernization budget unlocked', 'High intent signal surge detected in past 7 days'],
      });
    }
  } catch (err: any) {
    console.error('Error in score-lead:', err);
    return res.status(500).json({
      error: 'Failed to score lead',
      message: err?.message || 'Unknown error',
    });
  }
});

// 2. Deep Account Audit & Battlecard Generator
app.post('/api/crm/account-audit', async (req: Request, res: Response) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ error: 'Account data is required' });
    }

    if (ai) {
      const prompt = `As a top-tier Forward Deployed Engineer (FDE), synthesize an executive intelligence dossier for:
Account: ${account.name} (${account.domain})
Industry: ${account.industry}
Key Contacts: ${JSON.stringify(account.contacts || [])}
Intent Signals: ${JSON.stringify(account.intentSignals || [])}

Provide:
1. Executive Summary & Market Position
2. Competitor Displacement Battlecard (Who they likely use & how we win)
3. 3 Custom Discovery Questions for the FDE meeting
4. Recommended 4-Touch ABM Outreach Sequence`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        auditText: response.text || 'Account analysis complete.',
      });
    } else {
      return res.json({
        auditText: `### Executive Intelligence Dossier: ${account.name}

**1. Market Position & Strategic Fit**
${account.name} operates at the forefront of ${account.industry}. With estimated ARR potential of $${(account.arrPotential || 150000).toLocaleString()}, they represent a Tier-1 high-leverage account. Recent telemetry signals suggest intense interest in developer velocity, distributed system reliability, and automated marketing pipeline integration.

**2. Competitor Displacement Battlecard**
- **Incumbent Landscape**: Likely running legacy heavyweight SaaS suites or disjointed custom internal glue code.
- **Winning Wedge**: Highlight zero-latency API-first agility, end-to-end data type safety, and direct forward-deployed engineer support.

**3. Strategic Discovery Questions**
1. How is your team currently handling the friction between marketing intent signals and technical lead routing?
2. What are the top 2 bottlenecks in your multi-region data pipeline SLA?
3. What does your evaluation criteria look like for Q4 infrastructure upgrades?

**4. Tailored Multi-Touch Cadence**
- *Touch 1*: Personalized FDE email outlining multi-region latency benchmarks.
- *Touch 2*: LinkedIn connection with tailored architectural diagram.
- *Touch 3*: Interactive sandbox invitation with pre-populated dummy dataset.
- *Touch 4*: Executive discovery call with lead solutions architect.`,
      });
    }
  } catch (err: any) {
    console.error('Error in account-audit:', err);
    return res.status(500).json({ error: err?.message || 'Audit failed' });
  }
});

// 3. Multi-Touch ABM Outreach Generator
app.post('/api/crm/generate-outreach', async (req: Request, res: Response) => {
  try {
    const { account, contact, channel, objective } = req.body;

    if (ai) {
      const prompt = `You are a high-performing Forward Deployed Engineer (FDE) and Technical ABM copywriter.
Generate a concise, compelling, hyper-personalized outreach draft:
Recipient: ${contact?.name || 'Technical Leader'} (${contact?.title || 'Engineering VP'})
Account: ${account.name} (${account.domain})
Industry: ${account.industry}
Tech Stack: ${(account.techStack || []).join(', ')}
Channel: ${channel || 'email'} (Email subject + body OR LinkedIn InMail)
Objective: ${objective || 'Schedule a 15-minute technical architecture walk-through'}

Tone: Direct, peer-to-peer technical executive tone (Linear/Stripe style). Zero fluff, no generic sales hype, maximum respect for their time.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        content: response.text || '',
      });
    } else {
      return res.json({
        content: `Subject: Architecture sync on ${account.name}'s platform telemetry & pipeline velocity

Hi ${contact?.name ? contact.name.split(' ')[0] : 'there'},

I lead our Forward Deployed Engineering team. We noticed ${account.name}'s recent initiatives around ${account.techStack ? account.techStack.slice(0, 2).join(' & ') : 'cloud infrastructure'} and wanted to reach out peer-to-peer.

Most teams at your scale face a common tradeoff: building custom internal data bridges or dealing with fragmented telemetry that delays high-intent lead execution by days. We solved this with an autonomous, zero-latency integration layer that plugs directly into existing data stacks in under an hour.

Would you be open to a quick 15-minute technical walk-through next Tuesday to review the architectural benchmarks?

Best regards,
Forward Deployed Engineering Team`,
      });
    }
  } catch (err: any) {
    console.error('Error in generate-outreach:', err);
    return res.status(500).json({ error: err?.message || 'Generation failed' });
  }
});

// 4. AI-Driven Customer Persona Generator
app.post('/api/crm/generate-persona', async (req: Request, res: Response) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ error: 'Account data is required' });
    }

    if (ai) {
      const prompt = `You are a Principal Forward Deployed Engineer (FDE) and Strategic B2B Marketing Scientist.
Synthesize a deep, actionable, AI-driven Customer Persona (客户画像报告) for this enterprise account:
Account: ${account.name} (${account.domain})
Industry: ${account.industry}
Employees: ${account.employeeCount}
Headquarters: ${account.headquarters}
Estimated ARR: $${account.arrPotential?.toLocaleString() || '150,000'}
Tech Stack: ${(account.techStack || []).join(', ')}
Buying Committee Contacts: ${JSON.stringify(account.contacts || [])}
Intent Signals: ${JSON.stringify(account.intentSignals || [])}
Summary: ${account.summary || ''}

Generate structured JSON conforming to the CustomerPersona schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              demographics: {
                type: Type.OBJECT,
                properties: {
                  companyType: { type: Type.STRING },
                  geography: { type: Type.STRING },
                  scale: { type: Type.STRING },
                  techMaturity: { type: Type.STRING },
                  decisionMakerPersona: { type: Type.STRING },
                },
                required: ['companyType', 'geography', 'scale', 'techMaturity', 'decisionMakerPersona'],
              },
              interestsAndPreferences: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key technical and operational focus areas (3-5 items)',
              },
              buyingMotives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Underlying commercial and engineering motives (3-4 items)',
              },
              latentNeeds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Unstated or prospective architectural requirements (2-3 items)',
              },
              lifecycleStage: {
                type: Type.STRING,
                description: 'Prospect | High-Intent Evaluator | Active POC | Expansion Candidate | Advocate',
              },
              expansionPotential: { type: Type.INTEGER, description: 'Score 0-100' },
              churnRisk: { type: Type.STRING, description: 'Low | Moderate | High' },
              behavioralTraits: {
                type: Type.OBJECT,
                properties: {
                  priceSensitivity: { type: Type.STRING, description: 'Low | Medium | High' },
                  decisionVelocity: { type: Type.STRING, description: 'Fast | Iterative | Deliberate' },
                  channelPreference: { type: Type.STRING },
                },
                required: ['priceSensitivity', 'decisionVelocity', 'channelPreference'],
              },
              actionableMarketingInsights: {
                type: Type.OBJECT,
                properties: {
                  strategy: { type: Type.STRING },
                  recommendedChannel: { type: Type.STRING },
                  proposedCampaignAngle: { type: Type.STRING },
                  tailoredPitchKicker: { type: Type.STRING },
                },
                required: ['strategy', 'recommendedChannel', 'proposedCampaignAngle', 'tailoredPitchKicker'],
              },
            },
            required: [
              'demographics',
              'interestsAndPreferences',
              'buyingMotives',
              'latentNeeds',
              'lifecycleStage',
              'expansionPotential',
              'churnRisk',
              'behavioralTraits',
              'actionableMarketingInsights',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      parsed.generatedAt = 'Just now (AI Generated)';
      return res.json(parsed);
    } else {
      // Dynamic fallback tailored to account profile
      const isLarge = (account.arrPotential || 100000) > 200000;
      return res.json({
        demographics: {
          companyType: isLarge ? 'Tier-1 Hyper-Growth Tech Enterprise' : 'High-Growth Modern Tech Scale-up',
          geography: account.headquarters || 'Global / Remote',
          scale: `${account.employeeCount || '1,000+'} FTEs · ARR potential $${(account.arrPotential || 150000).toLocaleString()}`,
          techMaturity: 'Advanced Modern Cloud Native Infrastructure',
          decisionMakerPersona: account.contacts?.[0]?.name ? `${account.contacts[0].name} (${account.contacts[0].title})` : 'VP of Engineering / GTM Architecture',
        },
        interestsAndPreferences: [
          'High throughput & low-latency execution',
          'API-first composable workflow orchestration',
          'Enterprise security & SOC2 compliance',
          'Developer-centric telemetry and transparent observability'
        ],
        buyingMotives: [
          'Eliminating fragile internal point-to-point integrations',
          'Consolidating high-maintenance third-party data middleware',
          'Accelerating marketing-to-sales conversion velocity'
        ],
        latentNeeds: [
          'Unified cross-region pipeline state synchronization',
          'Automated data lineage and audit logging for enterprise governance'
        ],
        lifecycleStage: account.stage === 'opportunity' ? 'Active POC' : account.stage === 'qualified' ? 'High-Intent Evaluator' : 'Prospect',
        expansionPotential: Math.min(98, Math.floor(78 + (account.icpScore || 80) * 0.2)),
        churnRisk: 'Low',
        behavioralTraits: {
          priceSensitivity: isLarge ? 'Low' : 'Medium',
          decisionVelocity: isLarge ? 'Deliberate' : 'Iterative',
          channelPreference: 'FDE Architecture Sync, Private Slack, & Peer-to-Peer Review'
        },
        actionableMarketingInsights: {
          strategy: 'Account-Based Marketing (ABM) with Engineering-Led Architecture Proof',
          recommendedChannel: 'Executive Peer Outreach via FDE & Dedicated Interactive Sandbox',
          proposedCampaignAngle: `Modernizing Telemetry & Pipeline Velocity for ${account.name}'s Stack`,
          tailoredPitchKicker: `Eliminate point-to-point integration fragility and accelerate pipeline conversion by giving ${account.name}'s engineering and revenue teams unified, zero-latency account telemetry.`
        },
        generatedAt: 'Just now'
      });
    }
  } catch (err: any) {
    console.error('Error in generate-persona:', err);
    return res.status(500).json({ error: err?.message || 'Persona generation failed' });
  }
});

// 5. Intelligent Campaign & Channel Mix Recommendation Engine
app.post('/api/crm/recommend-campaigns', async (req: Request, res: Response) => {
  try {
    const { targetSegment, accounts, pastCampaigns } = req.body;

    if (ai) {
      const prompt = `You are a Chief Marketing Scientist and Growth Engineering Leader for Enterprise B2B SaaS.
Based on the following target customer personas and historical marketing campaign results, use AI algorithms to recommend the most optimal marketing campaign types (e.g., 1-on-1 executive email, interactive sandbox, LinkedIn ABM, Slack Connect), the best delivery channels, and predict conversion impacts for different channel combinations.

Target Segment: ${targetSegment || 'Tier 1 Enterprise Tech & Infrastructure'}
Target Accounts Sample: ${JSON.stringify((accounts || []).slice(0, 4).map((a: any) => ({ name: a.name, icpScore: a.icpScore, stage: a.stage, tech: a.techStack, persona: a.persona })))}
Past Campaign Performance: ${JSON.stringify(pastCampaigns || [])}

Provide:
1. Top 3 prioritized campaign type recommendations with best channels, confidence score, and predicted conversion lift/pipeline uplift.
2. Channel mix percentage allocation simulation.
3. Prescriptive optimization tips.
4. Optimal time to deliver and executive strategic summary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedCampaigns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    campaignType: { type: Type.STRING },
                    bestChannel: { type: Type.STRING },
                    confidenceScore: { type: Type.INTEGER },
                    predictedImpact: {
                      type: Type.OBJECT,
                      properties: {
                        conversionLift: { type: Type.STRING },
                        expectedReplyRate: { type: Type.INTEGER },
                        estimatedPipelineUplift: { type: Type.STRING },
                      },
                      required: ['conversionLift', 'expectedReplyRate', 'estimatedPipelineUplift'],
                    },
                    whyThisWorks: { type: Type.STRING },
                    channelMixAllocation: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          channel: { type: Type.STRING },
                          percentage: { type: Type.INTEGER },
                        },
                        required: ['channel', 'percentage'],
                      },
                    },
                    optimizationTips: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    'campaignType',
                    'bestChannel',
                    'confidenceScore',
                    'predictedImpact',
                    'whyThisWorks',
                    'channelMixAllocation',
                    'optimizationTips',
                  ],
                },
              },
              overallProjectedConversion: { type: Type.INTEGER },
              bestTimeToDeliver: { type: Type.STRING },
              strategicSummary: { type: Type.STRING },
            },
            required: ['recommendedCampaigns', 'overallProjectedConversion', 'bestTimeToDeliver', 'strategicSummary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Dynamic fallback based on enterprise benchmarks
      return res.json({
        recommendedCampaigns: [
          {
            campaignType: 'FDE 架构对齐与性能基准评测 (Technical Peer Briefing)',
            bestChannel: '1对1 高管直接邮件 + 私有 Slack Connect 协作信道',
            confidenceScore: 94,
            predictedImpact: {
              conversionLift: '+42% POC 转化率提升',
              expectedReplyRate: 46,
              estimatedPipelineUplift: '+$620,000 ARR',
            },
            whyThisWorks: '针对 Tier-1 技术决策人（如 VP of Platform / Head of GTM），硬核技术基准与免搭建沙盒比通用营销白皮书回复率高 3.8 倍。',
            channelMixAllocation: [
              { channel: 'FDE 点对点邮件', percentage: 45 },
              { channel: '专属 Slack Connect', percentage: 30 },
              { channel: '交互式架构沙盒', percentage: 25 },
            ],
            optimizationTips: [
              '在邮件开头 30 字内直接提及该客户最近的公网技术演进（如 Kubernetes 或多区域部署）',
              '随信附带免登录的 60 秒交互式延迟仿真体验链接',
              '避免任何销售套话，保持同行工程师交流口吻',
            ],
          },
          {
            campaignType: '大客户定向数字 ABM 触达 (Account-Based Social & InMail)',
            bestChannel: 'LinkedIn InMail 定向推送 + 行业头部高管私享会',
            confidenceScore: 88,
            predictedImpact: {
              conversionLift: '+28% 品牌认知与主动搜索增量',
              expectedReplyRate: 32,
              estimatedPipelineUplift: '+$380,000 ARR',
            },
            whyThisWorks: '围绕目标客户购买委员会中的 Champion 角色展开高频次专业价值渗透，有效降低采购法务评审阻力。',
            channelMixAllocation: [
              { channel: 'LinkedIn 赞助内容与 InMail', percentage: 50 },
              { channel: '高管闭门圆桌会邀约', percentage: 35 },
              { channel: '技术播客与深度访谈', percentage: 15 },
            ],
            optimizationTips: [
              '将内容重点聚焦于“如何消灭数据孤岛与降低数据管道维护人力成本”',
              '搭配同行业领军企业（如 Snowflake）的真实效能收益数据',
            ],
          },
          {
            campaignType: '关键意向信号即时激活 (Signal-Triggered Real-Time Outreach)',
            bestChannel: '自动化营销短信/Webhook 触发 + 专属解决方案架构师跟进',
            confidenceScore: 85,
            predictedImpact: {
              conversionLift: '+35% 意向线索即时留存',
              expectedReplyRate: 29,
              estimatedPipelineUplift: '+$290,000 ARR',
            },
            whyThisWorks: '当客户团队在定价页停留或查阅 SLA 规范超过 3 分钟时，在 15 分钟内发起触达的赢单率是 24 小时后联系的 7 倍。',
            channelMixAllocation: [
              { channel: '实时意向自动化邮件', percentage: 60 },
              { channel: '即时 Webhook / SMS 提醒', percentage: 25 },
              { channel: '在线技术答疑弹窗', percentage: 15 },
            ],
            optimizationTips: [
              '严格设定触发频次阈值，避免在客户初次浏览时打扰',
              '直接提供定制化报价评估器与 SLA 自动测算工具',
            ],
          },
        ],
        overallProjectedConversion: 38,
        bestTimeToDeliver: '周二至周四 上午 09:30 - 11:00 (根据决策人时区动态匹配)',
        strategicSummary: '根据目标客户群体的 Demographics（大型云计算与开发者基础设施）以及低价格敏感度、深思熟虑型决策特征，推荐以“FDE 架构对齐”为主力攻坚策略，辅以“即时意向信号捕捉”，预计可带动整体转化率提升 38%，新增管线价值超 $1.2M。',
      });
    }
  } catch (err: any) {
    console.error('Error in recommend-campaigns:', err);
    return res.status(500).json({ error: err?.message || 'Recommendation failed' });
  }
});

// 6. Marketing Copilot Chat Endpoint
app.post('/api/crm/copilot', async (req: Request, res: Response) => {
  try {
    const { message, accounts } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      const summary = (accounts || [])
        .map((a: any) => `- ${a.name} (${a.industry}, ICP Score: ${a.icpScore}, Stage: ${a.stage}, ARR: $${a.arrPotential})`)
        .slice(0, 10)
        .join('\n');

      const prompt = `You are Nexus Copilot, an AI partner for an enterprise Forward Deployed Engineer (FDE) and marketing department.
Current high-priority target accounts in pipeline:
${summary}

User query: "${message}"

Answer concisely and authoritatively. If relevant, suggest specific accounts, high-yield actions, or pipeline optimization strategies. Keep the tone professional, engineering-grounded, and direct.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        reply: response.text || 'I have analyzed your pipeline data.',
      });
    } else {
      // Intelligent rule-based contextual reply
      let reply = `Here is my assessment based on your current pipeline:\n\n`;
      const queryLower = message.toLowerCase();

      if (queryLower.includes('tier 1') || queryLower.includes('high') || queryLower.includes('priority')) {
        reply += `• **Priority Focus**: Accounts with ICP scores above 90 (Anthropic, Stripe, Snowflake, Figma) have active intent surges. Recommend executing dedicated FDE multi-touch playbooks immediately.\n`;
        reply += `• **Pipeline Velocity**: Total pipeline value for top tier targets exceeds $1.4M ARR. Prioritizing Claire Beauchamp at Anthropic and Elena Rostova at Snowflake yields the shortest path to POC conversion.`;
      } else if (queryLower.includes('email') || queryLower.includes('outreach') || queryLower.includes('touch')) {
        reply += `• **Outreach Strategy**: Technical buyers respond 3.4x better to architecture benchmarks and code sandboxes than standard marketing one-pagers.\n`;
        reply += `• **Recommended Action**: Open the account drawer and click 'Generate ABM Touchpoint' to draft a tailored peer-to-peer outreach draft for your target champion.`;
      } else {
        reply += `• **Pipeline Health**: You have 8 active accounts with an average ICP score of 91.2.\n`;
        reply += `• **Immediate Next Step**: Focus on the 'Qualified' stage—Stripe and Anthropic are currently evaluating enterprise SLA specs. Scheduling technical discovery will accelerate deal closure.`;
      }

      return res.json({ reply });
    }
  } catch (err: any) {
    console.error('Error in copilot:', err);
    return res.status(500).json({ error: err?.message || 'Copilot failed' });
  }
});

// Start Express server and mount Vite in development
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus CRM running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
