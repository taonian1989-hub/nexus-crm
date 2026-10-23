# Nexus CRM — AI-Native Marketing & ABM Platform

An AI-native CRM and ABM execution platform designed for enterprise marketing teams and Forward Deployed Engineers (FDEs). Benchmarking top-tier products like Attio, HubSpot, and Linear, Nexus CRM brings autonomous lead intelligence, real-time Gemini-powered account audits, customer persona reports, and intelligent campaign simulation into a dark, high-density interface.

---

## 🌟 Key Features

### 1. 🎯 Autonomous Lead Scoring & Deep Account Audit (Agentic Lead Scoring)
- Multi-factor, transparent ICP scoring decomposed into 4 quantifiable dimensions:
  - **Firmographic Match** (0–100)
  - **Tech Stack Synergy** (0–100)
  - **Intent Velocity** (0–100)
  - **Budget & Buying Readiness** (0–100)
- Deep Strategic Dossier generation with competitor displacement battlecards, tailored discovery questions, and recommended next steps.

### 2. 👤 AI-Driven Customer Persona Module (客户画像报告)
- Unifies demographics, firmographics, tech stack maturity, buying committee roles, and web/hiring intent signals.
- Generates structured, visual persona reports:
  - **Demographics Topology & Organization Scale**
  - **Interests & Core Buying Motives**
  - **Latent Architectural Needs**
  - **Customer Lifecycle Stepper & Expansion Potential Index**
  - **Actionable GTM Insights & Tailored Pitch Hooks**

### 3. 🚀 Smart Campaign Recommender & Simulation Engine (智能活动推荐与推演)
- AI-driven recommendation of high-conversion campaign types (FDE Peer Briefings, LinkedIn ABM, Real-Time Signal Triggers).
- **Channel Mix Simulation**: Dynamic percentage allocation modeling (Email, Slack Connect, Interactive Sandboxes).
- Projected conversion lift and pipeline ARR impact calculation.
- 1-click adoption to launch active campaigns.

### 4. ⚡ Linear / Attio Minimalist High-Density UI/UX
- Obsidian dark canvas (`#090A0F`), hairline dividers (`white/[0.08]`), and tabular figures (`tabular-nums font-mono`).
- Dual views: **Data Ledger (Attio-style dense spreadsheet)** and **Pipeline Board (Linear-style dark Kanban)**.
- Real-time **Intent Velocity Radar** capturing web traffic, hiring surges, and tech stack telemetry.
- Global Command Palette & Copilot (`⌘K`) for natural language pipeline querying.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **AI Engine**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`)
- **Full-Stack Runtime**: Single Express process mounting Vite middleware in development

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd nexus-crm

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Provide your GEMINI_API_KEY in .env

# Run development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

---

## 📄 License
Apache-2.0
