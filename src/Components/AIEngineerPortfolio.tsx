import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AIEngineerPortfolio.css";

// ─── STREAMING UTILITY ────────────────────────────────────────────────────────
function useStreamer() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const stream = useCallback(
    (
      text: string,
      onChunk: (partial: string) => void,
      onDone: () => void,
      baseDelay = 10
    ) => {
      cancel();
      let accumulated = "";
      let i = 0;

      const tick = () => {
        if (i >= text.length) { onDone(); return; }
        // burst 1-3 chars for speed, pause at punctuation
        const burst = text[i] === " " ? 2 : 1;
        accumulated += text.slice(i, i + burst);
        i += burst;
        onChunk(accumulated);
        const ch = text[i] || "";
        const delay =
          ch === "\n" ? 55 :
          ch === "." || ch === "!" || ch === "?" ? 70 :
          ch === "," || ch === ":" ? 40 :
          baseDelay + Math.random() * 14;
        const t = setTimeout(tick, delay);
        timers.current.push(t);
      };
      tick();
    },
    [cancel]
  );

  useEffect(() => () => cancel(), [cancel]);
  return { stream, cancel };
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  tokens?: number;
  ms?: number;
}

interface Scenario {
  id: string;
  label: string;
  color: string;
  userMsg: string;
  response: string;
  tokens: number;
  ms: number;
}

interface RagStage {
  icon: string;
  num: string;
  name: string;
  idleData: string;
  activeData: string;
  doneData: string;
}

interface AgentStep {
  type: "thought" | "action" | "observation" | "answer";
  label: string;
  content: string;
  delayMs: number;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "rag",
    label: "Build a RAG System",
    color: "cyan",
    userMsg: "Walk me through building a production RAG system for 50k legal documents.",
    tokens: 487,
    ms: 1840,
    response: `Great question. Here's how I'd architect this for production reliability — not just a demo.

**1. Chunking Strategy**
Legal docs need careful chunking. Split on section headers first, then structural breaks:

\`\`\`python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,        # Larger for legal context
    chunk_overlap=100,     # Preserve cross-boundary refs
    separators=[
        "\\n## ", "\\n### ",   # Section headers first
        "\\n\\n", "\\n", ". " # Then structural breaks
    ]
)
\`\`\`

**2. Hybrid Retrieval (Critical)**
Dense-only misses exact statute citations. Add BM25 for keyword precision:

\`\`\`python
from langchain.retrievers import EnsembleRetriever

retriever = EnsembleRetriever(
    retrievers=[dense_retriever, bm25_retriever],
    weights=[0.6, 0.4]    # 60% semantic, 40% keyword
)
# Cohere re-ranker improves MRR by ~18%
reranker = CohereRerank(model="rerank-english-v3.0", top_n=4)
\`\`\`

**3. Citations — Non-Negotiable**
Every chunk must carry doc_id, section, and page:

\`\`\`python
qa_chain = RetrievalQAWithSourcesChain.from_chain_type(
    llm=ChatAnthropic(model="claude-sonnet-4-6"),
    retriever=compression_retriever,
    return_source_documents=True,
)
\`\`\`

**Production Targets I'd Set at Kickoff:**
- Retrieval Recall@4: > 0.90
- Answer Faithfulness (RAGAS): > 0.92
- P95 latency: embed (100ms) + search (50ms) + LLM (1.5s) = < 2s ✓
- Cost per query: ~$0.003 at current pricing`,
  },
  {
    id: "debug",
    label: "Debug My Agent",
    color: "purple",
    userMsg: `My LangChain agent loops infinitely. Here's the issue:

agent = initialize_agent(tools, llm, agent="zero-shot-react-description")
result = agent.run("Search for AAPL price then calculate 5% of it")
# Keeps calling search tool in a loop, never stops`,
    tokens: 312,
    ms: 1420,
    response: `Classic ReAct loop failure — three likely causes. Let me diagnose.

**Root Cause #1: Tool Description Too Vague**
"zero-shot-react" relies entirely on tool descriptions to decide when to stop. If your search tool description doesn't define its output format, the agent re-queries trying to find a "better" answer.

\`\`\`python
# Bad — agent doesn't know when search is "done"
tools = [Tool(name="Search", func=search_fn, description="Search the web")]

# Good — explicit input/output contract
tools = [Tool(
    name="SearchStockPrice",
    func=search_fn,
    description="""Search for a stock's current price.
    Input: ticker symbol (e.g. 'AAPL')
    Output: current price as a float (e.g. 182.50)
    Use ONLY when you need a price. Do NOT call repeatedly."""
)]
\`\`\`

**Root Cause #2: Missing Calculator Tool**
Agent can't do math, so it loops on search trying to "find" 5% of the price.

\`\`\`python
from langchain.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a math expression. Input: '182.50 * 0.05' → Output: '9.125'"""
    return str(eval(expression))  # Use numexpr in prod for safety

tools = [search_tool, calculator]
\`\`\`

**Root Cause #3: Set Max Iterations**

\`\`\`python
agent = initialize_agent(
    tools, llm,
    agent="zero-shot-react-description",
    max_iterations=6,          # Hard stop
    early_stopping_method="generate",  # Force final answer
    verbose=True               # See reasoning in dev
)
\`\`\`

Apply all three — my bet is #1 + #2 together caused it.`,
  },
  {
    id: "prompt",
    label: "Optimize My Prompt",
    color: "green",
    userMsg: `My extraction prompt is inconsistent — sometimes returns JSON, sometimes prose:

"Extract the contract start date, end date, and total value from this text: {contract_text}"`,
    tokens: 356,
    ms: 1610,
    response: `Your prompt has three problems: no output schema, no format enforcement, and no examples. Here's the fix.

**Problem Analysis:**
- No schema → model invents its own format each time
- No examples → model has no anchor for what "good" looks like
- Text instruction alone → prose responses when confidence is low

**Optimized Prompt:**

\`\`\`python
SYSTEM = """You are a contract data extractor. Extract fields with precision.
ALWAYS return valid JSON matching this exact schema — nothing else:
{
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null",
  "total_value": number_or_null,
  "currency": "USD/EUR/GBP or null",
  "confidence": "high|medium|low"
}
If a field is not found, use null. Never hallucinate values."""

FEW_SHOT = """
EXAMPLE 1:
Text: "Agreement effective January 15, 2024 through December 31, 2025, valued at $450,000."
Output: {"start_date":"2024-01-15","end_date":"2025-12-31","total_value":450000,"currency":"USD","confidence":"high"}

EXAMPLE 2:
Text: "This consulting arrangement commences upon signing for a fee of fifty thousand euros."
Output: {"start_date":null,"end_date":null,"total_value":50000,"currency":"EUR","confidence":"medium"}
"""

USER = f"{FEW_SHOT}\\n\\nNow extract from:\\n{contract_text}"
\`\`\`

**Why This Works:**
- Schema enforcement → JSON every time (validate with Pydantic)
- Few-shot anchors → model learns your exact format from examples
- Confidence field → flag uncertain extractions for human review
- System role separation → model can't "escape" the persona

**Validate output with Pydantic for zero hallucination risk:**

\`\`\`python
class ContractExtraction(BaseModel):
    start_date: Optional[date]
    end_date: Optional[date]
    total_value: Optional[float]
    currency: Optional[str]
    confidence: Literal["high", "medium", "low"]
\`\`\``,
  },
  {
    id: "compare",
    label: "Claude vs GPT-4o",
    color: "gold",
    userMsg: "Which LLM should I use for a document summarization pipeline processing 10k legal docs/month?",
    tokens: 298,
    ms: 1380,
    response: `For legal doc summarization at that scale, here's my honest technical breakdown.

**Claude 3.5 Sonnet — Advantages for Your Case:**
- 200k context window handles full contracts without chunking
- Stronger instruction following on structured output (key for legal)
- Lower hallucination rate on factual extraction tasks (~8% better on LegalBench)
- Streaming API is more reliable at sustained throughput

**GPT-4o — Advantages:**
- Slightly faster on short documents (< 4k tokens)
- Better function calling reliability for tool-heavy pipelines
- More ecosystem tooling (OpenAI cookbook, LangChain first-class support)

**My Recommendation: Claude 3.5 Sonnet**
For legal specifically — the 200k context is the deciding factor. You can send entire contracts in one shot rather than chunking + stitching, which eliminates a whole failure mode.

\`\`\`python
# Cost at 10k docs/month estimate
# Average legal doc: ~8,000 tokens input, ~800 tokens output
# Claude 3.5 Sonnet: $3/M input, $15/M output
monthly_input_tokens  = 10_000 * 8_000          # 80M tokens
monthly_output_tokens = 10_000 * 800             # 8M tokens
monthly_cost = (80 * 3) + (8 * 15)              # $240 + $120 = $360/mo
\`\`\`

**Architecture I'd Use:**

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

async def summarize_legal_doc(text: str) -> dict:
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=LEGAL_SUMMARY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": text}]
    )
    return parse_structured_summary(response.content[0].text)
\`\`\`

Run a 100-doc eval on both before committing — your specific document types matter.`,
  },
  {
    id: "system",
    label: "Design AI Support System",
    color: "purple",
    userMsg: "Design an AI customer support system that auto-resolves Tier 1 tickets and handles 10k/day volume.",
    tokens: 521,
    ms: 2100,
    response: `Here's the architecture I'd build. The key is layers: classify first, resolve second, escalate third.

**System Architecture:**

\`\`\`
User Message
    │
    ▼
[1] CLASSIFIER (fast, cheap — GPT-4o-mini)
    ├── FAQ / Policy Question     → RAG resolver
    ├── Account Action Request    → Tool-calling agent
    ├── Technical Issue           → Diagnostic agent
    ├── Frustrated / Escalation   → Human queue (fast-path)
    └── Billing Dispute           → Human queue (legal)
    │
    ▼
[2] SPECIALIZED RESOLVER
    ├── RAG Resolver: query knowledge base, return cited answer
    ├── Action Agent: tools → query_order(), process_refund(), update_account()
    └── Diagnostic Agent: troubleshooting tree via ReAct loop
    │
    ▼
[3] RESPONSE VALIDATOR
    Checks: tone, accuracy, completeness, policy compliance
    Rewrites if confidence < 0.85
    │
    ▼
[4] DELIVERY + LOGGING
    Send response + log to LangSmith for eval
\`\`\`

**Classifier (the most important piece):**

\`\`\`python
CLASSIFIER_PROMPT = """Classify this support ticket into exactly one category.
Categories: FAQ | ACCOUNT_ACTION | TECHNICAL | ESCALATE_FRUSTRATED | ESCALATE_BILLING
Return JSON: {"category": "...", "confidence": 0.0-1.0, "reason": "..."}
ESCALATE if: user expresses anger, legal threat, or 3+ prior contacts."""
\`\`\`

**Scaling to 10k/day (~7 req/min avg, 50 req/min peak):**
- Classifier: async batch, ~$8/day at gpt-4o-mini pricing
- RAG resolvers: cache top-500 FAQ embeddings in Redis (80% hit rate)
- Rate limit: 50 concurrent sessions, queue overflow to SQS
- SLA: classifier < 200ms, full response < 3s

**Metrics I'd Track from Day 1:**
- Auto-resolution rate (target: 65%+ of Tier 1)
- CSAT on AI-handled tickets (target: > 4.2/5)
- Escalation accuracy (false escalations waste human time)
- Hallucination rate (eval 500 random responses/week with judge LLM)

Want me to go deeper on any layer — the RAG KB design, the tool-calling agent, or the eval pipeline?`,
  },
];

