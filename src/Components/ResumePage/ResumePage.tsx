import React, { useState, useEffect } from "react";
import {
  darkBlack,
  lighterBlue,
  anotherBlue,
} from "../../Helpers/Colors/colors";

type ResumeType =
  | "ai-engineer"
  | "pm-scrum"
  | "swe-general"
  | "frontend"
  | "backend"
  | "legal-research";

interface ResumeOption {
  id: ResumeType;
  title: string;
  subtitle: string;
  filename: string;
  description: string;
  accent: string;
  icon: string;
}

// Custom hook for window width (testable)
export const useWindowWidth = () => {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

// Utility functions for testing
export const resumeUtils = {
  findResumeById: (options: ResumeOption[], id: ResumeType) =>
    options.find((r) => r.id === id),

  generatePDFFilename: (resume: ResumeOption | undefined) =>
    resume ? resume.filename : "resume.pdf",

  createEmailSubject: (resumeTitle: string) =>
    encodeURIComponent(`Resume from Jonathan Holloway - ${resumeTitle}`),

  createEmailBody: (fromName: string, message: string, resume: ResumeOption) =>
    encodeURIComponent(`
Hello,

${fromName} has shared Jonathan Holloway's resume with you.

Message: ${message}

Resume Type: ${resume.title}
Description: ${resume.description}

You can download the resume directly from: ${window.location.origin}/resumes/${resume.filename}

Best regards,
Jonathan Holloway Portfolio System
    `),
};

const RESUME_OPTIONS: ResumeOption[] = [
  {
    id: "ai-engineer",
    title: "AI Engineer",
    subtitle: "LLM Integration | RAG Pipelines | Agents | Prompt Engineering | MLOps",
    filename: "Portfolio_AI_Engineer_Holloway.pdf",
    description: "Specialized in building production AI systems with LLMs, RAG architectures, and autonomous agents.",
    accent: "#00D2FF",
    icon: "🤖",
  },
  {
    id: "pm-scrum",
    title: "Technical Project Manager",
    subtitle: "Certified Scrum Master | Client Engagement | AI-Assisted Delivery",
    filename: "Portfolio_PM_ScrumMaster_Holloway.pdf",
    description: "Agile delivery leadership with cross-functional team coordination and stakeholder management.",
    accent: "#7b61ff",
    icon: "📋",
  },
  {
    id: "swe-general",
    title: "Full-Stack Software Engineer",
    subtitle: "Technical Consultant | Agile Delivery | AI-Assisted Development",
    filename: "Portfolio_SWE_General_Holloway.pdf",
    description: "Broad engineering experience across full-stack development, consulting, and technical delivery.",
    accent: "#39ff14",
    icon: "⚙️",
  },
  {
    id: "frontend",
    title: "Frontend Engineer",
    subtitle: "React | TypeScript | Redux | Component Architecture",
    filename: "Portfolio_Frontend_Engineer_Holloway.pdf",
    description: "UI-focused engineering with modern React patterns, TypeScript, and performance optimization.",
    accent: "#ffc947",
    icon: "🎨",
  },
  {
    id: "backend",
    title: "Backend Engineer",
    subtitle: "APIs & Systems | C# / Node.js / Python | Cloud & DevOps",
    filename: "Portfolio_Backend_Engineer_Holloway.pdf",
    description: "Server-side systems, RESTful APIs, cloud infrastructure, and database architecture.",
    accent: "#ff6b35",
    icon: "🛠️",
  },
  {
    id: "legal-research",
    title: "Legal Research & Analysis",
    subtitle: "Regulatory Compliance | Pro Se Litigation | Technical Documentation",
    filename: "Portfolio_LegalResearch_Holloway.pdf",
    description: "Legal research, regulatory analysis, and technical documentation with compliance focus.",
    accent: "#3A7BD5",
    icon: "⚖️",
  },
];

const ResumePage: React.FC = () => {
  const width = useWindowWidth();
  const [activeResume, setActiveResume] = useState<ResumeType>("ai-engineer");

  const current = resumeUtils.findResumeById(RESUME_OPTIONS, activeResume)!;
  const pdfUrl = `/resumes/${current.filename}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = current.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isMobile = width < 768;

  return (
    <div
      data-testid="resume-page"
      style={{
        minHeight: "100vh",
        backgroundColor: darkBlack,
        padding: isMobile ? "16px" : "32px 24px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          data-testid="resume-title"
          style={{
            color: lighterBlue,
            fontSize: isMobile ? "1.8rem" : "2.4rem",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Resume Portfolio
        </h1>
        <p style={{ color: "#8892b0", marginTop: "8px", fontSize: "1rem" }}>
          Select a role to view the targeted resume
        </p>
      </div>

      {/* Role Selector Cards */}
      <div
        data-testid="resume-selector-buttons"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : "repeat(3, 1fr)",
          gap: "12px",
          maxWidth: "900px",
          margin: "0 auto 32px",
        }}
      >
        {RESUME_OPTIONS.map((resume) => {
          const isActive = activeResume === resume.id;
          return (
            <button
              key={resume.id}
              data-testid={`desktop-resume-button-${resume.id}`}
              onClick={() => setActiveResume(resume.id)}
              style={{
                backgroundColor: isActive
                  ? "rgba(0, 210, 255, 0.08)"
                  : "rgba(26, 26, 46, 0.8)",
                border: `2px solid ${isActive ? resume.accent : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px",
                padding: "14px 12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isActive
                  ? `0 0 16px ${resume.accent}33`
                  : "none",
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>
                {resume.icon}
              </div>
              <div
                style={{
                  color: isActive ? resume.accent : "#ccd6f6",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.75rem" : "0.85rem",
                  lineHeight: 1.3,
                }}
              >
                {resume.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Resume Info + Download */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: "12px",
          padding: "16px 20px",
          backgroundColor: "rgba(26, 26, 46, 0.9)",
          border: `1px solid ${current.accent}44`,
          borderRadius: "10px",
        }}
      >
        <div>
          <div
            style={{
              color: current.accent,
              fontWeight: 700,
              fontSize: "1.05rem",
            }}
          >
            {current.icon} {current.title}
          </div>
          <div
            style={{
              color: "#8892b0",
              fontSize: "0.85rem",
              marginTop: "4px",
            }}
          >
            {current.subtitle}
          </div>
        </div>
        <button
          data-testid="desktop-download-button"
          onClick={handleDownload}
          style={{
            backgroundColor: current.accent,
            color: darkBlack,
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Download PDF
        </button>
      </div>

      {/* PDF Viewer */}
      <div
        data-testid="resume-preview"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "10px",
          overflow: "hidden",
          border: `1px solid ${current.accent}44`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.4)`,
        }}
      >
        {isMobile ? (
          /* Mobile: open in new tab since iframes are hard on mobile */
          <div
            style={{
              backgroundColor: "rgba(26, 26, 46, 0.95)",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
              {current.icon}
            </div>
            <h3 style={{ color: current.accent, marginBottom: "8px" }}>
              {current.title}
            </h3>
            <p style={{ color: "#8892b0", marginBottom: "24px", fontSize: "0.9rem" }}>
              {current.description}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: current.accent,
                  color: darkBlack,
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                View Resume
              </a>
              <button
                data-testid="mobile-download-button"
                onClick={handleDownload}
                style={{
                  backgroundColor: "transparent",
                  color: current.accent,
                  border: `2px solid ${current.accent}`,
                  padding: "12px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={activeResume}
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title={`${current.title} Resume`}
            width="100%"
            height="900px"
            style={{ display: "block", border: "none" }}
          />
        )}
      </div>

      {/* All Roles Footer */}
      <div
        style={{
          maxWidth: "900px",
          margin: "32px auto 0",
          textAlign: "center",
          color: "#4a5568",
          fontSize: "0.8rem",
        }}
      >
        {RESUME_OPTIONS.map((r, i) => (
          <span key={r.id}>
            <span
              style={{ cursor: "pointer", color: anotherBlue }}
              onClick={() => setActiveResume(r.id)}
            >
              {r.title}
            </span>
            {i < RESUME_OPTIONS.length - 1 && (
              <span style={{ margin: "0 8px" }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumePage;
