import React, { useState, useEffect, useRef } from "react";
import "./AIEngineerPortfolio.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const COMPETENCIES = [
  {
    name: "Large Language Model Integration",
    pct: 95,
    level: "Expert",
    variant: "",
    tags: ["Claude API", "OpenAI API", "Gemini", "Llama 3", "Mistral"],
  },
  {
    name: "Prompt Engineering & Chain-of-Thought",
    pct: 93,
    level: "Expert",
    variant: "purple",
    tags: ["Zero-shot", "Few-shot", "CoT", "ReAct", "Tree-of-Thought"],
  },
  {
    name: "RAG Systems & Vector Search",
    pct: 90,
    level: "Expert",
    variant: "green",
    tags: ["Pinecone", "ChromaDB", "pgvector", "Weaviate", "FAISS"],
  },
  {
    name: "AI Agent Development",
    pct: 88,
    level: "Advanced",
    variant: "",
    tags: ["LangChain Agents", "AutoGen", "CrewAI", "Tool Use", "Function Calling"],
  },
  {
    name: "Python / TypeScript for AI",
    pct: 92,
    level: "Expert",
    variant: "purple",
    tags: ["FastAPI", "Async/Await", "Pydantic", "Streaming", "Webhooks"],
  },
  {
    name: "Fine-tuning & Model Adaptation",
    pct: 78,
    level: "Proficient",
    variant: "gold",
    tags: ["LoRA", "QLoRA", "PEFT", "Hugging Face", "Unsloth"],
  },
  {
    name: "AI Infrastructure & MLOps",
    pct: 82,
    level: "Advanced",
    variant: "green",
    tags: ["AWS Bedrock", "Azure OpenAI", "Docker", "CI/CD", "LangSmith"],
  },
  {
    name: "Multimodal AI (Vision + Language)",
    pct: 75,
    level: "Proficient",
    variant: "gold",
    tags: ["GPT-4V", "Claude Vision", "DALL-E 3", "Stable Diffusion", "CLIP"],
  },
];

const STACK_SECTIONS = [
  {
    category: "LLM Providers",
    color: "",
    items: [
      "Claude 3.5 / 4", "GPT-4o / o1", "Gemini 1.5 Pro", "Llama 3.1 / 3.3",
      "Mistral Large", "Command R+", "Deepseek R1",
    ],
  },
  {
    category: "Frameworks & Orchestration",
    color: "purple",
    items: [
      "LangChain", "LlamaIndex", "AutoGen", "CrewAI", "Haystack",
      "Semantic Kernel", "LangGraph", "Phidata",
    ],
  },
  {
    category: "Vector Stores & Search",
    color: "green",
    items: [
      "Pinecone", "ChromaDB", "Weaviate", "pgvector", "FAISS",
      "Qdrant", "Milvus", "Redis Vector",
    ],
  },
  {
    category: "Cloud AI Platforms",
    color: "gold",
    items: [
      "AWS Bedrock", "Azure OpenAI Service", "GCP Vertex AI",
      "Hugging Face Inference", "Replicate", "Groq", "Together AI",
    ],
  },
  {
    category: "Monitoring & Observability",
    color: "warn",
    items: [
      "LangSmith", "Weights & Biases", "Arize AI", "Helicone",
      "Braintrust", "Phoenix / Arize", "OpenTelemetry",
    ],
  },
  {
    category: "Dev & Deployment",
    color: "",
    items: [
      "Python 3.11+", "TypeScript / Node.js", "FastAPI", "Docker",
      "GitHub Actions", "Jupyter", "Pydantic", "Streamlit",
    ],
  },
];

