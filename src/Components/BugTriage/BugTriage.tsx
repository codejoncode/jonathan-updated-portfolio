import React, { useState, useRef } from "react";
import { darkBlack } from "../../Helpers/Colors/colors";

const CYAN = "#00D2FF";
const GREEN = "#39ff14";
const ORANGE = "#ff6b35";
const PURPLE = "#7b61ff";
const GOLD = "#ffc947";

const EXAMPLES = [
  {
    label: "TypeError",
    error: "TypeError: Cannot read properties of undefined (reading 'map')\n    at ProductList (ProductList.jsx:24)\n    at renderWithHooks (react-dom.development.js:14985)",
  },
  {
    label: "CORS",
    error: "Access to fetch at 'https://api.example.com/data' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
  },
  {
    label: "React Hooks",
    error: "Error: Rendered more hooks than during the previous render.\n    at resolveDispatcher (react.development.js:1476)\n    at useState (react.development.js:1506)",
  },
  {
    label: "Module Missing",
    error: "Error: Cannot find module '@/components/Button'\nRequire stack:\n- /app/src/pages/Home.tsx",
  },
  {
    label: "ECONNREFUSED",
    error: "Error: connect ECONNREFUSED 127.0.0.1:5432\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1300:16)",
  },
  {
    label: "JWT 401",
    error: "Error: 401 Unauthorized — invalid signature\n    JsonWebTokenError: invalid signature\n    at /verify (/app/middleware/auth.js:18)",
  },
];

interface TriageResult {
  type: string;
  confidence: string;
  rootCause: string;
  explanation: string;
  fix: string;
  prevention: string;
}

