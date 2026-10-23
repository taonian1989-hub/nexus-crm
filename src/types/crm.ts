export type AccountStage =
  | 'target'
  | 'engaged'
  | 'qualified'
  | 'opportunity'
  | 'closed_won'
  | 'closed_lost';

export type AccountTier = 'tier1' | 'tier2' | 'tier3';

export type IntentVelocity = 'surge' | 'high' | 'normal' | 'low';

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  phone?: string;
  role: 'Economic Buyer' | 'Champion' | 'Technical Evaluator' | 'Influencer';
  engagementScore: number;
  lastContacted: string;
}

export interface IntentSignal {
  id: string;
  type:
    | 'web_visit'
    | 'pricing_view'
    | 'hiring_surge'
    | 'funding'
    | 'competitor_search'
    | 'tech_install';
  title: string;
  source: string;
  timestamp: string;
  intensity: 'high' | 'medium' | 'low';
}

export interface AIScoreBreakdown {
  overallScore: number;
  firmographicScore: number;
  techStackScore: number;
  intentScore: number;
  readinessScore: number;
  rationale: string;
  strategicAngle: string;
  recommendedNextAction: string;
  estimatedARR: string;
  keyRisks: string[];
  buyingTriggers: string[];
}

export interface CustomerPersona {
  demographics: {
    companyType: string;
    geography: string;
    scale: string;
    techMaturity: string;
    decisionMakerPersona: string;
  };
  interestsAndPreferences: string[];
  buyingMotives: string[];
  latentNeeds: string[];
  lifecycleStage: 'Prospect' | 'High-Intent Evaluator' | 'Active POC' | 'Expansion Candidate' | 'Advocate';
  expansionPotential: number; // 0-100
  churnRisk: 'Low' | 'Moderate' | 'High';
  behavioralTraits: {
    priceSensitivity: 'Low' | 'Medium' | 'High';
    decisionVelocity: 'Fast' | 'Iterative' | 'Deliberate';
    channelPreference: string;
  };
  actionableMarketingInsights: {
    strategy: string;
    recommendedChannel: string;
    proposedCampaignAngle: string;
    tailoredPitchKicker: string;
  };
  generatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeCount: string;
  headquarters: string;
  arrPotential: number; // in USD
  stage: AccountStage;
  tier: AccountTier;
  icpScore: number; // 0-100
  intentVelocity: IntentVelocity;
  techStack: string[];
  lastActivity: string;
  contacts: Contact[];
  intentSignals: IntentSignal[];
  aiAnalysis?: AIScoreBreakdown;
  persona?: CustomerPersona;
  summary?: string;
}

export interface CampaignRecommendation {
  campaignType: string;
  bestChannel: string;
  confidenceScore: number;
  predictedImpact: {
    conversionLift: string;
    expectedReplyRate: number;
    estimatedPipelineUplift: string;
  };
  whyThisWorks: string;
  channelMixAllocation: { channel: string; percentage: number }[];
  optimizationTips: string[];
}

export interface CampaignSimulationResult {
  recommendedCampaigns: CampaignRecommendation[];
  overallProjectedConversion: number;
  bestTimeToDeliver: string;
  strategicSummary: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'abm_executive' | 'technical_deep_dive' | 'competitor_displace' | 'product_launch';
  status: 'active' | 'draft' | 'completed';
  targetAccountCount: number;
  touchpointCadence: string[];
  openRate: number; // percentage
  replyRate: number; // percentage
  createdDate: string;
  description: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionType?: 'filter_accounts' | 'inspect_account' | 'generate_outreach' | 'score_leads';
  actionData?: any;
}

export interface FilterState {
  searchQuery: string;
  stage: AccountStage | 'all';
  tier: AccountTier | 'all';
  intent: IntentVelocity | 'all';
  minScore: number;
}
