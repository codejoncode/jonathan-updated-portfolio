import React, { useState } from "react";
import "./AgilePortfolio.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SCRUM_PHASES = [
  {
    num: "PHASE_01",
    color: "cyan",
    title: "Discovery & Team Formation",
    duration: "Week 1–2",
    desc: "Before a single story is written, I align stakeholders on the 'why' behind the product. This phase is about reducing ambiguity and ensuring the team has a shared mental model of what success looks like.",
    deliverables: [
      "Vision Statement", "Team Charter", "Definition of Done (DoD)",
      "Working Agreements", "Stakeholder Map", "Tooling Setup (Jira/Linear/GitHub)",
    ],
  },
  {
    num: "PHASE_02",
    color: "purple",
    title: "Backlog Construction & Refinement",
    duration: "Week 2–3",
    desc: "I facilitate epic decomposition and user story mapping sessions. Stories are written in proper format with acceptance criteria, sized using planning poker, and prioritized by business value vs. effort.",
    deliverables: [
      "Epics & User Stories", "Story Map", "Acceptance Criteria",
      "Initial Velocity Estimate", "MVP Scope Definition", "Risk Register Seed",
    ],
  },
  {
    num: "PHASE_03",
    color: "green",
    title: "Sprint Zero — Foundation",
    duration: "Week 3–4",
    desc: "Sprint Zero is not a freebie — it's infrastructure. The team scaffolds the codebase, CI/CD pipeline, environments, and establishes branching strategy. This investment pays off every sprint after.",
    deliverables: [
      "Repo & Branching Strategy", "CI/CD Pipeline", "Dev/Staging Environments",
      "Architecture Decision Records", "Sprint Cadence Calendar", "Burndown Template",
    ],
  },
  {
    num: "PHASE_04",
    color: "orange",
    title: "Sprint Execution Loop",
    duration: "Ongoing (2-week sprints)",
    desc: "Each sprint follows a tight, repeatable rhythm. I remove impediments daily, track velocity trends, coach the team on self-organization, and ensure ceremonies deliver value — not ceremony theater.",
    deliverables: [
      "Sprint Goal", "Daily Standups (15 min)", "Sprint Review Demo",
      "Retrospective Action Items", "Updated Burndown", "Velocity Tracking",
    ],
  },
];

const CEREMONIES = [
  { icon: "📋", name: "Sprint Planning", cadence: "Bi-weekly · 2–4 hrs", desc: "Team selects backlog items aligned to the sprint goal. I facilitate capacity planning and ensure acceptance criteria are understood before commitment." },
  { icon: "☀️", name: "Daily Standup",   cadence: "Daily · 15 min max",  desc: "Three questions: done, doing, blocked. I timebox ruthlessly and take impediments offline. No status reports — just synchronization." },
  { icon: "🔬", name: "Backlog Refinement", cadence: "Weekly · 1 hr",    desc: "Grooming upcoming stories to ensure the next 2 sprints are always ready. I focus on clarity of acceptance criteria and right-sizing." },
  { icon: "🚀", name: "Sprint Review",   cadence: "Bi-weekly · 1 hr",    desc: "Working software demoed to stakeholders. I facilitate feedback loops and ensure the demo is user-centric, not code-centric." },
  { icon: "🔄", name: "Retrospective",   cadence: "Bi-weekly · 1 hr",    desc: "Structured format: Start/Stop/Continue or 4Ls. Every retro ends with 1–2 committed action items — not a wishlist." },
];

const PM_PHASES = [
  {
    num: "INITIATE", color: "cyan",   title: "Project Initiation",     duration: "Week 1",
    desc: "Define the project charter, identify key stakeholders, and establish governance structure. Nothing moves without a clear problem statement and measurable success criteria.",
    deliverables: ["Project Charter", "RACI Matrix", "Stakeholder Register", "Success Metrics", "Budget Baseline", "Communication Plan"],
  },
  {
    num: "PLAN",    color: "purple", title: "Planning & Scope Definition", duration: "Week 2–4",
    desc: "Build the WBS, create the project schedule with critical path analysis, establish the risk register, and define the change control process. Planning is the highest-ROI phase.",
    deliverables: ["Work Breakdown Structure", "Gantt / Roadmap", "Risk Register", "Change Control Process", "Resource Plan", "Quality Plan"],
  },
  {
    num: "EXECUTE", color: "green",  title: "Execution & Monitoring",  duration: "Ongoing",
    desc: "Track actuals vs. baseline. I manage scope creep via formal change requests, run weekly status reports, and escalate risks before they become issues.",
    deliverables: ["Status Reports (weekly)", "Issue Log", "Change Request Log", "Budget Burn Report", "Milestone Tracking", "Stakeholder Updates"],
  },
  {
    num: "CLOSE",   color: "orange", title: "Project Closure",         duration: "Final week",
    desc: "Formal sign-off, lessons learned documentation, team retrospective, and handoff to operations. A project isn't done until knowledge is transferred.",
    deliverables: ["Lessons Learned", "Final Budget Report", "Closure Report", "Handoff Documentation", "Team Retrospective", "Stakeholder Sign-off"],
  },
];