// ─── RAG PIPELINE STAGES ─────────────────────────────────────────────────────
const RAG_STAGES: RagStage[] = [
  {
    icon: "💬",
    num: "01",
    name: "User Query",
    idleData: "Waiting for query...",
    activeData: '"What are the force\nmajeure clauses in\nthe IBM contract?"',
    doneData: '"What are the force\nmajeure clauses in\nthe IBM contract?"',
  },
  {
    icon: "🔢",
    num: "02",
    name: "Embed Query",
    idleData: "text-embedding-3-large\nwaiting...",
    activeData: "Encoding query...\nmodel: te-3-large",
    doneData: "[0.234, -0.891,\n0.441, 0.129...]\n1536-dim vector",
  },
  {
    icon: "🔍",
    num: "03",
    name: "Vector Search",
    idleData: "Pinecone index\nwaiting...",
    activeData: "Searching 50k\ndocuments...",
    doneData: "Top 3 matches:\n0.94 · IBM_2024.pdf\n0.91 · IBM_Amend.pdf\n0.87 · Template.pdf",
  },
  {
    icon: "📄",
    num: "04",
    name: "Re-rank",
    idleData: "Cohere rerank-3\nwaiting...",
    activeData: "Re-ranking 12\ncandidates...",
    doneData: "Final top-4:\n[IBM_2024 §14.3]\n[IBM_2024 §14.4]\n[IBM_Amend §7]",
  },
  {
    icon: "⚙️",
    num: "05",
    name: "Build Prompt",
    idleData: "Context assembly\nwaiting...",
    activeData: "Assembling\naugmented prompt...",
    doneData: "System + 4 chunks\n+ query\n≈ 3,200 tokens",
  },
  {
    icon: "🤖",
    num: "06",
    name: "LLM Generate",
    idleData: "claude-sonnet-4-6\nwaiting...",
    activeData: "Streaming response\nfrom Claude...",
    doneData: "Response: 284 tokens\nLatency: 1.4s\nCitations: 3",
  },
];

const RAG_RESULT = `The IBM Master Services Agreement (2024) contains force majeure provisions in <span class="ai-rag-citation">§14.3</span> and <span class="ai-rag-citation">§14.4</span>.

**§14.3** defines qualifying events as: acts of God, war, terrorism, government action, or labor disputes exceeding 10 business days. Neither party is liable for delays caused by such events.

**§14.4 (Amendment, 2024-03)** adds: cyberattacks on critical infrastructure and pandemic declarations as qualifying force majeure events — a post-COVID addition.

**Key limitation:** Force majeure does NOT excuse payment obligations. Client must continue fee payments even during a qualifying event per §14.4(c).`;

