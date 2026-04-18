import React from "react";
import { darkBlack, lighterBlue, anotherBlue } from "../../Helpers/Colors/colors";

const CYAN = "#00D2FF";
const PURPLE = "#7b61ff";
const GREEN = "#39ff14";
const GOLD = "#ffc947";
const ORANGE = "#ff6b35";

const LayoffToLeverage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: darkBlack, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0,210,255,0.07), rgba(123,97,255,0.07))",
        borderBottom: `1px solid ${CYAN}22`,
        padding: "64px 24px 48px",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            <Tag color={ORANGE}>Career</Tag>
            <Tag color={CYAN}>AI Engineering</Tag>
            <Tag color={PURPLE}>Job Search</Tag>
          </div>
          <h1 style={{ color: "#ccd6f6", fontSize: "2.6rem", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>
            From Layoff to Leverage: Turning Job Loss into Career Acceleration
          </h1>
          <p style={{ color: "#8892b0", fontSize: "1.1rem", lineHeight: 1.7, margin: "0 0 32px" }}>
            Losing a job through no fault of your own is tough — but it's also a forced reset
            that can launch you into better opportunities. Here's a roadmap for engineers with
            technical skills navigating this transition right now.
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: darkBlack, fontWeight: 800, fontSize: "1rem",
              }}>JH</div>
              <div>
                <div style={{ color: "#ccd6f6", fontWeight: 600, fontSize: "0.9rem" }}>Jonathan J. Holloway</div>
                <div style={{ color: "#8892b0", fontSize: "0.8rem" }}>April 2026 · 8 min read</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <P>
          Perficient laid off 300+ engineers industry-wide. If you were one of them — or if you're
          reading this because you just got the call — here's the truth: this isn't a failure. It's
          a market correction. And your timing is better than you think.
        </P>
        <P>
          AI-augmented engineering is the #1 hiring trend of 2026. Five years of full-stack experience,
          consulting credentials, and Scrum certification puts you ahead of 90% of applicants — you just
          need to reframe the story and move fast.
        </P>

        {/* Week 1 */}
        <SectionHeader color={ORANGE}>Week 1: Stabilize &amp; Strategize</SectionHeader>

        <SubHeader color={ORANGE}>Immediate Actions (Day 1)</SubHeader>
        <CheckList items={[
          "File for unemployment today — takes 15 minutes online",
          "Apply for health insurance marketplace coverage (COBRA as bridge)",
          "Set up a $1K emergency buffer: DoorDash/Uber Eats (3–4 hrs/day = $200+/week)",
        ]} color={ORANGE} />

        <SubHeader color={ORANGE}>Career Audit — 2 Hours</SubHeader>
        <CodeBlock>
{`What you bring:
✅ 5+ years full-stack (React / Node / Python)
✅ Technical consulting (Perficient — enterprise clients)
✅ ScrumMaster certified
✅ Team leadership (Lambda School, 17 students)
✅ Testing frameworks (Jest automation)
✅ AI tools: Claude, GitHub Copilot, Cursor

Target roles ($120K+):
1. AI-Augmented Software Engineer
2. Full Stack Developer (enterprise)
3. Technical Consultant (AI workflow optimization)`}
        </CodeBlock>

        {/* Week 2-4 */}
        <SectionHeader color={CYAN}>Weeks 2–4: High-Impact Job Search</SectionHeader>

        <SubHeader color={CYAN}>Daily Schedule (4 Hours)</SubHeader>
        <CodeBlock>
{`8–9 AM:    Apply 5 targeted jobs (Crossover, FlexJobs AI roles)
9–10 AM:   Portfolio update (1 AI tool project)
10–11 AM:  LeetCode (2 Easy, 1 Medium DSA)
11–12 PM:  LinkedIn outreach (10 personalized messages)
2–4 PM:    Gig economy buffer (DoorDash = $200/week)`}
        </CodeBlock>

        <SubHeader color={CYAN}>Application Targets</SubHeader>
        <ul style={{ paddingLeft: "20px", margin: "0 0 24px" }}>
          {[
            { role: "Crossover AI Developer", note: "$200K potential — your exact fit", color: GOLD },
            { role: "FlexJobs AI consultant roles", note: "$140K+ — consulting background shines", color: CYAN },
            { role: "Remote full-stack (Upwork/LinkedIn)", note: "$80+/hour contracts", color: GREEN },
          ].map((item) => (
            <li key={item.role} style={{ color: "#ccd6f6", marginBottom: "10px", lineHeight: 1.6 }}>
              <span style={{ color: item.color, fontWeight: 600 }}>{item.role}</span>
              {" — "}{item.note}
            </li>
          ))}
        </ul>

        {/* Portfolio */}
        <SectionHeader color={GREEN}>Portfolio Quick Wins — 3 Days</SectionHeader>
        <P>Build these 3 projects using Copilot and Claude as your co-pilot:</P>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {[
            { num: "1", title: "AI Bug Triage Tool", desc: "Claude analyzes stack traces and surfaces root cause + fix recommendations. Proves AI integration in a dev workflow.", color: CYAN },
            { num: "2", title: "Copilot React Generator", desc: "Scaffolds typed React components from a plain-English description. Shows prompt engineering applied to real dev productivity.", color: PURPLE },
            { num: "3", title: "Perplexity Research Dashboard", desc: "Tech stack comparison tool — query Perplexity API for pros/cons of frameworks. Demonstrates AI-assisted decision making.", color: GREEN },
          ].map((p) => (
            <div key={p.num} style={{
              display: "flex", gap: "16px", backgroundColor: "rgba(26,26,46,0.8)",
              border: `1px solid ${p.color}33`, borderRadius: "10px", padding: "16px",
            }}>
              <div style={{ color: p.color, fontWeight: 800, fontSize: "1.3rem", minWidth: "28px" }}>{p.num}</div>
              <div>
                <div style={{ color: p.color, fontWeight: 700, marginBottom: "4px" }}>{p.title}</div>
                <div style={{ color: "#8892b0", fontSize: "0.9rem", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* LinkedIn */}
        <SectionHeader color={PURPLE}>LinkedIn Makeover — 1 Hour</SectionHeader>
        <SubHeader color={PURPLE}>New Headline</SubHeader>
        <CodeBlock>
{`Full Stack Developer (5+ Yrs) | AI-Augmented Engineering | CSM
Perficient Alum | Lambda School Lead | Open to AI-Enhanced Dev Roles`}
        </CodeBlock>

        <SubHeader color={PURPLE}>About Section Framework</SubHeader>
        <CodeBlock>
{`Built Jest frameworks that caught critical financial bugs at Perficient.
Led 17 Lambda students to 100% project completion rate.
Now shipping: AI bug triage tools, Copilot generators, RAG pipelines.

Open to: AI-Augmented Software Engineering | Full Stack | Technical Consulting`}
        </CodeBlock>

        {/* Financial */}
        <SectionHeader color={GOLD}>Financial Runway</SectionHeader>
        <CodeBlock>
{`Unemployment:      ~$1,800/month
DoorDash (20 hrs): ~$800/month
Upwork contracts:  $2,000+/month (10 hrs/week)
─────────────────────────────
Total runway:      ~$4,600/month

Strategy: Apply to 20 roles/week → 2–3 offers in 8–12 weeks`}
        </CodeBlock>

        {/* Mindset */}
        <SectionHeader color={CYAN}>Mindset Shift</SectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {[
            { point: "Layoff = market correction, not personal failure", color: CYAN },
            { point: "Perficient layoffs hit 300+ engineers — this is industry-wide, not individual", color: PURPLE },
            { point: "Your skills are worth more now — AI augmentation multiplies productivity", color: GREEN },
            { point: "Timing is near-perfect: AI hiring boom + remote work normalization", color: GOLD },
          ].map((item) => (
            <div key={item.point} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              backgroundColor: `${item.color}0d`, border: `1px solid ${item.color}33`,
              borderLeft: `3px solid ${item.color}`, borderRadius: "6px", padding: "12px 16px",
            }}>
              <span style={{ color: item.color, fontWeight: 700 }}>→</span>
              <span style={{ color: "#ccd6f6", fontSize: "0.95rem", lineHeight: 1.6 }}>{item.point}</span>
            </div>
          ))}
        </div>

        {/* Week 8 */}
        <SectionHeader color={GREEN}>Week 8 Reality Check</SectionHeader>
        <SubHeader color={GREEN}>Expected Outcomes</SubHeader>
        <CheckList items={[
          "2–3 offers in the $120K–$160K range",
          "Upwork pipeline established at $80+/hour",
          "Portfolio live with 3 AI projects deployed",
          "Interview skills sharp (LeetCode Blind 75 + behavioral prep)",
        ]} color={GREEN} />

        <SubHeader color={ORANGE}>If No Offers by Week 8</SubHeader>
        <CheckList items={[
          "Double Upwork hours ($4K+/month — self-sustaining)",
          "Local contract work (Crown Point / Chicago corridor)",
          "Technical consulting retainer — your Perficient background sells itself",
        ]} color={ORANGE} />

        {/* Resources */}
        <SectionHeader color={PURPLE}>Resources — Start Today</SectionHeader>
        <CodeBlock>
{`LeetCode:     Blind 75 list (2 problems/day)
Portfolio:    Netlify + 3 AI demos (this weekend)
LinkedIn:     10 outreach messages/day (personalized)
Applications: Crossover + FlexJobs AI roles (5/day)
Gig income:   DoorDash (flexible schedule, immediate)`}
        </CodeBlock>

        {/* Closing */}
        <div style={{
          marginTop: "48px", padding: "32px",
          background: `linear-gradient(135deg, ${CYAN}11, ${PURPLE}11)`,
          border: `1px solid ${CYAN}33`, borderRadius: "14px",
        }}>
          <p style={{ color: "#ccd6f6", fontSize: "1.15rem", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 500 }}>
            You're not starting from zero — you're upgrading from good to exceptional.
            The layoff bought you time to specialize in the #1 hiring trend: AI-augmented engineering.
          </p>
          <p style={{ color: lighterBlue, fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            Apply to 5 roles today. Ship 1 AI project this weekend. Momentum beats motivation every time.
          </p>
        </div>

        <p style={{ color: "#4a5568", fontSize: "0.82rem", marginTop: "32px", fontStyle: "italic" }}>
          Written for engineers with 3–7 years experience navigating 2026 layoffs.
          Perficient + Lambda School background puts you ahead of 90% of applicants.
        </p>

        {/* Back link */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
          <a href="/blog" style={{ color: anotherBlue, textDecoration: "none", fontSize: "0.9rem" }}>
            ← Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
};

// ── helpers ──────────────────────────────────────────────────────────────────

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: "#ccd6f6", fontSize: "1.05rem", lineHeight: 1.85, marginBottom: "20px" }}>{children}</p>
);

const SectionHeader: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <h2 style={{ color, fontSize: "1.5rem", fontWeight: 700, margin: "48px 0 20px", paddingTop: "8px", borderTop: `1px solid ${color}22` }}>
    {children}
  </h2>
);