const ARCH_PATTERNS = [
  {
    icon: "🔍",
    title: "Retrieval-Augmented Generation",
    subtitle: "RAG Architecture",
    color: "",
    desc: "Connect LLMs to proprietary knowledge bases. Documents are chunked, embedded, stored in a vector DB, and retrieved at inference time — giving the model accurate, up-to-date context without retraining.",
    tags: ["Embeddings", "Chunking Strategy", "Semantic Search", "Re-ranking", "Hybrid Search"],
  },
  {
    icon: "🤖",
    title: "Autonomous AI Agents",
    subtitle: "Agent Loops & Tool Use",
    color: "purple",
    desc: "LLMs that plan, act, observe, and iterate. I build agents with well-defined tool sets, guardrails, and memory to execute multi-step tasks — from web research to code execution to API orchestration.",
    tags: ["ReAct Loop", "Function Calling", "Memory", "Tool Routing", "Multi-agent"],
  },
  {
    icon: "🧠",
    title: "Fine-tuning & RLHF",
    subtitle: "Domain Adaptation",
    color: "green",
    desc: "When prompt engineering hits its ceiling, fine-tuning takes over. I apply LoRA/QLoRA to adapt models for specialized tasks — from domain-specific classification to style matching.",
    tags: ["LoRA / QLoRA", "PEFT", "Instruction Tuning", "DPO", "Evaluation"],
  },
  {
    icon: "⛓️",
    title: "LLM Pipeline Chains",
    subtitle: "Prompt Chaining",
    color: "gold",
    desc: "Complex tasks decomposed into deterministic chains — each step transforms the context before passing to the next. I design chains that are observable, testable, and failure-resilient.",
    tags: ["Sequential Chains", "Map-Reduce", "Parallel Execution", "Fallbacks", "Streaming"],
  },
  {
    icon: "👁️",
    title: "Multimodal Systems",
    subtitle: "Vision + Language",
    color: "warn",
    desc: "Systems that reason over text, images, and documents simultaneously. Document intelligence, visual Q&A, image-conditioned generation — bridging the gap between visual and textual understanding.",
    tags: ["GPT-4V", "Claude Vision", "Document AI", "OCR + LLM", "Image Generation"],
  },
  {
    icon: "🏗️",
    title: "AI-Powered Backend APIs",
    subtitle: "Production AI Services",
    color: "purple",
    desc: "End-to-end FastAPI services wrapping LLM capabilities with streaming responses, rate limiting, auth, and observability. Built to production standards — not just Jupyter notebooks.",
    tags: ["FastAPI", "Streaming SSE", "Auth / Rate Limit", "LangSmith", "Docker"],
  },
];

interface AiProject {
  type: string;
  typeColor: string;
  title: string;
  desc: string;
  impact: { val: string; label: string }[];
  stack: string[];
  details: string[];
}