// ─── AGENT STEPS ─────────────────────────────────────────────────────────────
const AGENT_SCENARIOS = [
  {
    task: "Research AAPL stock, check if it beat earnings, then calculate portfolio impact for a $50k position",
    tools: ["get_stock_price", "get_earnings_data", "calculator", "search_news"],
    steps: [
      {
        type: "thought" as const,
        label: "Thought",
        delayMs: 800,
        content: `I need to complete 3 sub-tasks: (1) get current AAPL price, (2) check if last earnings beat estimates, (3) calculate $50k position value. I'll start with the price.`,
      },
      {
        type: "action" as const,
        label: "Action",
        delayMs: 1400,
        content: `Calling <code>get_stock_price("AAPL")</code>`,
      },
      {
        type: "observation" as const,
        label: "Observation",
        delayMs: 1800,
        content: `AAPL: $211.45 · +1.23% today · Market cap: $3.24T · P/E: 34.2`,
      },
      {
        type: "thought" as const,
        label: "Thought",
        delayMs: 2400,
        content: `Got the price ($211.45). Now I need the earnings data to check if they beat estimates.`,
      },
      {
        type: "action" as const,
        label: "Action",
        delayMs: 3000,
        content: `Calling <code>get_earnings_data("AAPL", quarter="Q4_2024")</code>`,
      },
      {
        type: "observation" as const,
        label: "Observation",
        delayMs: 3600,
        content: `Q4 2024: EPS actual $1.64 vs estimate $1.60 → Beat by +2.5%\nRevenue: $124.3B vs $122.1B estimate → Beat by +1.8%`,
      },
      {
        type: "thought" as const,
        label: "Thought",
        delayMs: 4200,
        content: `Earnings beat on both EPS and revenue. Now calculate position value: $50,000 / $211.45 = shares, then current value.`,
      },
      {
        type: "action" as const,
        label: "Action",
        delayMs: 4800,
        content: `Calling <code>calculator("50000 / 211.45")</code>`,
      },
      {
        type: "observation" as const,
        label: "Observation",
        delayMs: 5200,
        content: `236.45 shares (at current price of $211.45)`,
      },
      {
        type: "answer" as const,
        label: "Final Answer",
        delayMs: 5800,
        content: `**AAPL Summary for $50k Position:**

• Current price: **$211.45** (+1.23% today)
• Shares you can buy: **236.45 shares**
• Q4 2024 earnings: **Beat** — EPS $1.64 (+2.5% above estimate), Revenue $124.3B (+1.8% above estimate)
• Sentiment: Bullish — back-to-back earnings beats with Services revenue at record high

Position is in good shape. Earnings beat typically supports 2-5% price appreciation in the next 5 trading days based on historical AAPL patterns.`,
      },
    ] as AgentStep[],
  },
  {
    task: "Find the top 3 AI Engineer job postings, extract required skills, and identify skill gaps vs my profile",
    tools: ["search_jobs", "extract_skills", "compare_profiles"],
    steps: [
      {
        type: "thought" as const,
        label: "Thought",
        delayMs: 700,
        content: `I'll search for AI Engineer roles, extract the required skills from each, then compare against the portfolio profile to surface gaps.`,
      },
      {
        type: "action" as const,
        label: "Action",
        delayMs: 1200,
        content: `Calling <code>search_jobs("AI Engineer", limit=3, seniority="senior")</code>`,
      },
      {
        type: "observation" as const,
        label: "Observation",
        delayMs: 2000,
        content: `Found 3 top results:
1. Senior AI Engineer — Anthropic ($280-360k)
2. LLM Platform Engineer — OpenAI ($300-400k)
3. AI/ML Engineer — Scale AI ($220-280k)`,
      },
      {
        type: "action" as const,
        label: "Action",
        delayMs: 2800,
        content: `Calling <code>extract_skills(job_ids=[1,2,3])</code>`,
      },
      {
        type: "observation" as const,
        label: "Observation",
        delayMs: 3600,
        content: `Common required: Python, LLM APIs, RAG, Prompt Engineering, evals
Frequently listed: distributed systems, CUDA/GPU optimization, Kubernetes
Nice-to-have: Rust, RLHF hands-on, custom CUDA kernels`,
      },
      {
        type: "answer" as const,
        label: "Final Answer",
        delayMs: 4400,
        content: `**Profile Match Analysis:**

✅ **Strong matches:** Python, LLM APIs (Claude/OpenAI/Gemini), RAG systems, Prompt Engineering, Evals, FastAPI, Docker — covers ~80% of requirements

⚠️ **Gaps to address:**
• Distributed systems at scale (Kubernetes/Ray) — add 1 project
• GPU optimization / CUDA — take DeepLearning.AI GPU course
• RLHF hands-on experience — Hugging Face TRL library project

**Recommendation:** You're well-positioned for the Scale AI role immediately. Anthropic/OpenAI roles need the distributed systems gap closed first.`,
      },
    ] as AgentStep[],
  },
];

// ─── PROMPT TECHNIQUES ───────────────────────────────────────────────────────
const PROMPT_TECHNIQUES = [
  {
    label: "Chain-of-Thought",
    badge: "Reasoning",
    prompt: `<span class="ph-sys">SYSTEM:</span> You are an expert analyst.
Think step-by-step before answering.
Wrap reasoning in &lt;thinking&gt; tags.

<span class="ph-user">USER:</span> A client has 3 contracts:
- Contract A: $120k, 60-day payment terms
- Contract B: $85k, 30-day terms, 2% early discount
- Contract C: $200k, 90-day terms

Which should be collected first to maximize
30-day cash flow?

<span class="ph-cmt">// Model reasons explicitly before answering</span>`,
    output: `<span class="ph-out">&lt;thinking&gt;</span>
Goal: maximize cash in 30 days.

Contract A: $120k but 60-day terms → not eligible
Contract B: $85k, 30-day terms → eligible
  Early pay discount = $85k × 2% = $1,700 savings
  Net if collected in 30 days = $85,000
Contract C: $200k, 90-day terms → not eligible

Only Contract B falls within the 30-day window.
<span class="ph-out">&lt;/thinking&gt;</span>

Prioritize <span class="ph-out">Contract B ($85k)</span> — it's the
only one within 30-day terms. The 2% early
payment discount ($1,700) is a bonus incentive
to collect it aggressively.

Contracts A and C require separate follow-up
cadences for their respective term windows.`,
  },
  {
    label: "Few-Shot",
    badge: "In-Context Learning",
    prompt: `<span class="ph-sys">SYSTEM:</span> Classify contract risk level.

<span class="ph-cmt">// Examples condition the output format exactly</span>

Contract: "60-day net, no late penalties"
Risk: MEDIUM · Reason: delayed cash, no recourse

Contract: "Net-30, 1.5%/mo late fee, personal guarantee"
Risk: LOW · Reason: short terms + strong enforcement

Contract: "Payment at completion, no defined milestone"
Risk: HIGH · Reason: vague trigger, scope creep risk

<span class="ph-user">USER:</span> "Invoiced monthly, 90-day terms, arbitration
only in client's jurisdiction, no auto-renewal
cancellation clause."`,
    output: `Risk: <span class="ph-out">HIGH</span> · Reason: long payment cycle (90-day)
compounds cash risk; jurisdiction clause
limits legal recourse to client's venue;
missing auto-renewal protection creates
contract cliff exposure.

<span class="ph-cmt">// Model adopted the exact format from examples
// No hallucination — locked to 3-field output</span>`,
  },
  {
    label: "Structured Output",
    badge: "Production Design",
    prompt: `<span class="ph-sys">SYSTEM:</span> You are a contract parser.
ALWAYS return valid JSON matching this schema.
NEVER include prose outside the JSON.

Schema:
{
  "parties": [{"name": str, "role": str}],
  "effective_date": "YYYY-MM-DD | null",
  "expiry_date": "YYYY-MM-DD | null",
  "total_value": number | null,
  "currency": "ISO-4217 code | null",
  "auto_renews": boolean,
  "governing_law": str | null,
  "confidence": "high|medium|low"
}

<span class="ph-cmt">// Schema enforcement = zero format surprises</span>`,
    output: `{
  <span class="ph-out">"parties"</span>: [
    {"name": "Acme Corp", "role": "Client"},
    {"name": "TechPartner LLC", "role": "Vendor"}
  ],
  <span class="ph-out">"effective_date"</span>: "2024-02-01",
  <span class="ph-out">"expiry_date"</span>: "2025-01-31",
  <span class="ph-out">"total_value"</span>: 240000,
  <span class="ph-out">"currency"</span>: "USD",
  <span class="ph-out">"auto_renews"</span>: true,
  <span class="ph-out">"governing_law"</span>: "Delaware, USA",
  <span class="ph-out">"confidence"</span>: "high"
}`,
  },
  {
    label: "ReAct Agent",
    badge: "Agent Loop",
    prompt: `<span class="ph-sys">SYSTEM:</span> You have tools:
- search_web(query) → results
- calculator(expr) → number
- get_stock(ticker) → price data

Format strictly:
Thought: [what you need]
Action: tool_name(args)
Observation: [result]
... repeat until done ...
Final Answer: [answer]

<span class="ph-user">USER:</span> Is NVDA's market cap larger than
the GDP of the Netherlands ($1.1T)?`,
    output: `Thought: I need NVDA's current price and shares outstanding.
Action: <span class="ph-out">get_stock("NVDA")</span>
Observation: $875.40 · shares: 24.53B · mktcap: $21.5T

Thought: I have the market cap. Compare to $1.1T.
Action: <span class="ph-out">calculator("21500 > 1100")</span>
Observation: True

Final Answer: <span class="ph-out">Yes — by a large margin.</span>
NVDA's market cap (~$21.5T) is approximately
<span class="ph-out">19.5× larger</span> than the Netherlands' GDP ($1.1T).`,
  },
];