const SubHeader: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <h3 style={{ color, fontSize: "1rem", fontWeight: 600, margin: "24px 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
    {children}
  </h3>
);

const Tag: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{
    backgroundColor: `${color}18`, color, border: `1px solid ${color}44`,
    borderRadius: "20px", padding: "3px 12px", fontSize: "0.78rem", fontWeight: 600,
  }}>
    {children}
  </span>
);

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
  <pre style={{
    backgroundColor: "rgba(10,10,25,0.9)", border: "1px solid rgba(0,210,255,0.15)",
    borderRadius: "8px", padding: "20px", overflowX: "auto",
    color: "#a8b2d8", fontSize: "0.88rem", lineHeight: 1.7,
    fontFamily: "'Fira Code', 'Cascadia Code', monospace", margin: "0 0 24px",
    whiteSpace: "pre-wrap",
  }}>
    {children}
  </pre>
);

const CheckList: React.FC<{ items: string[]; color: string }> = ({ items, color }) => (
  <ul style={{ paddingLeft: "0", listStyle: "none", margin: "0 0 24px" }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", gap: "10px", color: "#ccd6f6", marginBottom: "10px", fontSize: "0.95rem", lineHeight: 1.6 }}>
        <span style={{ color, flexShrink: 0 }}>✓</span>
        {item}
      </li>
    ))}
  </ul>
);

export default LayoffToLeverage;