const BugTriage: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyze = async (text?: string) => {
    const errorMessage = text ?? input;
    if (!errorMessage.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setRevealed(false);

    try {
      const res = await fetch("/.netlify/functions/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed.");
        return;
      }

      setResult(data);
      setTimeout(() => {
        setRevealed(true);
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (ex: typeof EXAMPLES[0]) => {
    setInput(ex.error);
    analyze(ex.error);
  };

  const confidenceColor = (c: string) =>
    c === "High" ? GREEN : c === "Medium" ? GOLD : ORANGE;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: darkBlack, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0,210,255,0.07), rgba(255,107,53,0.05))",
        borderBottom: `1px solid ${CYAN}22`,
        padding: "56px 24px 40px",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ color: ORANGE, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Live Demo · AI Tool
          </div>
          <h1 style={{ color: "#ccd6f6", fontSize: "2.4rem", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            AI Bug Triage Assistant
          </h1>
          <p style={{ color: "#8892b0", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 24px" }}>
            Paste any stack trace or error message. Get an instant root cause analysis,
            copy-paste fix, and prevention tip — the same workflow used to diagnose
            critical financial system bugs at Perficient.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { val: "20+", lbl: "Error patterns" },
              { val: "< 1s", lbl: "Response time" },
              { val: "Free", lbl: "Zero cost" },
            ].map((s) => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{ color: CYAN, fontWeight: 800, fontSize: "1.3rem" }}>{s.val}</div>
                <div style={{ color: "#4a5568", fontSize: "0.78rem" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Example pills */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ color: "#8892b0", fontSize: "0.82rem", marginBottom: "10px" }}>
            Try an example:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => handleExample(ex)}
                style={{
                  background: "rgba(26,26,46,0.9)",
                  border: `1px solid rgba(0,210,255,0.25)`,
                  color: CYAN,
                  borderRadius: "20px",
                  padding: "5px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = CYAN)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.25)")}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{
          backgroundColor: "rgba(26,26,46,0.9)",
          border: `1px solid rgba(0,210,255,0.2)`,
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "16px",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}>
            <span style={{ color: "#ff5f57", fontSize: "10px" }}>●</span>
            <span style={{ color: "#febc2e", fontSize: "10px" }}>●</span>
            <span style={{ color: "#28c840", fontSize: "10px" }}>●</span>
            <span style={{ color: "#4a5568", fontSize: "0.78rem", marginLeft: "8px" }}>error_input.log</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your stack trace or error message here..."
            rows={8}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#a8b2d8",
              fontSize: "0.88rem",
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              lineHeight: 1.7,
              padding: "16px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={() => analyze()}
          disabled={loading || !input.trim()}
          style={{
            width: "100%",
            background: loading
              ? "rgba(0,210,255,0.2)"
              : `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
            color: darkBlack,
            border: "none",
            borderRadius: "8px",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: !input.trim() ? 0.5 : 1,
            transition: "all 0.2s",
            marginBottom: "32px",
          }}
        >
          {loading ? (
            <span style={{ color: CYAN }}>
              Analyzing<span className="bt-dots">...</span>
            </span>
          ) : (
            "Analyze Bug →"
          )}
        </button>

        {/* Error state */}
        {error && (
          <div style={{
            backgroundColor: "rgba(255,107,53,0.1)",
            border: `1px solid ${ORANGE}44`,
            borderRadius: "8px",
            padding: "16px",
            color: ORANGE,
            marginBottom: "24px",
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            ref={resultRef}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {/* Header bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "12px", marginBottom: "20px",
            }}>
              <div>
                <span style={{
                  backgroundColor: "rgba(255,107,53,0.15)",
                  color: ORANGE, border: `1px solid ${ORANGE}44`,
                  borderRadius: "6px", padding: "4px 12px",
                  fontSize: "0.82rem", fontWeight: 700,
                }}>
                  {result.type}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#4a5568", fontSize: "0.8rem" }}>Confidence:</span>
                <span style={{
                  color: confidenceColor(result.confidence),
                  fontWeight: 700, fontSize: "0.85rem",
                }}>
                  {result.confidence}
                </span>
              </div>
            </div>

            {/* Root cause */}
            <ResultCard accent={ORANGE} label="Root Cause">
              <p style={{ color: "#ccd6f6", margin: 0, fontSize: "1rem", fontWeight: 500, lineHeight: 1.6 }}>
                {result.rootCause}
              </p>
            </ResultCard>

            {/* Explanation */}
            <ResultCard accent={CYAN} label="Why This Happens">
              <p style={{ color: "#8892b0", margin: 0, fontSize: "0.95rem", lineHeight: 1.75 }}>
                {result.explanation}
              </p>
            </ResultCard>

            {/* Fix */}
            <ResultCard accent={GREEN} label="Fix">
              <div style={{
                position: "relative",
              }}>
                <CopyButton text={result.fix} />
                <pre style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: "6px",
                  padding: "16px",
                  margin: 0,
                  overflowX: "auto",
                  color: "#a8b2d8",
                  fontSize: "0.83rem",
                  lineHeight: 1.7,
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  whiteSpace: "pre-wrap",
                }}>
                  {result.fix}
                </pre>
              </div>
            </ResultCard>

            {/* Prevention */}
            <ResultCard accent={PURPLE} label="Prevention">
              <p style={{ color: "#8892b0", margin: 0, fontSize: "0.95rem", lineHeight: 1.75 }}>
                {result.prevention}
              </p>
            </ResultCard>

            {/* Try another */}
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <button
                onClick={() => { setResult(null); setInput(""); setError(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{
                  background: "transparent",
                  border: `1px solid ${CYAN}44`,
                  color: CYAN,
                  borderRadius: "6px",
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Analyze Another Error
              </button>
            </div>
          </div>
        )}

        {/* Tech note */}
        <div style={{
          marginTop: "64px",
          padding: "20px 24px",
          backgroundColor: "rgba(26,26,46,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "8px",
          display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#4a5568", fontSize: "0.78rem", marginBottom: "4px" }}>Stack</div>
            <div style={{ color: "#8892b0", fontSize: "0.85rem" }}>
              React · TypeScript · Netlify Functions · Node.js
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568", fontSize: "0.78rem", marginBottom: "4px" }}>Architecture</div>
            <div style={{ color: "#8892b0", fontSize: "0.85rem" }}>
              Serverless API · Pattern analysis engine · Zero infra cost
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568", fontSize: "0.78rem", marginBottom: "4px" }}>Production path</div>
            <div style={{ color: "#8892b0", fontSize: "0.85rem" }}>
              Drop-in Claude API upgrade when budget allows
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes bt-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .bt-dots { animation: bt-blink 1.2s ease infinite; }
      `}</style>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const ResultCard: React.FC<{ accent: string; label: string; children: React.ReactNode }> = ({ accent, label, children }) => (
  <div style={{
    backgroundColor: "rgba(26,26,46,0.8)",
    border: `1px solid ${accent}33`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
  }}>
    <div style={{ color: accent, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
      {label}
    </div>
    {children}
  </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "rgba(0,210,255,0.15)",
        border: "1px solid rgba(0,210,255,0.3)",
        color: copied ? GREEN : CYAN,
        borderRadius: "4px",
        padding: "4px 10px",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        zIndex: 1,
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default BugTriage;