const AI_PROJECTS: AiProject[] = [
  {
    type: "RAG System",
    typeColor: "",
    title: "AI Legal Research Assistant",
    desc: "Production RAG system over 50k+ legal documents. Attorneys query in natural language and receive cited, clause-level answers with source references — reducing research time from hours to minutes.",
    impact: [
      { val: "87%", label: "Time Saved" },
      { val: "50k+", label: "Docs Indexed" },
      { val: "< 2s", label: "P95 Latency" },
    ],
    stack: ["Claude 3.5 Sonnet", "Pinecone", "LangChain", "FastAPI", "React"],
    details: [
      "Hybrid search combining dense embeddings (text-embedding-3-large) + BM25 keyword scoring",
      "Query decomposition pipeline to handle compound legal questions",
      "Citation grounding — every answer traces to specific document + page",
      "Streaming SSE responses for responsive UX",
      "Evaluation harness with RAGAS metrics tracking retrieval quality",
      "Multi-tenant architecture with per-org document isolation",
    ],
  },
  {
    type: "AI Agent System",
    typeColor: "purple",
    title: "Multi-Agent Dev Pipeline",
    desc: "AutoGen-based multi-agent system where a Planner agent decomposes features, a Coder agent writes implementation, a Reviewer agent critiques, and a Test agent validates — end-to-end from spec to PR.",
    impact: [
      { val: "3×", label: "Velocity Increase" },
      { val: "92%", label: "Test Coverage" },
      { val: "5", label: "Agents Coordinated" },
    ],
    stack: ["AutoGen", "GPT-4o", "Claude", "GitHub API", "Docker"],
    details: [
      "Planner agent breaks user stories into atomic, verifiable sub-tasks",
      "Coder agent writes implementation with inline documentation",
      "Critic agent reviews for correctness, security, and style compliance",
      "Test agent generates and runs pytest suites against implementation",
      "Orchestrator tracks agent state and handles handoff failures",
      "Async parallel execution where task dependencies allow",
    ],
  },
  {
    type: "LLM Application",
    typeColor: "green",
    title: "Intelligent Document Processor",
    desc: "Enterprise document processing system that classifies, extracts structured data, and routes documents through approval workflows — handling contracts, invoices, and compliance forms with >95% accuracy.",
    impact: [
      { val: "95%+", label: "Extraction Accuracy" },
      { val: "10k+", label: "Docs / Month" },
      { val: "0", label: "Manual Entry" },
    ],
    stack: ["Claude Vision", "Azure Form Recognizer", "Pydantic", "FastAPI", "PostgreSQL"],
    details: [
      "Multi-stage pipeline: OCR → layout parsing → LLM extraction → validation",
      "Structured output with Pydantic models for guaranteed schema compliance",
      "Human-in-the-loop escalation for low-confidence extractions",
      "Audit trail with confidence scores on every extracted field",
      "Async batch processing with dead letter queue for failures",
      "A/B testing framework comparing model versions on accuracy metrics",
    ],
  },
  {
    type: "Conversational AI",
    typeColor: "gold",
    title: "Contextual Support Chatbot",
    desc: "Customer support AI with persistent memory, escalation detection, and knowledge base integration. Handles Tier 1 tickets end-to-end while seamlessly handing off complex cases to human agents with full context.",
    impact: [
      { val: "68%", label: "Auto-Resolved" },
      { val: "4.7★", label: "Satisfaction" },
      { val: "< 1s", label: "First Response" },
    ],
    stack: ["Claude 3.5", "LangChain Memory", "Pinecone", "Twilio", "Node.js"],
    details: [
      "Conversation summarization to compress long thread history into context window",
      "Intent classification routing between FAQ, account actions, and escalation",
      "Sentiment analysis with automatic escalation on frustrated users",
      "Tool calling to query live account data, order status, and inventory",
      "Full conversation handoff to human agents with summarized context",
      "A/B tested system prompts against CSAT and resolution rate metrics",
    ],
  },
];