// ─── COMPETENCIES / STACK / ETC ──────────────────────────────────────────────
const COMPETENCIES = [
  { name: "Large Language Model Integration",     pct: 95, level: "Expert",    variant: "",       tags: ["Claude API", "OpenAI API", "Gemini", "Llama 3", "Mistral"] },
  { name: "Prompt Engineering & Chain-of-Thought", pct: 93, level: "Expert",   variant: "purple", tags: ["Zero-shot", "Few-shot", "CoT", "ReAct", "Tree-of-Thought"] },
  { name: "RAG Systems & Vector Search",           pct: 90, level: "Expert",    variant: "green",  tags: ["Pinecone", "ChromaDB", "pgvector", "Weaviate", "FAISS"] },
  { name: "AI Agent Development",                  pct: 88, level: "Advanced",  variant: "",       tags: ["LangChain Agents", "AutoGen", "CrewAI", "Tool Use", "Function Calling"] },
  { name: "Python / TypeScript for AI",            pct: 92, level: "Expert",    variant: "purple", tags: ["FastAPI", "Async/Await", "Pydantic", "Streaming", "Webhooks"] },
  { name: "Fine-tuning & Model Adaptation",        pct: 78, level: "Proficient",variant: "gold",   tags: ["LoRA", "QLoRA", "PEFT", "Hugging Face", "Unsloth"] },
  { name: "AI Infrastructure & MLOps",             pct: 82, level: "Advanced",  variant: "green",  tags: ["AWS Bedrock", "Azure OpenAI", "Docker", "CI/CD", "LangSmith"] },
  { name: "Multimodal AI (Vision + Language)",     pct: 75, level: "Proficient",variant: "gold",   tags: ["GPT-4V", "Claude Vision", "DALL-E 3", "Stable Diffusion", "CLIP"] },
];

const STACK_SECTIONS = [
  { category: "LLM Providers",              color: "",       items: ["Claude 3.5 / 4", "GPT-4o / o1", "Gemini 1.5 Pro", "Llama 3.1 / 3.3", "Mistral Large", "Command R+", "Deepseek R1"] },
  { category: "Frameworks & Orchestration", color: "purple", items: ["LangChain", "LlamaIndex", "AutoGen", "CrewAI", "Haystack", "Semantic Kernel", "LangGraph", "Phidata"] },
  { category: "Vector Stores & Search",     color: "green",  items: ["Pinecone", "ChromaDB", "Weaviate", "pgvector", "FAISS", "Qdrant", "Milvus", "Redis Vector"] },
  { category: "Cloud AI Platforms",         color: "gold",   items: ["AWS Bedrock", "Azure OpenAI Service", "GCP Vertex AI", "Hugging Face Inference", "Replicate", "Groq", "Together AI"] },
  { category: "Monitoring & Observability", color: "warn",   items: ["LangSmith", "Weights & Biases", "Arize AI", "Helicone", "Braintrust", "Phoenix / Arize", "OpenTelemetry"] },
  { category: "Dev & Deployment",           color: "",       items: ["Python 3.11+", "TypeScript / Node.js", "FastAPI", "Docker", "GitHub Actions", "Jupyter", "Pydantic", "Streamlit"] },
];

const ARCH_PATTERNS = [
  { icon: "🔍", title: "Retrieval-Augmented Generation", sub: "RAG Architecture",      color: "",       desc: "Connect LLMs to proprietary knowledge bases. Documents are chunked, embedded, stored in a vector DB, and retrieved at inference time — giving the model accurate, current context without retraining.", tags: ["Embeddings", "Chunking Strategy", "Semantic Search", "Re-ranking", "Hybrid Search"] },
  { icon: "🤖", title: "Autonomous AI Agents",           sub: "Agent Loops & Tool Use", color: "purple", desc: "LLMs that plan, act, observe, and iterate. Agents with well-defined tool sets, guardrails, and memory to execute multi-step tasks — from web research to code execution to API orchestration.", tags: ["ReAct Loop", "Function Calling", "Memory", "Tool Routing", "Multi-agent"] },
  { icon: "🧠", title: "Fine-tuning & RLHF",             sub: "Domain Adaptation",      color: "green",  desc: "When prompt engineering hits its ceiling, fine-tuning takes over. LoRA/QLoRA to adapt models for specialized tasks — domain-specific classification, style matching, and task performance gains.", tags: ["LoRA / QLoRA", "PEFT", "Instruction Tuning", "DPO", "Evaluation"] },
  { icon: "⛓️", title: "LLM Pipeline Chains",            sub: "Prompt Chaining",        color: "gold",   desc: "Complex tasks decomposed into deterministic chains — each step transforms the context before passing to the next. Observable, testable, and failure-resilient by design.", tags: ["Sequential Chains", "Map-Reduce", "Parallel Execution", "Fallbacks", "Streaming"] },
  { icon: "👁️", title: "Multimodal Systems",             sub: "Vision + Language",      color: "warn",   desc: "Systems that reason over text, images, and documents simultaneously. Document intelligence, visual Q&A, image-conditioned generation — bridging visual and textual understanding.", tags: ["GPT-4V", "Claude Vision", "Document AI", "OCR + LLM", "Image Generation"] },
  { icon: "🏗️", title: "AI-Powered Backend APIs",        sub: "Production AI Services", color: "purple", desc: "End-to-end FastAPI services wrapping LLM capabilities with streaming responses, rate limiting, auth, and observability. Built to production standards — not just notebooks.", tags: ["FastAPI", "Streaming SSE", "Auth / Rate Limit", "LangSmith", "Docker"] },
];

