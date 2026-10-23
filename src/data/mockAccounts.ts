import { Account, Campaign } from '../types/crm';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_snowflake',
    name: 'Snowflake',
    domain: 'snowflake.com',
    industry: 'Data Cloud & Infrastructure',
    employeeCount: '7,000+',
    headquarters: 'Bozeman, MT',
    arrPotential: 280000,
    stage: 'opportunity',
    tier: 'tier1',
    icpScore: 94,
    intentVelocity: 'surge',
    techStack: ['AWS', 'Kubernetes', 'Go', 'React', 'Kafka', 'Terraform'],
    lastActivity: '12m ago',
    summary: 'Global data warehouse titan modernizing enterprise analytics pipelines with hybrid LLM inference.',
    contacts: [
      {
        id: 'c_snow_1',
        name: 'Elena Rostova',
        title: 'VP of Platform Engineering',
        email: 'elena.rostova@snowflake.com',
        linkedin: 'linkedin.com/in/elena-rostova-platform',
        role: 'Economic Buyer',
        engagementScore: 88,
        lastContacted: '2 days ago'
      },
      {
        id: 'c_snow_2',
        name: 'Marcus Vance',
        title: 'Director of Growth Marketing Infrastructure',
        email: 'm.vance@snowflake.com',
        role: 'Champion',
        engagementScore: 92,
        lastContacted: 'Yesterday'
      }
    ],
    intentSignals: [
      {
        id: 'sig_1',
        type: 'pricing_view',
        title: '3 team members visited Enterprise Custom Tier pricing',
        source: 'Clearbit Reveal',
        timestamp: '15m ago',
        intensity: 'high'
      },
      {
        id: 'sig_2',
        type: 'hiring_surge',
        title: 'Opened 14 new Senior AI / FDE roles in US/EMEA',
        source: 'LinkedIn Talent Insights',
        timestamp: '2d ago',
        intensity: 'high'
      },
      {
        id: 'sig_3',
        type: 'tech_install',
        title: 'Detected trial deployment of internal API gateway',
        source: 'Datadog Network Telemetry',
        timestamp: '4d ago',
        intensity: 'medium'
      }
    ],
    aiAnalysis: {
      overallScore: 94,
      firmographicScore: 96,
      techStackScore: 92,
      intentScore: 98,
      readinessScore: 90,
      rationale: 'Top-tier enterprise match. Strong synergy with our distributed runtime architecture and massive quarterly growth budget.',
      strategicAngle: 'Position as zero-latency forward-deployed integration layer for enterprise client telemetry without vendor lock-in.',
      recommendedNextAction: 'Dispatch Executive Briefing deck directly to VP Elena Rostova referencing their multi-region latency benchmark initiative.',
      estimatedARR: '$280,000 / yr',
      keyRisks: ['Complex infosec audit with 60-day SOC2 compliance validation cycle'],
      buyingTriggers: ['Recent earnings call highlighted 40% YoY expansion in client AI workloads', 'Q4 infrastructure budget unlock']
    },
    persona: {
      demographics: {
        companyType: 'Public Global Enterprise (Cloud Infrastructure)',
        geography: 'North America / EMEA (HQ Bozeman, MT)',
        scale: '7,000+ FTEs · $2.8B+ ARR',
        techMaturity: 'Cutting-Edge Tier 1 Distributed Systems',
        decisionMakerPersona: 'VP of Platform Engineering (Elena Rostova) & Dir. Growth Infra'
      },
      interestsAndPreferences: [
        'Sub-millisecond query latency',
        'Multi-cloud Kubernetes portability',
        'Zero vendor lock-in & sovereign telemetry',
        'Developer-first SDK ergonomics'
      ],
      buyingMotives: [
        'Eliminating internal data pipeline maintenance overhead',
        'Consolidating high-cost fragmented telemetry microservices',
        'Accelerating AI workload monetization for enterprise tier accounts'
      ],
      latentNeeds: [
        'Seamless bidirectional sync with hybrid Apache Iceberg catalogs',
        'High-compliance enterprise enclave for client privacy controls'
      ],
      lifecycleStage: 'Active POC',
      expansionPotential: 96,
      churnRisk: 'Low',
      behavioralTraits: {
        priceSensitivity: 'Low',
        decisionVelocity: 'Deliberate',
        channelPreference: 'Direct FDE Technical Walkthrough & Private Slack Connect'
      },
      actionableMarketingInsights: {
        strategy: 'Executive Account-Based Marketing (ABM) with Engineering-Led Proof',
        recommendedChannel: 'Executive Briefing & FDE Architecture Review',
        proposedCampaignAngle: 'Modernizing Client Telemetry Without Infrastructure Bloat',
        tailoredPitchKicker: 'Help your platform engineering team eliminate 400+ hours of pipeline glue code while cutting telemetry latency by 68%.'
      },
      generatedAt: 'Today, 05:42'
    }
  },
  {
    id: 'acc_stripe',
    name: 'Stripe',
    domain: 'stripe.com',
    industry: 'Financial Infrastructure',
    employeeCount: '8,000+',
    headquarters: 'San Francisco, CA',
    arrPotential: 340000,
    stage: 'qualified',
    tier: 'tier1',
    icpScore: 96,
    intentVelocity: 'surge',
    techStack: ['Ruby', 'Sorbet', 'TypeScript', 'AWS', 'Envoy', 'React'],
    lastActivity: '45m ago',
    summary: 'Global financial infrastructure provider scaling autonomous revenue operations and merchant risk models.',
    contacts: [
      {
        id: 'c_str_1',
        name: 'Julian Chen',
        title: 'Head of Merchant Growth Architecture',
        email: 'jchen@stripe.com',
        role: 'Economic Buyer',
        engagementScore: 79,
        lastContacted: '3 days ago'
      },
      {
        id: 'c_str_2',
        name: 'Sophia Patel',
        title: 'Staff Forward Deployed Architect',
        email: 'spatel@stripe.com',
        role: 'Champion',
        engagementScore: 85,
        lastContacted: '4 hours ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_4',
        type: 'web_visit',
        title: '18 pageviews across API Docs & High-Availability SLA spec',
        source: 'Reverse DNS',
        timestamp: '45m ago',
        intensity: 'high'
      },
      {
        id: 'sig_5',
        type: 'competitor_search',
        title: 'Evaluated alternative middleware providers on G2',
        source: 'Bombora Intent Data',
        timestamp: '1d ago',
        intensity: 'medium'
      }
    ],
    aiAnalysis: {
      overallScore: 96,
      firmographicScore: 98,
      techStackScore: 95,
      intentScore: 96,
      readinessScore: 95,
      rationale: 'Exceptional strategic alignment. Stripe engineering values API elegance, type safety, and sub-10ms operational reliability.',
      strategicAngle: 'Highlight developer-first DX, automated TypeScript contract generation, and self-hosted high-compliance enclave options.',
      recommendedNextAction: 'Share interactive code playground benchmark with Sophia Patel ahead of next committee sync.',
      estimatedARR: '$340,000 / yr',
      keyRisks: ['Internal "Build vs Buy" bias common in Tier 1 developer infrastructure teams'],
      buyingTriggers: ['New merchant onboarding friction report published internally', 'Global expansion push into APAC']
    }
  },
  {
    id: 'acc_vercel',
    name: 'Vercel',
    domain: 'vercel.com',
    industry: 'Cloud Platform & DX',
    employeeCount: '900+',
    headquarters: 'San Francisco, CA',
    arrPotential: 160000,
    stage: 'opportunity',
    tier: 'tier1',
    icpScore: 91,
    intentVelocity: 'high',
    techStack: ['Next.js', 'Rust', 'TypeScript', 'AWS Edge', 'Tailwind CSS'],
    lastActivity: '2h ago',
    summary: 'The frontend cloud for enterprise modern web applications and AI SDK distribution.',
    contacts: [
      {
        id: 'c_ver_1',
        name: 'Arjun Nambiar',
        title: 'VP of Product Marketing & Enterprise',
        email: 'arjun@vercel.com',
        role: 'Economic Buyer',
        engagementScore: 91,
        lastContacted: '1 day ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_6',
        type: 'pricing_view',
        title: 'Product Marketing team visited Custom Integration Calculator',
        source: 'Segment CDP',
        timestamp: '2h ago',
        intensity: 'high'
      }
    ],
    aiAnalysis: {
      overallScore: 91,
      firmographicScore: 92,
      techStackScore: 96,
      intentScore: 89,
      readinessScore: 88,
      rationale: 'High brand prestige and fast deal cycles. High propensity for co-marketing and viral developer amplification.',
      strategicAngle: 'Offer deep Next.js and Edge runtime native connectors with turnkey marketing analytics dashboard.',
      recommendedNextAction: 'Propose co-designed technical case study and pilot program for enterprise account pipeline.',
      estimatedARR: '$160,000 / yr',
      keyRisks: ['Demands polished bleeding-edge UI/DX with zero tolerance for visual defects'],
      buyingTriggers: ['Enterprise customer demand for multi-region CRM signal ingestion']
    }
  },
  {
    id: 'acc_datadog',
    name: 'Datadog',
    domain: 'datadoghq.com',
    industry: 'Cloud Monitoring & Observability',
    employeeCount: '5,500+',
    headquarters: 'New York, NY',
    arrPotential: 220000,
    stage: 'engaged',
    tier: 'tier1',
    icpScore: 89,
    intentVelocity: 'high',
    techStack: ['Go', 'Python', 'Kafka', 'React', 'PostgreSQL', 'Kubernetes'],
    lastActivity: '5h ago',
    summary: 'Unified observability and telemetry platform for cloud-scale applications.',
    contacts: [
      {
        id: 'c_dd_1',
        name: 'Rachel Sterling',
        title: 'Director of Demand Generation & ABM',
        email: 'rsterling@datadoghq.com',
        role: 'Champion',
        engagementScore: 74,
        lastContacted: '4 days ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_7',
        type: 'hiring_surge',
        title: 'Expanding enterprise field sales and solutions engineering in EMEA',
        source: 'LinkedIn',
        timestamp: '3d ago',
        intensity: 'high'
      }
    ],
    aiAnalysis: {
      overallScore: 89,
      firmographicScore: 94,
      techStackScore: 88,
      intentScore: 86,
      readinessScore: 87,
      rationale: 'Established enterprise buyer with budget. Observability integration potential is exceptionally high.',
      strategicAngle: 'Focus on bidirectional telemetry sync and automated pipeline anomaly alerts.',
      recommendedNextAction: 'Schedule technical discovery call with Rachel Sterling and solutions architect team.',
      estimatedARR: '$220,000 / yr',
      keyRisks: ['Complex cross-departmental approval between Marketing Ops and Security'],
      buyingTriggers: ['Annual tool stack consolidation initiative underway']
    }
  },
  {
    id: 'acc_supabase',
    name: 'Supabase',
    domain: 'supabase.com',
    industry: 'Open Source Cloud DB',
    employeeCount: '150+',
    headquarters: 'Singapore / Remote',
    arrPotential: 95000,
    stage: 'engaged',
    tier: 'tier2',
    icpScore: 85,
    intentVelocity: 'high',
    techStack: ['PostgreSQL', 'Elixir', 'Go', 'TypeScript', 'Next.js'],
    lastActivity: '1d ago',
    summary: 'The open-source Firebase alternative powering hundreds of thousands of developer projects.',
    contacts: [
      {
        id: 'c_sup_1',
        name: 'Paul Copplestone',
        title: 'Co-Founder & Executive Sponsor',
        email: 'paul@supabase.com',
        role: 'Economic Buyer',
        engagementScore: 68,
        lastContacted: '1 week ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_8',
        type: 'web_visit',
        title: 'Visited Security & Enterprise SLA whitepaper',
        source: 'Leadfeeder',
        timestamp: '1d ago',
        intensity: 'medium'
      }
    ]
  },
  {
    id: 'acc_cloudflare',
    name: 'Cloudflare',
    domain: 'cloudflare.com',
    industry: 'Security & Edge Computing',
    employeeCount: '4,000+',
    headquarters: 'San Francisco, CA',
    arrPotential: 250000,
    stage: 'target',
    tier: 'tier1',
    icpScore: 87,
    intentVelocity: 'normal',
    techStack: ['Rust', 'Go', 'Workers', 'V8', 'TypeScript'],
    lastActivity: '3d ago',
    summary: 'Leading global edge network and cybersecurity powerhouse safeguarding internet infrastructure.',
    contacts: [
      {
        id: 'c_cf_1',
        name: 'Devon Hughes',
        title: 'Senior Director of Strategic Accounts',
        email: 'dhughes@cloudflare.com',
        role: 'Influencer',
        engagementScore: 54,
        lastContacted: '2 weeks ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_9',
        type: 'funding',
        title: 'Announced $100M Worker AI expansion fund',
        source: 'Press Release',
        timestamp: '5d ago',
        intensity: 'medium'
      }
    ]
  },
  {
    id: 'acc_anthropic',
    name: 'Anthropic',
    domain: 'anthropic.com',
    industry: 'AI Safety & Frontier Models',
    employeeCount: '600+',
    headquarters: 'San Francisco, CA',
    arrPotential: 380000,
    stage: 'qualified',
    tier: 'tier1',
    icpScore: 98,
    intentVelocity: 'surge',
    techStack: ['Python', 'Kubernetes', 'PyTorch', 'AWS Trainium', 'GCP TPU'],
    lastActivity: '20m ago',
    summary: 'Frontier AI safety and research company behind Claude 3.5 & Sonnet enterprise intelligence.',
    contacts: [
      {
        id: 'c_ant_1',
        name: 'Claire Beauchamp',
        title: 'Head of Enterprise GTM Operations',
        email: 'c.beauchamp@anthropic.com',
        role: 'Economic Buyer',
        engagementScore: 94,
        lastContacted: 'Yesterday'
      }
    ],
    intentSignals: [
      {
        id: 'sig_10',
        type: 'web_visit',
        title: 'High-frequency visits to ABM attribution and Lead Routing docs',
        source: 'Visitor ID',
        timestamp: '20m ago',
        intensity: 'high'
      },
      {
        id: 'sig_11',
        type: 'hiring_surge',
        title: 'Recruiting 25 Enterprise Account Executives & SDR Directors',
        source: 'Greenhouse API',
        timestamp: '1d ago',
        intensity: 'high'
      }
    ],
    aiAnalysis: {
      overallScore: 98,
      firmographicScore: 99,
      techStackScore: 96,
      intentScore: 99,
      readinessScore: 98,
      rationale: 'Unprecedented growth phase. Enterprise marketing needs robust pipeline orchestration that respects strict security boundaries.',
      strategicAngle: 'Highlight sovereign data governance, zero retention telemetry, and automated multi-tier lead enrichment.',
      recommendedNextAction: 'Execute custom ABM InMail cadence targeting Claire Beauchamp with an interactive pipeline simulation.',
      estimatedARR: '$380,000 / yr',
      keyRisks: ['Extreme internal focus on safety protocol approvals'],
      buyingTriggers: ['Massive enterprise inbound volume surge requiring automated qualification']
    }
  },
  {
    id: 'acc_figma',
    name: 'Figma',
    domain: 'figma.com',
    industry: 'Collaborative Design Software',
    employeeCount: '1,500+',
    headquarters: 'San Francisco, CA',
    arrPotential: 210000,
    stage: 'opportunity',
    tier: 'tier1',
    icpScore: 92,
    intentVelocity: 'high',
    techStack: ['TypeScript', 'WebAssembly', 'C++', 'React', 'AWS'],
    lastActivity: '1h ago',
    summary: 'The industry-standard collaborative product design and interface creation environment.',
    contacts: [
      {
        id: 'c_fig_1',
        name: 'Liam Sterling',
        title: 'Director of Growth & Inbound Funnel',
        email: 'lsterling@figma.com',
        role: 'Champion',
        engagementScore: 86,
        lastContacted: '2 days ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_12',
        type: 'pricing_view',
        title: 'Multiple visits to Enterprise SLA & custom webhook pages',
        source: 'Clearbit',
        timestamp: '1h ago',
        intensity: 'high'
      }
    ],
    aiAnalysis: {
      overallScore: 92,
      firmographicScore: 95,
      techStackScore: 94,
      intentScore: 90,
      readinessScore: 89,
      rationale: 'Figma design system teams require pixel-perfect tool quality, real-time collaboration, and high-fidelity integrations.',
      strategicAngle: 'Demonstrate real-time lead routing and instant marketing-to-sales handoff efficiency.',
      recommendedNextAction: 'Share Figma-styled prototype review link with Liam Sterling.',
      estimatedARR: '$210,000 / yr',
      keyRisks: ['Lengthy legal and enterprise procurement review'],
      buyingTriggers: ['Recent expansion into enterprise developer handoff tools']
    }
  },
  {
    id: 'acc_retool',
    name: 'Retool',
    domain: 'retool.com',
    industry: 'Internal Tooling & Workflow Platform',
    employeeCount: '400+',
    headquarters: 'San Francisco, CA',
    arrPotential: 140000,
    stage: 'closed_won',
    tier: 'tier2',
    icpScore: 89,
    intentVelocity: 'normal',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    lastActivity: '6d ago',
    summary: 'Fastest way to build custom internal software and operational dashboards.',
    contacts: [
      {
        id: 'c_ret_1',
        name: 'Nora Hayes',
        title: 'Head of Solutions & FDEs',
        email: 'nhayes@retool.com',
        role: 'Economic Buyer',
        engagementScore: 98,
        lastContacted: '6 days ago'
      }
    ],
    intentSignals: [
      {
        id: 'sig_13',
        type: 'tech_install',
        title: 'Full production integration deployed across 4 business units',
        source: 'Telemetry Prober',
        timestamp: '6d ago',
        intensity: 'high'
      }
    ]
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Q4 Enterprise ABM - AI Infrastructure Tier 1',
    type: 'abm_executive',
    status: 'active',
    targetAccountCount: 8,
    touchpointCadence: [
      'Executive Briefing Email (VP/Head of Eng)',
      'LinkedIn InMail from Founding FDE',
      'Personalized Interactive Architecture Sandbox',
      'Priority Solutions Engineering Discovery'
    ],
    openRate: 74,
    replyRate: 38,
    createdDate: 'Oct 14, 2026',
    description: 'Hyper-personalized outbound campaign targeting technical decision makers at Fortune 500 & fast-growing AI pioneers.'
  },
  {
    id: 'camp_2',
    name: 'Snowflake & Datadog Expansion Playbook',
    type: 'technical_deep_dive',
    status: 'active',
    targetAccountCount: 4,
    touchpointCadence: [
      'Latency & Throughput Benchmark Whitepaper',
      'Custom Slack Connect Channel Invite',
      'Live Architecture Review with FDE'
    ],
    openRate: 82,
    replyRate: 46,
    createdDate: 'Oct 18, 2026',
    description: 'Tailored technical displacement campaign focused on overcoming latency bottlenecks in multi-cloud telemetry pipelines.'
  },
  {
    id: 'camp_3',
    name: 'PLG Inbound Surge Accelerator',
    type: 'product_launch',
    status: 'draft',
    targetAccountCount: 15,
    touchpointCadence: [
      'Instant AI Account Audit Delivery',
      'Self-Service Custom Connector Provisioning',
      'VIP Onboarding Concierge'
    ],
    openRate: 0,
    replyRate: 0,
    createdDate: 'Oct 21, 2026',
    description: 'Automated workflow that captures signups with >$50k ARR potential and fast-tracks them to enterprise demo meetings.'
  }
];