const PROMPT_TECHNIQUES = [
  {
    label: "Chain-of-Thought",
    badge: "Reasoning",
    prompt: `<span class="ai-ph-system">SYSTEM:</span> You are an expert analyst. When answering,
think step-by-step before giving your final answer.
Wrap your reasoning in <thinking> tags.

<span class="ai-ph-user">USER:</span> A train leaves City A at 9am traveling
60mph. Another leaves City B (240 miles away)
at 10am traveling 80mph. When do they meet?

<span class="ai-ph-comment">// Model reasons through the problem explicitly,
// showing intermediate steps before final answer</span>`,
    output: `<span class="ai-ph-output">&lt;thinking&gt;</span>
Train A: departs 9am @ 60mph
Train B: departs 10am @ 80mph, 240mi gap

At 10am, Train A has traveled 60mi → gap = 180mi
Combined closure rate = 60 + 80 = 140mph
Time to meet = 180 / 140 = 1.286 hrs = 1h 17m
Meet time = 10am + 1h17m = <span class="ai-ph-output">11:17am</span>
<span class="ai-ph-output">&lt;/thinking&gt;</span>

The trains meet at <span class="ai-ph-output">11:17 AM</span>.`,
  },
  {
    label: "Few-Shot",
    badge: "In-Context Learning",
    prompt: `<span class="ai-ph-system">SYSTEM:</span> Classify customer intent.

<span class="ai-ph-comment">// Examples condition the model's output format</span>

Input: "my order hasn't arrived" → SHIPPING_ISSUE
Input: "I want a refund"        → REFUND_REQUEST
Input: "how do I cancel?"       → CANCELLATION
Input: "app keeps crashing"     → TECHNICAL_ISSUE

<span class="ai-ph-user">USER:</span> "I was charged twice for my order"`,
    output: `<span class="ai-ph-output">BILLING_DISPUTE</span>

<span class="ai-ph-comment">// Model learned format from examples
// Returns exact category string, no fluff
// Zero hallucination — format is locked in</span>`,
  },
  {
    label: "System Prompt Architecture",
    badge: "Production Design",
    prompt: `<span class="ai-ph-system">SYSTEM:</span>
## Role
You are a senior code reviewer for a fintech API.

## Rules (NEVER violate)
- Flag any SQL without parameterized queries
- Flag hardcoded secrets or credentials
- Flag missing input validation on user data

## Output Format
<span class="ai-ph-comment">// Structured XML for reliable parsing</span>
&lt;review&gt;
  &lt;severity&gt;CRITICAL|HIGH|MED|LOW&lt;/severity&gt;
  &lt;issues&gt;[list]&lt;/issues&gt;
  &lt;fixed_code&gt;[corrected snippet]&lt;/fixed_code&gt;
&lt;/review&gt;`,
    output: `<span class="ai-ph-output">&lt;review&gt;</span>
  <span class="ai-ph-output">&lt;severity&gt;</span>CRITICAL<span class="ai-ph-output">&lt;/severity&gt;</span>
  <span class="ai-ph-output">&lt;issues&gt;</span>
    - SQL injection: string interpolation in query
    - Hardcoded API key on line 14
    - No validation on user_id param
  <span class="ai-ph-output">&lt;/issues&gt;</span>
  <span class="ai-ph-output">&lt;fixed_code&gt;</span>
    cursor.execute(SQL, (user_id,))  # parameterized
  <span class="ai-ph-output">&lt;/fixed_code&gt;</span>
<span class="ai-ph-output">&lt;/review&gt;</span>`,
  },
  {
    label: "ReAct Agent",
    badge: "Agent Pattern",
    prompt: `<span class="ai-ph-system">SYSTEM:</span> You have these tools:
- search(query) → web results
- calculator(expr) → numeric result
- get_stock(ticker) → price data

Use format:
Thought: [what you need to do]
Action: tool_name(args)
Observation: [tool result]
... repeat ...
Answer: [final answer]

<span class="ai-ph-user">USER:</span> What's Apple's market cap if
their stock is up 3% today?`,
    output: `Thought: I need Apple's current stock price
Action: <span class="ai-ph-output">get_stock("AAPL")</span>
Observation: AAPL = $211.50, shares = 15.3B

Thought: Price up 3%, so yesterday = 211.50/1.03
Action: <span class="ai-ph-output">calculator("211.50 * 15.3B")</span>
Observation: $3.236 Trillion

Answer: Apple's market cap is <span class="ai-ph-output">~$3.24T</span>`,
  },
];

const PHILOSOPHIES = [
  {
    num: "01",
    color: "",
    title: "Production Over Demos",
    text: "A RAG system that works in a Jupyter notebook is not a RAG system. I build for latency, failure modes, observability, and scale from day one — not as an afterthought.",
  },
  {
    num: "02",
    color: "purple",
    title: "Measure Everything",
    text: "LLM behavior is probabilistic. Without evals, you're flying blind. I establish baseline metrics, regression suites, and continuous evaluation pipelines before shipping any AI feature.",
  },
  {
    num: "03",
    color: "green",
    title: "Responsible by Design",
    text: "Guardrails, content filtering, audit logging, and human escalation paths are not features — they're requirements. I treat AI safety as an engineering constraint, not a marketing checkbox.",
  },
  {
    num: "04",
    color: "gold",
    title: "Model-Agnostic Architecture",
    text: "Provider lock-in is a liability. I design abstraction layers that let teams swap Claude for GPT-4o for Llama without touching business logic — keeping optionality as models improve monthly.",
  },
];