const AI_PROJECTS = [
  { type: "RAG System",       typeColor: "",       title: "AI Legal Research Assistant",   desc: "Production RAG over 50k+ legal documents. Attorneys query in natural language and receive cited, clause-level answers with source references — reducing research time from hours to minutes.", impact: [{ val: "87%", lbl: "Time Saved" }, { val: "50k+", lbl: "Docs Indexed" }, { val: "<2s", lbl: "P95 Latency" }], stack: ["Claude 3.5 Sonnet", "Pinecone", "LangChain", "Cohere Rerank", "FastAPI"], details: ["Hybrid search: dense embeddings (text-embedding-3-large) + BM25 scoring", "Query decomposition pipeline for compound legal questions", "Citation grounding — every answer traces to doc + page number", "RAGAS eval harness tracking faithfulness, precision, recall", "Multi-tenant architecture with per-org namespace isolation", "Streaming SSE responses for sub-3s perceived latency"] },
  { type: "AI Agent System",  typeColor: "purple", title: "Multi-Agent Dev Pipeline",      desc: "AutoGen-based system where a Planner decomposes features, a Coder writes implementation, a Reviewer critiques, and a Test agent validates — end-to-end from spec to PR.", impact: [{ val: "3×", lbl: "Velocity" }, { val: "92%", lbl: "Test Coverage" }, { val: "5", lbl: "Agents" }], stack: ["AutoGen", "GPT-4o", "Claude", "GitHub API", "Docker"], details: ["Planner agent breaks user stories into atomic, verifiable sub-tasks", "Coder agent writes implementation with inline documentation", "Critic agent reviews for correctness, security, style compliance", "Test agent generates and runs pytest suites against implementation", "Async parallel execution where task dependencies allow", "Orchestrator tracks agent state and handles handoff failures"] },
  { type: "LLM Application",  typeColor: "green",  title: "Intelligent Document Processor", desc: "Enterprise pipeline classifying, extracting structured data, and routing documents through approval workflows — handling contracts, invoices, and compliance forms with >95% accuracy.", impact: [{ val: "95%+", lbl: "Accuracy" }, { val: "10k+", lbl: "Docs/Month" }, { val: "0", lbl: "Manual Entry" }], stack: ["Claude Vision", "Azure Form Recognizer", "Pydantic", "FastAPI", "PostgreSQL"], details: ["Multi-stage pipeline: OCR → layout parsing → LLM extraction → validation", "Structured output with Pydantic models for guaranteed schema compliance", "Human-in-the-loop escalation for low-confidence extractions", "Audit trail with confidence scores on every extracted field", "Async batch processing with dead letter queue for failures", "A/B testing framework comparing model versions on accuracy"] },
  { type: "Conversational AI", typeColor: "gold",  title: "Contextual Support Chatbot",    desc: "Customer support AI with persistent memory, escalation detection, and KB integration. Handles Tier 1 tickets end-to-end while handing off complex cases with full conversation context.", impact: [{ val: "68%", lbl: "Auto-Resolved" }, { val: "4.7★", lbl: "CSAT" }, { val: "<1s", lbl: "First Response" }], stack: ["Claude 3.5", "LangChain Memory", "Pinecone", "Twilio", "Node.js"], details: ["Conversation summarization to compress long threads into context window", "Intent classification routing between FAQ, account actions, escalation", "Sentiment analysis with auto-escalation on frustrated users", "Tool calling to query live account data, order status, inventory", "Full conversation handoff to human agents with summarized context", "A/B tested system prompts against CSAT and resolution rate metrics"] },
];

const PHILOSOPHIES = [
  { num: "01", color: "",       title: "Production Over Demos",      text: "A RAG system that works in Jupyter is not a RAG system. I build for latency, failure modes, observability, and scale from day one — not as an afterthought." },
  { num: "02", color: "purple", title: "Measure Everything",         text: "LLM behavior is probabilistic. Without evals, you're flying blind. I establish baseline metrics, regression suites, and eval pipelines before shipping any AI feature." },
  { num: "03", color: "green",  title: "Responsible by Design",      text: "Guardrails, content filtering, audit logging, and human escalation paths are requirements — not features. AI safety is an engineering constraint, not a marketing checkbox." },
  { num: "04", color: "gold",   title: "Model-Agnostic Architecture", text: "Provider lock-in is a liability. I design abstraction layers that let teams swap Claude for GPT-4o for Llama without touching business logic — keeping optionality as models improve." },
];

// ─── HERO TERMINAL ────────────────────────────────────────────────────────────
const T_LINES = [
  { text: "$ python ai_engineer.py --mode=init",          cls: "ai-t-prompt" },
  { text: "# Initializing production AI stack...",        cls: "ai-t-comment" },
  { text: "model      = Claude('claude-sonnet-4-6')",     cls: "ai-t-cyan" },
  { text: "embeddings = OpenAIEmbeddings('te-3-large')",  cls: "ai-t-purple" },
  { text: "vectordb   = Pinecone.from_index('prod-v2')",  cls: "ai-t-cyan" },
  { text: "chain      = RAGChain(model, vectordb)",       cls: "ai-t-str" },
  { text: "",                                              cls: "" },
  { text: "# Running eval suite...",                      cls: "ai-t-comment" },
  { text: "✓ Retrieval precision:  0.94",                 cls: "ai-t-str" },
  { text: "✓ Answer faithfulness:  0.91",                 cls: "ai-t-str" },
  { text: "✓ Latency P95:         1.8s",                  cls: "ai-t-gold" },
  { text: "✓ Guardrails:          PASS",                  cls: "ai-t-str" },
  { text: "",                                              cls: "" },
  { text: "→ System: PRODUCTION READY",                   cls: "ai-t-cyan" },
];

function HeroTerminal() {
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let i = 0;
    const tick = () => {
      if (i < T_LINES.length) {
        i++;
        setShown(i);
        setTimeout(tick, 175);
      }
    };
    setTimeout(tick, 500);
  }, []);

  return (
    <div className="ai-terminal">
      <div className="ai-terminal-bar">
        <div className="ai-t-dot" /><div className="ai-t-dot" /><div className="ai-t-dot" />
        <span className="ai-terminal-title">ai_engineer.py — python3</span>
      </div>
      <div className="ai-terminal-body">
        {T_LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={`ai-tl ${l.cls}`}>{l.text}</div>
        ))}
        {shown <= T_LINES.length && <span className="ai-cursor" />}
      </div>
    </div>
  );
}