const RISKS = [
  { risk: "Scope creep without change control", impact: "High", probability: "High", mitigation: "Formal CCB; all changes require approved CR" },
  { risk: "Key person dependency",              impact: "High", probability: "Med",  mitigation: "Cross-training plan; pair programming rotations" },
  { risk: "Unclear acceptance criteria",        impact: "Med",  probability: "High", mitigation: "DoD checklist; BA review before sprint commitment" },
  { risk: "Stakeholder misalignment",           impact: "High", probability: "Med",  mitigation: "Sprint reviews; shared roadmap with OKR mapping" },
  { risk: "Technical debt accumulation",        impact: "Med",  probability: "Med",  mitigation: "10% capacity reserved each sprint for debt work" },
];

const PHILOSOPHIES = [
  { color: "",       title: "Servant Leader First", num: "01", text: "The SM's job is to make the team's job easier. I remove friction, shield from outside noise, and invest in the team's growth over my own visibility." },
  { color: "purple", title: "Data Over Opinions",   num: "02", text: "Velocity, cycle time, defect density — metrics tell stories people won't. I build dashboards that surface the truth before it becomes a crisis." },
  { color: "green",  title: "Ceremonies Create Value", num: "03", text: "Meetings should end with decisions or action items. If a ceremony doesn't deliver value, I restructure it — or kill it." },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

interface Phase {
  num: string;
  color: string;
  title: string;
  duration: string;
  desc: string;
  deliverables: string[];
}

function PhaseCard({ phase }: { phase: Phase }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ap-phase">
      <div className={`ap-phase-dot ${phase.color}`}>
        <div className="ap-phase-dot-inner" />
      </div>
      <div className="ap-phase-connector" />
      <div
        className={`ap-phase-card ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="ap-phase-header">
          <div className="ap-phase-meta">
            <span className={`ap-phase-num ${phase.color}`}>{phase.num}</span>
            <span className="ap-phase-title">{phase.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="ap-phase-duration">{phase.duration}</span>
            <span className="ap-phase-chevron">▶</span>
          </div>
        </div>
        <div className="ap-phase-body">
          <p className="ap-phase-desc">{phase.desc}</p>
          <div className="ap-deliverables">
            {phase.deliverables.map((d) => (
              <div key={d} className="ap-deliverable">{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCRUM TAB ───────────────────────────────────────────────────────────────

function ScrumTab() {
  return (
    <div>
      <div className="ap-section-label">{`// scrum_master.approach`}</div>
      <div className="ap-section-title">How I Start a Project</div>
      <p className="ap-section-desc">
        A disciplined, phased approach to launching Agile teams. Click each phase to expand the details and deliverables.{" "}
        <span style={{ color: "var(--ap-accent3)" }}>Every phase is intentional.</span>
      </p>

      <div className="ap-timeline">
        {SCRUM_PHASES.map((p) => <PhaseCard key={p.num} phase={p} />)}
      </div>

      <div className="ap-section-label">{`// scrum_ceremonies.schedule`}</div>
      <div className="ap-section-title">Ceremony Cadence</div>
      <p className="ap-section-desc">
        Ceremonies are investments, not overhead. Here's how I structure each one for maximum signal-to-noise.
      </p>
      <div className="ap-ceremonies-grid">
        {CEREMONIES.map((c) => (
          <div key={c.name} className="ap-ceremony-card">
            <span className="ap-ceremony-icon">{c.icon}</span>
            <div className="ap-ceremony-name">{c.name}</div>
            <div className="ap-ceremony-cadence">{c.cadence}</div>
            <p className="ap-ceremony-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="ap-section-label">{`// sprint.board_snapshot`}</div>
      <div className="ap-section-title">Sample Sprint Board</div>
      <p className="ap-section-desc">Illustrative sprint state showing story distribution across swim lanes.</p>
      <div className="ap-sprint-board">
        <div className="ap-board-header">
          <div className="ap-board-title">Sprint 4 — Authentication &amp; Onboarding Epic</div>
          <div className="ap-board-sprint">⚡ Sprint Active · Day 6 / 10</div>
        </div>
        <div className="ap-board-cols">
          {[
            { title: "Backlog",     cards: [{ t: "Password reset email flow", p: 5 }, { t: "OAuth Google integration", p: 8 }] },
            { title: "In Progress", cards: [{ t: "Login page UI", p: 3 }, { t: "JWT token refresh", p: 5 }] },
            { title: "In Review",   cards: [{ t: "Registration form validation", p: 3 }] },
            { title: "Done ✓",      cards: [{ t: "DB schema for users", p: 2 }, { t: "Env config & secrets", p: 1 }, { t: "Email service wrapper", p: 2 }] },
          ].map((col) => (
            <div key={col.title}>
              <div className="ap-board-col-title">{col.title}</div>
              {col.cards.map((card) => (
                <div key={card.t} className="ap-board-card">
                  <span className="ap-story-pts">{card.p}pt</span>
                  {card.t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ap-section-label">{`// tools.stack`}</div>
      <div className="ap-section-title">Tools &amp; Platforms</div>
      <p className="ap-section-desc">I meet teams where they are — these are the tools I work with fluently.</p>
      <div className="ap-tools-grid">
        {["Jira", "Linear", "Confluence", "GitHub Projects", "Notion", "Miro", "FigJam", "Slack", "Azure DevOps", "Monday.com", "Trello", "Retrium", "EasyRetro", "Figma", "Loom", "Zoom"].map((t) => (
          <div key={t} className="ap-tool-tag">{t}</div>
        ))}
      </div>

      <div className="ap-section-label">{`// scrum_master.philosophy`}</div>
      <div className="ap-section-title">Core Principles</div>
      <p className="ap-section-desc">The values that guide how I show up for every team.</p>
      <div className="ap-philosophy-grid">
        {PHILOSOPHIES.map((p) => (
          <div key={p.num} className="ap-philosophy-card" data-num={p.num}>
            <div className={`ap-philosophy-card-title ${p.color}`}>{p.title}</div>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PM TAB ──────────────────────────────────────────────────────────────────

function PMTab() {
  return (
    <div>
      <div className="ap-section-label">{`// project_manager.framework`}</div>
      <div className="ap-section-title">PM Project Launch Framework</div>
      <p className="ap-section-desc">
        A structured approach grounded in PMBoK principles, adapted for modern hybrid delivery.
        Predictability through process — not micromanagement.
      </p>

      <div className="ap-timeline">
        {PM_PHASES.map((p) => <PhaseCard key={p.num} phase={p} />)}
      </div>

      <div className="ap-section-label">{`// project.baseline_metrics`}</div>
      <div className="ap-section-title">Baseline KPIs I Track from Day One</div>
      <p className="ap-section-desc">
        You can't manage what you don't measure. These are the metrics I establish at project kickoff.
      </p>
      <div className="ap-metrics-row">
        {[
          { val: "SPI", label: "Schedule Performance Index", c: "" },
          { val: "CPI", label: "Cost Performance Index",     c: "purple" },
          { val: "EV%", label: "Earned Value %",             c: "green" },
          { val: "RAG", label: "Red/Amber/Green Status",     c: "orange" },
          { val: "CR#", label: "Change Requests Logged",     c: "" },
          { val: "BV%", label: "Budget Variance %",          c: "purple" },
        ].map((m) => (
          <div key={m.val} className="ap-metric-card">
            <span className={`ap-metric-value ${m.c}`}>{m.val}</span>
            <span className="ap-metric-label">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="ap-section-label">{`// project.governance_model`}</div>
      <div className="ap-section-title">Governance Structure</div>
      <p className="ap-section-desc">How I structure accountability across the project lifecycle.</p>
      <div className="ap-pm-matrix">
        {[
          {
            title: "Steering Committee", color: "",
            items: [["Frequency", "Monthly"], ["Audience", "C-Suite / Sponsors"], ["Agenda", "Budget, Risk, Milestone"], ["Format", "Executive deck + RAG"]],
          },
          {
            title: "Core Team Sync", color: "purple",
            items: [["Frequency", "Weekly"], ["Audience", "Workstream Leads"], ["Agenda", "Status, Blockers, Actions"], ["Format", "Status report + RAID log"]],
          },
          {
            title: "Stakeholder Updates", color: "green",
            items: [["Frequency", "Bi-weekly"], ["Audience", "Business Owners"], ["Agenda", "Progress vs. Plan"], ["Format", "Written summary email"]],
          },
          {
            title: "Change Control Board", color: "orange",
            items: [["Trigger", "Any scope change request"], ["Audience", "PM + Sponsor + Tech Lead"], ["Decision", "Approve / Reject / Defer"], ["SLA", "5 business days"]],
          },
        ].map((m) => (
          <div key={m.title} className="ap-matrix-card">
            <div className={`ap-matrix-card-title ${m.color}`}>▸ {m.title}</div>
            {m.items.map(([k, v]) => (
              <div key={k} className="ap-matrix-item">
                <span className="ap-matrix-item-label">{k}</span>
                <span className="ap-matrix-item-val">{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ap-section-label">{`// risk.register_preview`}</div>
      <div className="ap-section-title">Risk Register (Sample)</div>
      <p className="ap-section-desc">
        Risks I proactively identify and track from initiation. Every risk has an owner and a mitigation strategy.
      </p>
      <table className="ap-risk-table">
        <thead>
          <tr>
            <th>Risk Description</th>
            <th>Impact</th>
            <th>Probability</th>
            <th>Mitigation Strategy</th>
          </tr>
        </thead>
        <tbody>
          {RISKS.map((r) => (
            <tr key={r.risk}>
              <td>{r.risk}</td>
              <td><span className={`ap-risk-badge ap-risk-${r.impact.toLowerCase()}`}>{r.impact}</span></td>
              <td><span className={`ap-risk-badge ap-risk-${r.probability.toLowerCase()}`}>{r.probability}</span></td>
              <td style={{ color: "var(--ap-muted)", fontSize: 11 }}>{r.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ap-section-label">// pm.tools_stack</div>
      <div className="ap-section-title">PM Toolbox</div>
      <p className="ap-section-desc">Tools I use to plan, track, and communicate across the project lifecycle.</p>
      <div className="ap-tools-grid">
        {["MS Project", "Smartsheet", "Asana", "Monday.com", "Jira", "Confluence", "Excel / Google Sheets", "Power BI", "Miro", "Lucidchart", "SharePoint", "Teams", "Notion", "Risk Radar", "RAID Log", "Gantt Pro"].map((t) => (
          <div key={t} className="ap-tool-tag">{t}</div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function AgilePortfolio() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "Scrum Master",    num: "01" },
    { label: "Project Manager", num: "02" },
  ];

  return (
    <div className="agile-portfolio">
      {/* HERO */}
      <div className="ap-hero">
        <div className="ap-hero-grid" />
        <div className="ap-hero-badge">Available for engagement</div>
        <h1>
          <span className="ap-cyan">Agile</span> &amp; <span className="ap-purple">PM</span>
          <br />
          Portfolio
        </h1>
        <p className="ap-hero-sub">
          How I launch projects — from <span>kickoff to cadence</span>.<br />
          Frameworks, ceremonies, governance, and the discipline behind delivery.
        </p>
      </div>

      {/* TABS */}
      <div className="ap-tabs-bar">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            className={`ap-tab-btn ${tab === i ? "active" : ""}`}
            onClick={() => setTab(i)}
          >
            <span className="ap-tab-num">{t.num}.</span>{t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="ap-tab-content" key={tab}>
        {tab === 0 ? <ScrumTab /> : <PMTab />}
      </div>

      {/* FOOTER */}
      <div className="ap-footer-bar">
        <span className="ap-footer-copy">
          © {new Date().getFullYear()} · Agile Portfolio · Built for results.
        </span>
        <div className="ap-footer-stack">
          <span className="active">✓ CSM Certified</span>
          <span>·</span>
          <span className="active">✓ PMP Aligned</span>
          <span>·</span>
          <span>React + CSS</span>
        </div>
      </div>
    </div>
  );
}