// ─── ANIMATED TERMINAL ───────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { text: "$ python ai_engineer.py --mode=init", cls: "ai-t-prompt" },
  { text: "# Loading AI capabilities...", cls: "ai-t-comment" },
  { text: 'model = Claude("claude-sonnet-4-6")', cls: "ai-t-cyan" },
  { text: 'embeddings = OpenAIEmbeddings()', cls: "ai-t-purple" },
  { text: 'vectorstore = Pinecone.from_index("prod")', cls: "ai-t-cyan" },
  { text: 'chain = RAGChain(model, vectorstore)', cls: "ai-t-string" },
  { text: "", cls: "" },
  { text: "# Running eval suite...", cls: "ai-t-comment" },
  { text: "✓ Retrieval precision:  0.94", cls: "ai-t-string" },
  { text: "✓ Answer faithfulness:  0.91", cls: "ai-t-string" },
  { text: "✓ Latency P95:         1.8s", cls: "ai-t-gold" },
  { text: "✓ All guardrails:       PASS", cls: "ai-t-string" },
  { text: "", cls: "" },
  { text: "→ System ready. Status: PRODUCTION", cls: "ai-t-cyan" },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    let i = 0;
    const tick = () => {
      if (i < TERMINAL_LINES.length) {
        i++;
        setVisibleLines(i);
        setTimeout(tick, i === 0 ? 400 : 180);
      }
    };
    setTimeout(tick, 600);
  }, []);

  return (
    <div className="ai-terminal">
      <div className="ai-terminal-bar">
        <div className="ai-terminal-dot" />
        <div className="ai-terminal-dot" />
        <div className="ai-terminal-dot" />
        <span className="ai-terminal-title">ai_engineer.py — python3</span>
      </div>
      <div className="ai-terminal-body">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`ai-terminal-line ${line.cls}`}>
            {line.text}
          </div>
        ))}
        {visibleLines <= TERMINAL_LINES.length && (
          <span className="ai-cursor" />
        )}
      </div>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: AiProject }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`ai-project-card ${expanded ? "expanded" : ""}`}>
      <div className="ai-project-header">
        <div className={`ai-project-type ${project.typeColor}`}>{project.type}</div>
        <div className="ai-project-title">{project.title}</div>
        <p className="ai-project-desc">{project.desc}</p>
        <div className="ai-project-impact">
          {project.impact.map((imp) => (
            <div key={imp.label}>
              <span className="ai-impact-stat">{imp.val}</span>
              <span className="ai-impact-label">{imp.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ai-project-stack">
        {project.stack.map((s) => (
          <span key={s} className="ai-project-stack-tag">{s}</span>
        ))}
      </div>
      <button
        className="ai-project-expand-btn"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? "▲ hide technical details" : "▼ show technical details"}
      </button>
      <div className="ai-project-detail">
        <div className="ai-project-detail-title">// implementation details</div>
        <ul className="ai-detail-list">
          {project.details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <div className="ai-section-label">// core_competencies.map()</div>
      <div className="ai-section-title">What I Build With AI</div>
      <p className="ai-section-desc">
        Proficiency across the full AI engineering stack — from raw LLM integration to production-grade systems with observability, evals, and guardrails.
      </p>
      <div className="ai-competencies">
        {COMPETENCIES.map((c) => (
          <div key={c.name} className="ai-competency-item">
            <div className="ai-comp-header">
              <span className="ai-comp-name">{c.name}</span>
              <span className="ai-comp-level">{c.level} · {c.pct}%</span>
            </div>
            <div className="ai-comp-bar-track">
              <div
                className={`ai-comp-bar-fill ${c.variant}`}
                style={{ width: `${c.pct}%` }}
              />
            </div>
            <div className="ai-comp-tags">
              {c.tags.map((t) => <span key={t} className="ai-comp-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-section-label">// philosophy.principles</div>
      <div className="ai-section-title">How I Approach AI Engineering</div>
      <p className="ai-section-desc">
        The principles that separate maintainable AI systems from technical debt.
      </p>
      <div className="ai-philosophy-grid">
        {PHILOSOPHIES.map((p) => (
          <div key={p.num} className="ai-philosophy-card" data-num={p.num}>
            <div className={`ai-phil-title ${p.color}`}>{p.title}</div>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackTab() {
  return (
    <div>
      <div className="ai-section-label">// tech_stack.full_inventory</div>
      <div className="ai-section-title">AI Engineering Stack</div>
      <p className="ai-section-desc">
        Every tool chosen for a reason. I work across the full stack — from cloud inference endpoints to local embedding pipelines to production observability.
      </p>
      <div className="ai-stack-sections">
        {STACK_SECTIONS.map((s) => (
          <div key={s.category} className="ai-stack-section">
            <div className={`ai-stack-category ${s.color}`}>
              ⬡ {s.category}
            </div>
            <div className="ai-stack-items">
              {s.items.map((item) => (
                <div key={item} className="ai-stack-item">
                  <span className="ai-item-dot" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-section-label">// architecture.patterns_library</div>
      <div className="ai-section-title">Architecture Patterns I Design</div>
      <p className="ai-section-desc">
        The system patterns I reach for most — each with clear tradeoffs, appropriate use cases, and production-hardening considerations.
      </p>
      <div className="ai-arch-grid">
        {ARCH_PATTERNS.map((p) => (
          <div key={p.title} className="ai-arch-card">
            <span className="ai-arch-icon">{p.icon}</span>
            <div className="ai-arch-title">{p.title}</div>
            <div className={`ai-arch-subtitle ${p.color}`}>{p.subtitle}</div>
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

function ProjectsTab() {
  return (
    <div>
      <div className="ai-section-label">// ai_projects.showcase</div>
      <div className="ai-section-title">AI Systems I've Built</div>
      <p className="ai-section-desc">
        Production-grade AI applications with measurable impact. Expand each card to see the technical implementation details.
      </p>
      <div className="ai-projects-grid">
        {AI_PROJECTS.map((p) => <ProjectCard key={p.title} project={p} />)}
      </div>
    </div>
  );
}

function PromptTab() {
  const [activePrompt, setActivePrompt] = useState(0);
  const current = PROMPT_TECHNIQUES[activePrompt];

  return (
    <div>
      <div className="ai-section-label">// prompt_engineering.lab</div>
      <div className="ai-section-title">Prompt Engineering Techniques</div>
      <p className="ai-section-desc">
        Prompt engineering is the fastest path from idea to working AI feature — and the deepest lever for improving output quality without touching model weights. Here are the techniques I apply daily.
      </p>

      <div className="ai-prompt-lab">
        <div className="ai-prompt-tabs">
          {PROMPT_TECHNIQUES.map((t, i) => (
            <button
              key={t.label}
              className={`ai-prompt-tab ${activePrompt === i ? "active" : ""}`}
              onClick={() => setActivePrompt(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ai-prompt-display">
          <div className="ai-prompt-panel">
            <div className="ai-prompt-side">
              <div className="ai-prompt-side-label">Prompt Design</div>
              <div className="ai-technique-badge">{current.badge}</div>
              <pre
                className="ai-prompt-text"
                dangerouslySetInnerHTML={{ __html: current.prompt }}
              />
            </div>
            <div className="ai-prompt-side">
              <div className="ai-prompt-side-label">Model Output</div>
              <pre
                className="ai-prompt-text"
                dangerouslySetInnerHTML={{ __html: current.output }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ai-section-label">// credentials.ai_specific</div>
      <div className="ai-section-title">AI Credentials &amp; Training</div>
      <p className="ai-section-desc">
        Formal training and certifications in AI engineering, machine learning, and applied LLM development.
      </p>
      <div className="ai-certs-grid">
        {[
          { icon: "🎓", name: "DeepLearning.AI — LangChain for LLM App Dev", issuer: "Andrew Ng / DeepLearning.AI", desc: "Chains, agents, memory, RAG systems, and evaluation with LangChain." },
          { icon: "🤖", name: "Anthropic Prompt Engineering Certification", issuer: "Anthropic", desc: "Advanced prompting, constitutional AI, and Claude API integration." },
          { icon: "🔗", name: "Building Systems with the ChatGPT API", issuer: "DeepLearning.AI / OpenAI", desc: "Multi-step reasoning pipelines, classification, and evaluation." },
          { icon: "📊", name: "MLOps Specialization", issuer: "DeepLearning.AI", desc: "Model deployment, monitoring, data drift detection, and CI/CD for ML." },
          { icon: "🧮", name: "Hugging Face NLP Course", issuer: "Hugging Face", desc: "Transformers, fine-tuning with PEFT, and deploying to Inference API." },
          { icon: "☁️", name: "AWS Certified ML — Specialty", issuer: "Amazon Web Services", desc: "SageMaker, Bedrock, data engineering, and production ML on AWS." },
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

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function AIEngineerPortfolio() {
  const [tab, setTab] = useState(0);

  const tabs = [
    { label: "Overview",           num: "01" },
    { label: "Tech Stack",         num: "02" },
    { label: "AI Projects",        num: "03" },
    { label: "Prompt Engineering", num: "04" },
  ];

  return (
    <div className="ai-portfolio">
      {/* HERO */}
      <div className="ai-hero">
        <div className="ai-hero-grid" />
        <div className="ai-hero-inner">
          <div>
            <div className="ai-status-row">
              <div className="ai-status-badge">
                <span className="ai-dot" />
                Available for AI roles
              </div>
              <div className="ai-status-badge purple">
                <span className="ai-dot" />
                Claude API · OpenAI API
              </div>
              <div className="ai-status-badge green">
                <span className="ai-dot" />
                Production RAG · Agents
              </div>
            </div>
            <h1>
              <span className="ai-cyan">AI</span>{" "}
              <span className="ai-purple">Engineer</span>
              <br />
              <span className="ai-green">Portfolio</span>
            </h1>
            <p className="ai-hero-sub">
              I build <strong>production AI systems</strong> — RAG pipelines, autonomous agents, fine-tuned models,
              and LLM-powered APIs that solve <strong>real business problems</strong> at scale.<br /><br />
              Not prototype demos. Not Jupyter notebooks. <strong>Shipped, measured, production-ready AI.</strong>
            </p>
            <div className="ai-hero-stats">
              {[
                { val: "4+",  lbl: "Years AI/ML Experience" },
                { val: "12+", lbl: "LLM APIs Integrated" },
                { val: "8+",  lbl: "AI Systems in Production" },
                { val: "95%", lbl: "Avg Eval Score" },
              ].map((s) => (
                <div key={s.lbl}>
                  <span className="ai-hero-stat-val">{s.val}</span>
                  <span className="ai-hero-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <AnimatedTerminal />
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
        {tab === 1 && <StackTab />}
        {tab === 2 && <ProjectsTab />}
        {tab === 3 && <PromptTab />}
      </div>

      {/* FOOTER */}
      <div className="ai-footer-bar">
        <span className="ai-footer-copy">
          © {new Date().getFullYear()} · AI Engineer Portfolio · Built for production.
        </span>
        <div className="ai-footer-stack">
          <span className="active">✓ Claude API Certified</span>
          <span>·</span>
          <span className="active">✓ RAG Systems</span>
          <span>·</span>
          <span className="active">✓ AI Agents</span>
          <span>·</span>
          <span>React + FastAPI</span>
        </div>
      </div>
    </div>
  );
}