// ─── LIVE DEMO CHAT ───────────────────────────────────────────────────────────
function LiveChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Select a scenario above or type your own AI engineering question. I'll respond with a technical, production-focused answer — the same way I'd answer in a real engineering context.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [running, setRunning] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [stats, setStats] = useState({ tokens: 0, ms: 0, model: "claude-sonnet-4-6" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { stream, cancel } = useStreamer();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, thinking, scrollToBottom]);

  const runScenario = useCallback((scenario: Scenario) => {
    if (running) { cancel(); }
    setActiveScenario(scenario.id);
    setRunning(true);
    setThinking(true);

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: scenario.userMsg };
    setMessages((prev) => [...prev, userMsg]);

    const thinkDelay = 800 + Math.random() * 600;
    setTimeout(() => {
      setThinking(false);
      const aiId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: aiId, role: "assistant", content: "", streaming: true }]);
      const start = Date.now();

      stream(
        scenario.response,
        (partial) => {
          setMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, content: partial } : m));
        },
        () => {
          const elapsed = Date.now() - start;
          setMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, streaming: false, tokens: scenario.tokens, ms: elapsed } : m));
          setStats({ tokens: scenario.tokens, ms: elapsed, model: "claude-sonnet-4-6" });
          setRunning(false);
        },
        9
      );
    }, thinkDelay);
  }, [running, cancel, stream]);

  const handleSend = useCallback(() => {
    if (!inputVal.trim() || running) return;
    const text = inputVal.trim();
    setInputVal("");

    // Find closest matching scenario or use a generic response
    const match = DEMO_SCENARIOS.find((s) =>
      text.toLowerCase().includes(s.id) ||
      s.userMsg.toLowerCase().slice(0, 30).split(" ").some((w) => text.toLowerCase().includes(w))
    ) || DEMO_SCENARIOS[0];

    runScenario({ ...match, userMsg: text });
  }, [inputVal, running, runScenario]);

  const handleStop = useCallback(() => {
    cancel();
    setRunning(false);
    setThinking(false);
    setMessages((prev) => prev.map((m) => m.streaming ? { ...m, streaming: false } : m));
  }, [cancel]);

  const formatContent = (content: string) => {
    // Convert markdown-style bold and code blocks to styled spans
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(0,210,255,0.1);border:1px solid rgba(0,210,255,0.2);padding:1px 5px;border-radius:2px;font-size:11px;color:#00D2FF">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
        `<div class="ai-msg-code-block"><span class="ai-code-lang">${lang || 'code'}</span><pre>${code.trim()}</pre></div>`
      )
      .split("\n").join("<br/>");
  };

  return (
    <div className="ai-chat-wrapper">
      {/* Top bar */}
      <div className="ai-chat-topbar">
        <div className="ai-chat-topbar-left">
          <div className="ai-chat-model-badge">claude-sonnet-4-6</div>
          <span style={{ fontSize: 10, color: "var(--ai-muted)", letterSpacing: 1 }}>
            INTERACTIVE DEMO
          </span>
        </div>
        <div className="ai-chat-mode-pills">
          {["RAG Systems", "Agent Debug", "Prompt Eng.", "Architecture"].map((m) => (
            <button key={m} className="ai-mode-pill">{m}</button>
          ))}
        </div>
      </div>

      {/* Scenario pills */}
      <div className="ai-scenarios-bar">
        <span className="ai-scenarios-label">Try:</span>
        {DEMO_SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`ai-scenario-btn ${activeScenario === s.id ? s.color : ""}`}
            onClick={() => !running && runScenario(s)}
            disabled={running}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-chat-msg ${msg.role}`}>
            <div className="ai-msg-avatar">
              {msg.role === "user" ? "YOU" : "AI"}
            </div>
            <div>
              <div
                className="ai-msg-bubble"
                dangerouslySetInnerHTML={{ __html: formatContent(msg.content) + (msg.streaming ? '<span class="ai-cursor" style="display:inline-block;width:6px;height:12px;background:var(--ai-cyan);animation:ai-blink 1s step-end infinite;vertical-align:text-bottom;margin-left:2px"></span>' : "") }}
              />
              {msg.tokens && !msg.streaming && (
                <div className="ai-msg-meta">
                  <span>{msg.tokens} tokens</span>
                  <span>·</span>
                  <span>{msg.ms}ms</span>
                  <span>·</span>
                  <span>claude-sonnet-4-6</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="ai-chat-msg assistant">
            <div className="ai-msg-avatar">AI</div>
            <div className="ai-thinking">
              <div className="ai-thinking-dots">
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
              </div>
              <span style={{ fontSize: 10, color: "var(--ai-muted)" }}>thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-chat-input-row">
        <textarea
          className="ai-chat-input"
          rows={2}
          placeholder="Ask an AI engineering question, or select a scenario above..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={running}
        />
        {running ? (
          <button className="ai-chat-send stop" onClick={handleStop}>■ Stop</button>
        ) : (
          <button className="ai-chat-send" onClick={handleSend} disabled={!inputVal.trim()}>
            Send ↵
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="ai-chat-statsbar">
        <div className="ai-chat-stat">Model: <span>{stats.model}</span></div>
        <div className="ai-chat-stat">Last response: <span>{stats.ms ? `${stats.ms}ms` : "—"}</span></div>
        <div className="ai-chat-stat">Tokens: <span>{stats.tokens || "—"}</span></div>
        <div className="ai-chat-stat">Mode: <span>Streaming SSE</span></div>
        <div className="ai-chat-stat">Guardrails: <span>Active</span></div>
      </div>
    </div>
  );
}

// ─── RAG PIPELINE VISUALIZER ─────────────────────────────────────────────────
function RAGVisualizer() {
  const [activeStage, setActiveStage] = useState(-1);
  const [doneUpTo, setDoneUpTo] = useState(-1);
  const [running, setRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const runPipeline = () => {
    if (running) return;
    clearTimers();
    setRunning(true);
    setShowResult(false);
    setActiveStage(-1);
    setDoneUpTo(-1);

    RAG_STAGES.forEach((_, i) => {
      const t1 = setTimeout(() => setActiveStage(i), i * 1100);
      const t2 = setTimeout(() => setDoneUpTo(i), i * 1100 + 900);
      timers.current.push(t1, t2);
    });

    const totalTime = RAG_STAGES.length * 1100 + 1000;
    const final = setTimeout(() => {
      setActiveStage(-1);
      setRunning(false);
      setShowResult(true);
    }, totalTime);
    timers.current.push(final);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <div className="ai-rag-container">
      <div className="ai-rag-topbar">
        <div className="ai-rag-title">RAG Pipeline — Live Execution Trace</div>
        <button className="ai-rag-run-btn" onClick={runPipeline} disabled={running}>
          {running ? "⟳ Executing..." : "▶ Execute Query"}
        </button>
      </div>
      <div className="ai-rag-query-bar">
        <span className="ai-rag-query-label">Query:</span>
        <div className="ai-rag-query-val">
          "What are the force majeure clauses in the IBM contract?"
        </div>
      </div>

      {/* Stages */}
      <div className="ai-pipeline-stages">
        {RAG_STAGES.map((stage, i) => {
          const isActive = activeStage === i;
          const isDone = doneUpTo >= i;
          const cls = isActive ? "active" : isDone ? "done" : "";
          return (
            <div key={stage.name} className="ai-pipe-stage-wrap">
              {i > 0 && (
                <div className={`ai-pipe-arrow ${isDone ? "lit" : ""}`}>→</div>
              )}
              <div className={`ai-pipe-stage ${cls}`}>
                <span className="ai-pipe-icon">{stage.icon}</span>
                <div className="ai-pipe-stage-num">STAGE {stage.num}</div>
                <div className="ai-pipe-stage-name">{stage.name}</div>
                <div className="ai-pipe-stage-data">
                  {isActive ? stage.activeData : isDone ? stage.doneData : stage.idleData}
                </div>
                {isActive && <div className="ai-pipe-spinner" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result */}
      <div className={`ai-rag-result ${showResult ? "visible" : ""}`}>
        <div className="ai-rag-result-label">{`// llm_response · citations_grounded`}</div>
        <div
          className="ai-rag-result-text"
          dangerouslySetInnerHTML={{ __html: RAG_RESULT.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
        />
        <div className="ai-rag-metrics">
          <div className="ai-rag-metric">Retrieval precision: <span>0.94</span></div>
          <div className="ai-rag-metric">Faithfulness: <span>0.91</span></div>
          <div className="ai-rag-metric">Total latency: <span>1.73s</span></div>
          <div className="ai-rag-metric">Cost: <span>$0.0031</span></div>
          <div className="ai-rag-metric">Citations: <span>3</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── AGENT LOOP SIMULATOR ─────────────────────────────────────────────────────
function AgentSimulator() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<AgentStep[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const runAgent = () => {
    if (running) return;
    clearTimers();
    setVisibleSteps([]);
    setRunning(true);

    const { steps } = AGENT_SCENARIOS[scenarioIdx];
    steps.forEach((step) => {
      const t = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step]);
      }, step.delayMs);
      timers.current.push(t);
    });

    const lastDelay = steps[steps.length - 1].delayMs + 400;
    const done = setTimeout(() => setRunning(false), lastDelay);
    timers.current.push(done);
  };

  useEffect(() => () => clearTimers(), []);

  const scenario = AGENT_SCENARIOS[scenarioIdx];

  return (
    <div className="ai-agent-container">
      <div className="ai-agent-topbar">
        <div className="ai-agent-title">ReAct Agent — Live Execution</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {AGENT_SCENARIOS.map((s, i) => (
            <button
              key={i}
              className={`ai-mode-pill ${scenarioIdx === i ? "active" : ""}`}
              onClick={() => { setScenarioIdx(i); setVisibleSteps([]); }}
              disabled={running}
            >
              {i === 0 ? "Finance Task" : "Job Research"}
            </button>
          ))}
          <button className="ai-agent-run-btn" onClick={runAgent} disabled={running}>
            {running ? "⟳ Agent running..." : "▶ Run Agent"}
          </button>
        </div>
      </div>

      {/* Tools */}
      <div className="ai-tool-presets">
        <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--ai-muted)" }}>
          Available Tools:
        </span>
        {scenario.tools.map((t) => (
          <span key={t} className="ai-tool-badge">{t}()</span>
        ))}
      </div>

      {/* Task */}
      <div className="ai-agent-task-bar">
        <span className="ai-rag-query-label">Task:</span>
        <div className="ai-rag-query-val" style={{ color: "var(--ai-text)" }}>
          {scenario.task}
        </div>
      </div>

      <div className="ai-agent-body">
        {visibleSteps.length === 0 && !running && (
          <div style={{ fontSize: 12, color: "var(--ai-muted)", paddingTop: 8 }}>
            Click "Run Agent" to watch the ReAct loop execute in real time.
          </div>
        )}
        <div className="ai-agent-steps">
          {visibleSteps.map((step, i) => (
            <div key={i} className={`ai-agent-step ${step.type}`}>
              <div className="ai-step-label">{step.label}</div>
              <div
                className="ai-step-content"
                dangerouslySetInnerHTML={{
                  __html: step.content
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          ))}
          {running && visibleSteps.length > 0 && (
            <div className="ai-agent-status">
              <div className="ai-thinking-dots">
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
                <div className="ai-thinking-dot" />
              </div>
              <span>Agent thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div>
      <div className="ai-s-label">{`// core_competencies`}</div>
      <div className="ai-s-title">What I Build With AI</div>
      <p className="ai-s-desc">Proficiency across the full AI engineering stack — from raw LLM integration to production systems with observability, evals, and guardrails.</p>
      <div className="ai-competencies">
        {COMPETENCIES.map((c) => (
          <div key={c.name} className="ai-comp">
            <div className="ai-comp-row">
              <span className="ai-comp-name">{c.name}</span>
              <span className="ai-comp-level">{c.level} · {c.pct}%</span>
            </div>
            <div className="ai-comp-track">
              <div className={`ai-comp-fill ${c.variant}`} style={{ width: `${c.pct}%` }} />
            </div>
            <div className="ai-comp-tags">
              {c.tags.map((t) => <span key={t} className="ai-comp-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-s-label">{`// philosophy.principles`}</div>
      <div className="ai-s-title">How I Approach AI Engineering</div>
      <p className="ai-s-desc">The principles separating maintainable AI systems from expensive technical debt.</p>
      <div className="ai-phil-grid">
        {PHILOSOPHIES.map((p) => (
          <div key={p.num} className="ai-phil-card" data-num={p.num}>
            <div className={`ai-phil-title ${p.color}`}>{p.title}</div>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoLabTab() {
  return (
    <div>
      {/* CHAT */}
      <div className="ai-s-label">{`// demo.interactive_chat`}</div>
      <div className="ai-s-title">Live AI Chat Demo</div>
      <p className="ai-s-desc">
        Select a pre-loaded AI engineering scenario or type your own question. Each response demonstrates how I approach real production problems — not textbook answers.
      </p>
      <LiveChatDemo />

      {/* RAG PIPELINE */}
      <div className="ai-demo-divider"><span className="ai-demo-divider-label">RAG Pipeline Visualizer</span></div>
      <div className="ai-s-label">{`// rag.execution_trace`}</div>
      <div className="ai-s-title">Retrieval-Augmented Generation — Live Trace</div>
      <p className="ai-s-desc">
        Click "Execute Query" to watch a production RAG pipeline run in real time — from query embedding through vector search, re-ranking, prompt assembly, and LLM generation with citations.
      </p>
      <RAGVisualizer />

      {/* AGENT LOOP */}
      <div className="ai-demo-divider"><span className="ai-demo-divider-label">ReAct Agent Simulator</span></div>
      <div className="ai-s-label">{`// agent.react_loop`}</div>
      <div className="ai-s-title">Autonomous Agent — ReAct Loop</div>
      <p className="ai-s-desc">
        Watch an AI agent plan, select tools, execute them, observe results, and iterate — the complete ReAct (Reasoning + Acting) loop that powers production agentic systems.
      </p>
      <AgentSimulator />
    </div>
  );
}

function ProjectsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <div className="ai-s-label">{`// ai_projects.showcase`}</div>
      <div className="ai-s-title">AI Systems I've Built</div>
      <p className="ai-s-desc">Production-grade AI applications with measurable impact. Expand each card to see the implementation details.</p>
      <div className="ai-proj-grid">
        {AI_PROJECTS.map((p) => (
          <div key={p.title} className={`ai-proj-card ${expanded === p.title ? "expanded" : ""}`}>
            <div className="ai-proj-head">
              <div className={`ai-proj-type ${p.typeColor}`}>{p.type}</div>
              <div className="ai-proj-name">{p.title}</div>
              <p className="ai-proj-desc">{p.desc}</p>
              <div className="ai-proj-impact">
                {p.impact.map((imp) => (
                  <div key={imp.lbl}>
                    <span className="ai-impact-val">{imp.val}</span>
                    <span className="ai-impact-lbl">{imp.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ai-proj-stack">
              {p.stack.map((s) => <span key={s} className="ai-proj-chip">{s}</span>)}
            </div>
            <button
              className="ai-proj-expand"
              onClick={() => setExpanded(expanded === p.title ? null : p.title)}
            >
              {expanded === p.title ? "▲ hide details" : "▼ show technical details"}
            </button>
            <div className="ai-proj-detail">
              <div className="ai-detail-lbl">{`// implementation`}</div>
              <ul className="ai-detail-list">
                {p.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
              {p.title === "AI Legal Research Assistant" && (
                <a
                  href="/case-study/ai-legal-research"
                  style={{
                    display: "inline-block",
                    marginTop: "16px",
                    backgroundColor: "rgba(0,210,255,0.1)",
                    color: "#00D2FF",
                    border: "1px solid rgba(0,210,255,0.4)",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Read Full Case Study →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptLabTab() {
  const [active, setActive] = useState(0);
  const cur = PROMPT_TECHNIQUES[active];
  return (
    <div>
      <div className="ai-s-label">{`// prompt_engineering.lab`}</div>
      <div className="ai-s-title">Prompt Engineering Techniques</div>
      <p className="ai-s-desc">
        Prompt engineering is the fastest lever for improving output quality without touching weights. Each technique below shows the design pattern alongside the model's output — the same patterns I apply in production.
      </p>
      <div className="ai-prompt-tabs">
        {PROMPT_TECHNIQUES.map((t, i) => (
          <button
            key={t.label}
            className={`ai-ptab-btn ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="ai-prompt-panel">
        <div className="ai-prompt-split">
          <div className="ai-prompt-side">
            <div className="ai-prompt-side-lbl">Prompt Design</div>
            <div className="ai-technique-badge">{cur.badge}</div>
            <pre className="ai-prompt-code" dangerouslySetInnerHTML={{ __html: cur.prompt }} />
          </div>
          <div className="ai-prompt-side">
            <div className="ai-prompt-side-lbl">Model Output</div>
            <pre className="ai-prompt-code" dangerouslySetInnerHTML={{ __html: cur.output }} />
          </div>
        </div>
      </div>

      <div className="ai-s-label">{`// credentials.ai_specific`}</div>
      <div className="ai-s-title">AI Credentials &amp; Training</div>
      <p className="ai-s-desc">Formal training and certifications across AI engineering, applied LLMs, and ML infrastructure.</p>
      <div className="ai-certs-grid">
        {[
          { icon: "🎓", name: "LangChain for LLM App Development",    issuer: "DeepLearning.AI",        desc: "Chains, agents, memory, RAG, and evaluation with LangChain." },
          { icon: "🤖", name: "Anthropic Prompt Engineering Cert.",    issuer: "Anthropic",              desc: "Advanced prompting, constitutional AI, and Claude API integration." },
          { icon: "🔗", name: "Building Systems with ChatGPT API",     issuer: "DeepLearning.AI / OpenAI", desc: "Multi-step reasoning pipelines, classification, and evaluation." },
          { icon: "📊", name: "MLOps Specialization",                  issuer: "DeepLearning.AI",        desc: "Model deployment, monitoring, drift detection, and CI/CD for ML." },
          { icon: "🧮", name: "Hugging Face NLP Course",               issuer: "Hugging Face",           desc: "Transformers, fine-tuning with PEFT, and Inference API deployment." },
          { icon: "☁️", name: "AWS Certified ML — Specialty",          issuer: "Amazon Web Services",    desc: "SageMaker, Bedrock, data engineering, and production ML on AWS." },
        ].map((c) => (
          <div key={c.name} className="ai-cert-card">
            <span className="ai-cert-icon">{c.icon}</span>
            <div>
              <div className="ai-cert-name">{c.name}</div>
              <div className="ai-cert-issuer">{c.issuer}</div>
              <p className="ai-cert-desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackTab() {
  return (
    <div>
      <div className="ai-s-label">{`// tech_stack.full_inventory`}</div>
      <div className="ai-s-title">AI Engineering Stack</div>
      <p className="ai-s-desc">Every tool chosen for a reason — from cloud inference endpoints to local embedding pipelines to production observability dashboards.</p>
      <div className="ai-stack-grid">
        {STACK_SECTIONS.map((s) => (
          <div key={s.category} className="ai-stack-card">
            <div className={`ai-stack-cat ${s.color}`}>⬡ {s.category}</div>
            <div className="ai-stack-items">
              {s.items.map((item) => (
                <div key={item} className="ai-stack-chip">
                  <span className="ai-stack-chip-dot" />{item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-s-label">{`// architecture.patterns`}</div>
      <div className="ai-s-title">Architecture Patterns I Design</div>
      <p className="ai-s-desc">The system patterns I reach for most — each with clear tradeoffs, appropriate use cases, and production-hardening considerations.</p>
      <div className="ai-arch-grid">
        {ARCH_PATTERNS.map((p) => (
          <div key={p.title} className="ai-arch-card">
            <span className="ai-arch-icon">{p.icon}</span>
            <div className="ai-arch-title">{p.title}</div>
            <div className={`ai-arch-sub ${p.color}`}>{p.sub}</div>
            <p className="ai-arch-desc">{p.desc}</p>
            <div className="ai-arch-tags">
              {p.tags.map((t) => <span key={t} className="ai-arch-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AIEngineerPortfolio() {
  const [tab, setTab] = useState(0);

  const tabs = [
    { label: "Overview",      num: "01" },
    { label: "Demo Lab",      num: "02" },
    { label: "Projects",      num: "03" },
    { label: "Prompt Lab",    num: "04" },
    { label: "Stack",         num: "05" },
  ];

  return (
    <div className="ai-portfolio">
      {/* HERO */}
      <div className="ai-hero">
        <div className="ai-hero-grid" />
        <div className="ai-hero-inner">
          <div>
            <div className="ai-status-row">
              <div className="ai-status-badge"><span className="ai-dot" />Available for AI roles</div>
              <div className="ai-status-badge purple"><span className="ai-dot" />Claude · OpenAI · Gemini</div>
              <div className="ai-status-badge green"><span className="ai-dot" />RAG · Agents · Fine-tuning</div>
            </div>
            <h1>
              <span className="ai-c-cyan">AI</span> <span className="ai-c-purple">Engineer</span>
              <br />
              <span className="ai-c-green">Portfolio</span>
            </h1>
            <p className="ai-hero-sub">
              I build <strong>production AI systems</strong> — RAG pipelines, autonomous agents,
              fine-tuned models, and LLM-powered APIs that solve <strong>real business problems</strong> at scale.
              <br /><br />
              Not prototype demos. Not Jupyter notebooks.{" "}
              <strong>Shipped, measured, production-ready AI.</strong>
            </p>
            <div className="ai-hero-stats">
              {[
                { val: "4+",  lbl: "Years AI/ML" },
                { val: "12+", lbl: "LLM APIs" },
                { val: "8+",  lbl: "Prod AI Systems" },
                { val: "95%", lbl: "Avg Eval Score" },
              ].map((s) => (
                <div key={s.lbl}>
                  <span className="ai-hero-stat-val">{s.val}</span>
                  <span className="ai-hero-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroTerminal />
        </div>
      </div>

      {/* TABS */}
      <div className="ai-tabs-bar">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            className={`ai-tab-btn ${tab === i ? "active" : ""}`}
            onClick={() => setTab(i)}
          >
            <span className="ai-tab-num">{t.num}.</span>{t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="ai-tab-content" key={tab}>
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <DemoLabTab />}
        {tab === 2 && <ProjectsTab />}
        {tab === 3 && <PromptLabTab />}
        {tab === 4 && <StackTab />}
      </div>

      {/* FOOTER */}
      <div className="ai-footer">
        <span className="ai-footer-copy">
          © {new Date().getFullYear()} · AI Engineer Portfolio · Built for production.
        </span>
        <div className="ai-footer-stack">
          <span className="on">✓ Claude API</span>
          <span>·</span>
          <span className="on">✓ RAG Systems</span>
          <span>·</span>
          <span className="on">✓ AI Agents</span>
          <span>·</span>
          <span className="on">✓ Prompt Engineering</span>
          <span>·</span>
          <span>React + FastAPI</span>
        </div>
      </div>
    </div>
  );
}
