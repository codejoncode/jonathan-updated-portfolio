import React, { useState } from "react";
import { darkBlack, lighterBlue, anotherBlue } from "../../Helpers/Colors/colors";

const CYAN = "#00D2FF";
const PURPLE = "#7b61ff";
const GREEN = "#39ff14";
const GOLD = "#ffc947";
const ORANGE = "#ff6b35";

const SECTIONS = [
  { id: "problem", label: "The Problem" },
  { id: "approach", label: "My Approach" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Key Decisions" },
  { id: "results", label: "Results" },
  { id: "lessons", label: "What I'd Do Differently" },
];

const AILegalResearch: React.FC = () => {
  const [active, setActive] = useState("problem");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkBlack,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0,210,255,0.08), rgba(123,97,255,0.08))",
          borderBottom: `1px solid ${CYAN}33`,
          padding: "56px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ color: CYAN, fontSize: "0.85rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Case Study
          </div>
          <h1 style={{ color: "#ccd6f6", fontSize: "2.4rem", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            AI Legal Research Assistant
          </h1>
          <p style={{ color: "#8892b0", fontSize: "1.1rem", margin: "0 0 32px", maxWidth: "640px", lineHeight: 1.7 }}>
            A production RAG system that indexes 50,000+ legal documents and surfaces cited, court-tested answers in under 2 seconds — eliminating hours of manual case law research per query.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Documents Indexed", value: "50,000+", accent: CYAN },
              { label: "Avg Query Time", value: "< 2s P95", accent: GREEN },
              { label: "Research Time Saved", value: "~85%", accent: GOLD },
              { label: "Citation Accuracy", value: "High", accent: PURPLE },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "rgba(26,26,46,0.9)",
                  border: `1px solid ${stat.accent}44`,
                  borderRadius: "10px",
                  padding: "16px 20px",
                  minWidth: "130px",
                }}
              >
                <div style={{ color: stat.accent, fontSize: "1.5rem", fontWeight: 800 }}>{stat.value}</div>
                <div style={{ color: "#8892b0", fontSize: "0.8rem", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tech pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "24px" }}>
            {["Python", "LangChain", "Claude API", "Pinecone", "BM25", "RAGAS", "React", "FastAPI", "PostgreSQL"].map((t) => (
              <span
                key={t}
                style={{
                  backgroundColor: "rgba(0,210,255,0.1)",
                  color: CYAN,
                  border: `1px solid ${CYAN}44`,
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div
        style={{
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
          backgroundColor: "rgba(15,15,35,0.95)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", gap: "0", overflowX: "auto" }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: active === s.id ? `2px solid ${CYAN}` : "2px solid transparent",
                color: active === s.id ? CYAN : "#8892b0",
                padding: "16px 20px",
                fontSize: "0.88rem",
                fontWeight: active === s.id ? 700 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>

        {active === "problem" && (
          <Section title="The Problem" accent={ORANGE}>
            <P>
              Legal professionals and pro se litigants spend enormous time doing case law research manually —
              reading through hundreds of documents, cross-referencing statutes, and trying to surface the
              right precedent for a specific fact pattern. A typical research session could take 4–8 hours
              and still miss relevant cases buried in dense document archives.
            </P>
            <P>
              The specific challenge I was solving: a corpus of <strong style={{ color: CYAN }}>50,000+ legal documents</strong> —
              case opinions, statutes, motions, and regulatory filings — needed to be queryable in plain
              English, with answers grounded to specific source documents and page numbers. Hallucinated
              citations in a legal context aren't just wrong — they're harmful.
            </P>
            <CalloutBox accent={ORANGE} label="Core Constraint">
              Every answer had to be traceable to a real document and page. No fabricated citations. If the
              system wasn't confident, it needed to say so rather than guess.
            </CalloutBox>
          </Section>
        )}

        {active === "approach" && (
          <Section title="My Approach" accent={PURPLE}>
            <P>
              I chose a <strong style={{ color: CYAN }}>hybrid retrieval architecture</strong> — combining dense vector
              search (semantic similarity) with BM25 sparse retrieval (keyword matching). Neither approach
              alone handles the full range of legal queries: semantic search finds conceptually related
              documents but misses exact statute references; BM25 finds exact matches but misses synonyms
              and paraphrasing.
            </P>
            <P>
              For the LLM layer, I selected the Claude API for its 200k context window and lower hallucination
              rate on factual retrieval tasks compared to alternatives I tested. Critically, I engineered
              prompts that instruct the model to cite document IDs and page numbers inline, and to explicitly
              state uncertainty rather than fabricate.
            </P>
            <P>
              I built evaluation into the system from day one using <strong style={{ color: GREEN }}>RAGAS</strong> —
              measuring Faithfulness, Answer Relevancy, and Context Recall on a labeled test set. This gave
              me a feedback loop to iterate on retrieval quality without guessing.
            </P>
            <CalloutBox accent={PURPLE} label="AI Tools Used in Development">
              Used Claude for architectural design discussions and prompt iteration. Used GitHub Copilot for
              boilerplate generation (chunking utilities, embedding pipelines). Used Perplexity to research
              tradeoffs between vector database options before selecting Pinecone.
            </CalloutBox>
          </Section>
        )}

        {active === "architecture" && (
          <Section title="System Architecture" accent={CYAN}>
            <P>The system is a 6-stage pipeline from raw query to grounded answer:</P>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "24px 0" }}>
              {[
                { step: "1", label: "Ingest & Chunk", detail: "Documents split into ~500-token chunks with overlap. Metadata extracted: doc ID, page, jurisdiction, date.", accent: CYAN },
                { step: "2", label: "Embed", detail: "Each chunk embedded via text-embedding-3-large. Vectors stored in Pinecone with metadata filters.", accent: PURPLE },
                { step: "3", label: "Query Decomposition", detail: "Complex multi-part questions broken into sub-queries before retrieval to improve recall.", accent: GREEN },
                { step: "4", label: "Hybrid Retrieval", detail: "Dense vector search + BM25 run in parallel. Results merged and re-ranked by a cross-encoder.", accent: GOLD },
                { step: "5", label: "Context Assembly", detail: "Top-k chunks assembled into a structured context block with source metadata preserved.", accent: ORANGE },
                { step: "6", label: "LLM Generate", detail: "Claude generates answer grounded to context. Citation format enforced in system prompt. Faithfulness checked post-generation.", accent: CYAN },
              ].map((stage) => (
                <div
                  key={stage.step}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    backgroundColor: "rgba(26,26,46,0.7)",
                    border: `1px solid ${stage.accent}33`,
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ color: stage.accent, fontWeight: 800, fontSize: "1.1rem", minWidth: "24px" }}>{stage.step}</div>
                  <div>
                    <div style={{ color: stage.accent, fontWeight: 700, marginBottom: "4px" }}>{stage.label}</div>
                    <div style={{ color: "#8892b0", fontSize: "0.9rem", lineHeight: 1.6 }}>{stage.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {active === "decisions" && (
          <Section title="Key Technical Decisions" accent={GOLD}>
            {[
              {
                decision: "Claude over GPT-4o for generation",
                why: "200k context window let me pass more retrieved chunks without truncation. Lower hallucination rate on factual tasks in my own evals. Streaming reliability was better for the UI.",
                tradeoff: "Higher per-token cost. Mitigated by caching common queries and limiting context to top-4 chunks.",
                accent: CYAN,
              },
              {
                decision: "Hybrid retrieval over dense-only",
                why: "Statute references like '§ IC 31-15-7-4' are exact strings — semantic search alone scores them poorly. BM25 catches these; the re-ranker decides what actually matters.",
                tradeoff: "More infrastructure complexity. Two retrieval systems to maintain and tune.",
                accent: PURPLE,
              },
              {
                decision: "RAGAS evals from day one",
                why: "Without a measurement framework, prompt changes are guesswork. RAGAS gave me a Faithfulness score I could track across iterations. Found a 0.12 drop when I shortened context — caught it before it shipped.",
                tradeoff: "Required building a labeled eval dataset upfront (~200 QA pairs). Time investment that paid back quickly.",
                accent: GREEN,
              },
              {
                decision: "Explicit uncertainty over silent failure",
                why: "Legal context. A hallucinated case citation could cause real harm. System prompt instructs: if the retrieved context doesn't support the answer, say so.",
                tradeoff: "Higher 'I don't know' rate on edge cases. Users preferred this over confident wrong answers.",
                accent: ORANGE,
              },
            ].map((item) => (
              <div
                key={item.decision}
                style={{
                  backgroundColor: "rgba(26,26,46,0.7)",
                  border: `1px solid ${item.accent}33`,
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ color: item.accent, fontWeight: 700, marginBottom: "8px" }}>{item.decision}</div>
                <div style={{ color: "#ccd6f6", fontSize: "0.92rem", marginBottom: "8px", lineHeight: 1.6 }}>
                  <strong style={{ color: "#8892b0" }}>Why: </strong>{item.why}
                </div>
                <div style={{ color: "#8892b0", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  <strong>Tradeoff: </strong>{item.tradeoff}
                </div>
              </div>
            ))}
          </Section>
        )}

        {active === "results" && (
          <Section title="Results" accent={GREEN}>
            <P>
              The system moved legal research from a multi-hour manual process to a sub-2-second query.
              The qualitative shift was more significant: researchers stopped worrying about missing
              relevant cases because the hybrid retrieval surfaces documents they wouldn't have found
              through manual keyword search alone.
            </P>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "24px 0" }}>
              {[
                { metric: "Query latency (P95)", before: "—", after: "< 2 seconds", accent: GREEN },
                { metric: "Research session time", before: "4–8 hours", after: "~30–45 min", accent: CYAN },
                { metric: "RAGAS Faithfulness", before: "—", after: "> 0.91", accent: PURPLE },
                { metric: "RAGAS Retrieval Recall@4", before: "—", after: "> 0.88", accent: GOLD },
              ].map((row) => (
                <div
                  key={row.metric}
                  style={{
                    backgroundColor: "rgba(26,26,46,0.8)",
                    border: `1px solid ${row.accent}33`,
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ color: "#8892b0", fontSize: "0.8rem", marginBottom: "8px" }}>{row.metric}</div>
                  {row.before !== "—" && (
                    <div style={{ color: "#4a5568", fontSize: "0.85rem", textDecoration: "line-through", marginBottom: "4px" }}>{row.before}</div>
                  )}
                  <div style={{ color: row.accent, fontWeight: 700, fontSize: "1.2rem" }}>{row.after}</div>
                </div>
              ))}
            </div>
            <CalloutBox accent={GREEN} label="Biggest Win">
              The citation grounding eliminated the trust problem. Users weren't just getting answers —
              they were getting answers they could verify. That changed how they used the tool: from
              cautious spot-checking to primary research workflow.
            </CalloutBox>
          </Section>
        )}

        {active === "lessons" && (
          <Section title="What I'd Do Differently" accent={anotherBlue}>
            <P>Every production system teaches you something the design phase didn't.</P>
            {[
              {
                label: "Start with evals, not the pipeline",
                detail: "I built the retrieval pipeline first and added RAGAS evals later. Next time: define the eval set and success metrics before writing any pipeline code. You can't improve what you can't measure, and you need the measurement to know when to stop iterating.",
              },
              {
                label: "Chunk strategy matters more than I expected",
                detail: "I started with fixed 500-token chunks. Statute sections and case holdings don't respect token boundaries — they respect paragraph and section boundaries. Switched to semantic chunking mid-project. Should have done it from the start.",
              },
              {
                label: "Add observability from day one",
                detail: "Query logging, latency tracing, and per-query retrieval quality scores should be built in before the first user touches it. Retrofitting observability is painful and you're flying blind until it's in place.",
              },
              {
                label: "User feedback loop earlier",
                detail: "I iterated on retrieval quality using RAGAS evals on a test set. Those evals didn't fully capture real user queries — the distribution was different. Earlier user testing would have surfaced this gap faster.",
              },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <div style={{ color: lighterBlue, fontWeight: 600, marginBottom: "6px" }}>{item.label}</div>
                <div style={{ color: "#8892b0", fontSize: "0.92rem", lineHeight: 1.7 }}>{item.detail}</div>
              </div>
            ))}
          </Section>
        )}

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: "64px",
            padding: "32px",
            backgroundColor: "rgba(26,26,46,0.9)",
            border: `1px solid ${CYAN}33`,
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#ccd6f6", marginBottom: "20px", fontSize: "1rem" }}>
            Want to discuss the architecture or explore similar systems?
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/contact" style={{ backgroundColor: CYAN, color: darkBlack, padding: "10px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: 700 }}>
              Get In Touch
            </a>
            <a href="/ai-engineer" style={{ backgroundColor: "transparent", color: CYAN, border: `2px solid ${CYAN}`, padding: "10px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: 700 }}>
              AI Engineer Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helpers to keep JSX clean
const Section: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div>
    <h2 style={{ color: accent, fontSize: "1.6rem", fontWeight: 700, marginBottom: "24px" }}>{title}</h2>
    {children}
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: "#ccd6f6", fontSize: "1rem", lineHeight: 1.8, marginBottom: "16px" }}>{children}</p>
);

const CalloutBox: React.FC<{ accent: string; label: string; children: React.ReactNode }> = ({ accent, label, children }) => (
  <div
    style={{
      backgroundColor: `${accent}11`,
      border: `1px solid ${accent}44`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: "8px",
      padding: "16px 20px",
      margin: "20px 0",
    }}
  >
    <div style={{ color: accent, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{label}</div>
    <div style={{ color: "#ccd6f6", fontSize: "0.95rem", lineHeight: 1.7 }}>{children}</div>
  </div>
);

export default AILegalResearch;
