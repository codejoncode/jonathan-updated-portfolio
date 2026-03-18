import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  darkBlack,
  lighterBlue,
  anotherBlue,
} from "../../Helpers/Colors/colors";

type ResumeType = "fullstack" | "general" | "projects";

interface ResumeOption {
  id: ResumeType;
  title: string;
  filename: string;
  description: string;
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
    resume ? resume.filename.replace(".docx", ".pdf") : "resume.pdf",

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

const ResumePage: React.FC = () => {
  const width = useWindowWidth();
  const [activeResume, setActiveResume] = useState<ResumeType>("fullstack");
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    toEmail: "",
    fromName: "",
    message: "",
  });
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const resumeOptions: ResumeOption[] = [
    {
      id: "fullstack",
      title: "Full Stack Engineer Resume",
      filename: "Full Stack Engineer with Projects.docx",
      description:
        "Technical resume focused on software development skills and experience",
    },
    {
      id: "general",
      title: "General Professional Resume",
      filename: "GENERAL RESUME..docx",
      description:
        "Versatile resume highlighting leadership and transferable skills",
    },
    {
      id: "projects",
      title: "Scrum Master - Agile Project Lead",
      filename: "Scrum Master - Agile Project Lead.docx",
      description:
        "Leadership-focused resume showcasing project management and agile methodologies",
    },
  ];

  const exportPDF = async () => {
    if (resumePreviewRef.current) {
      const currentResume = resumeUtils.findResumeById(
        resumeOptions,
        activeResume,
      );
      const filename = resumeUtils.generatePDFFilename(currentResume);

      try {
        const canvas = await html2canvas(resumePreviewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(filename);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again.");
      }
    }
  };

  const downloadWordDoc = (type: ResumeType) => {
    const resume = resumeUtils.findResumeById(resumeOptions, type);
    if (!resume) return;

    const link = document.createElement("a");
    link.href = `/resumes/${resume.filename}`;
    link.download = resume.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewWordDoc = (type: ResumeType) => {
    const resume = resumeUtils.findResumeById(resumeOptions, type);
    if (!resume) return;

    // For Word docs, we'll open them in a new tab (browser will handle or prompt download)
    window.open(`/resumes/${resume.filename}`, "_blank");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentResume = resumeUtils.findResumeById(
      resumeOptions,
      activeResume,
    );
    if (!currentResume) return;

    // Create mailto link with resume attachment info
    const subject = resumeUtils.createEmailSubject(currentResume.title);
    const body = resumeUtils.createEmailBody(
      emailForm.fromName,
      emailForm.message,
      currentResume,
    );

    const mailtoLink = `mailto:${emailForm.toEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // Reset form and close modal
    setEmailForm({ toEmail: "", fromName: "", message: "" });
    setEmailModal(false);
  };

  if (width < 647) {
    return (
      <div
        className="pdfButtonDiv"
        data-testid="resume-mobile-view"
        style={{ flexDirection: "column", padding: "20px" }}
      >
        <div>
          <h1 data-testid="resume-title" style={{ color: lighterBlue }}>
            Resume Portfolio
          </h1>
        </div>

        {/* Mobile Resume Selector */}
        <div style={{ marginTop: "20px", width: "100%" }}>
          <select
            data-testid="mobile-resume-selector"
            value={activeResume}
            onChange={(e) => setActiveResume(e.target.value as ResumeType)}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: darkBlack,
              color: anotherBlue,
              border: `2px solid ${anotherBlue}`,
              borderRadius: "4px",
              fontSize: "16px",
            }}
          >
            {resumeOptions.map((resume) => (
              <option
                key={resume.id}
                value={resume.id}
                data-testid={`mobile-option-${resume.id}`}
              >
                {resume.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h4
            data-testid="mobile-resume-description"
            style={{ color: anotherBlue }}
          >
            {
              resumeUtils.findResumeById(resumeOptions, activeResume)
                ?.description
            }
          </h4>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <button
            data-testid="mobile-view-button"
            onClick={() => viewWordDoc(activeResume)}
            style={{
              backgroundColor: "transparent",
              color: anotherBlue,
              border: `2px solid ${anotherBlue}`,
              padding: "12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📄 View Word Document
          </button>
          <button
            data-testid="mobile-download-button"
            onClick={() => downloadWordDoc(activeResume)}
            style={{
              backgroundColor: "#2B579A",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ⬇️ Download Word Doc
          </button>
          <button
            data-testid="mobile-email-button"
            onClick={() => setEmailModal(true)}
            style={{
              backgroundColor: "#0078d4",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✉️ Email Resume
          </button>
          <button
            data-testid="mobile-pdf-button"
            onClick={exportPDF}
            style={{
              backgroundColor: anotherBlue,
              color: darkBlack,
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📋 Generate PDF Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="resume-desktop-view">
      <div className="resume">
        <div className="pdfButtonDiv">
          <h1 data-testid="resume-title" style={{ color: lighterBlue }}>
            Resume Portfolio
          </h1>

          {/* Resume Type Selector - Desktop */}
          <div
            data-testid="resume-selector-buttons"
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {resumeOptions.map((resume) => (
              <button
                key={resume.id}
                data-testid={`desktop-resume-button-${resume.id}`}
                onClick={() => setActiveResume(resume.id)}
                style={{
                  backgroundColor:
                    activeResume === resume.id ? anotherBlue : "transparent",
                  color: activeResume === resume.id ? darkBlack : anotherBlue,
                  border: `2px solid ${anotherBlue}`,
                  padding: "10px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: activeResume === resume.id ? "bold" : "normal",
                }}
              >
                {resume.title}
              </button>
            ))}
          </div>

          {/* Active Resume Description */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <p
              data-testid="desktop-resume-description"
              style={{
                color: anotherBlue,
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {
                resumeUtils.findResumeById(resumeOptions, activeResume)
                  ?.description
              }
            </p>
          </div>
        </div>

        {/* Action Buttons - Desktop */}
        <div
          data-testid="desktop-action-buttons"
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            margin: "25px 0",
            flexWrap: "wrap",
          }}
        >
          <button
            data-testid="desktop-view-button"
            onClick={() => viewWordDoc(activeResume)}
            style={{
              backgroundColor: "transparent",
              color: anotherBlue,
              border: `2px solid ${anotherBlue}`,
              padding: "12px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📄 View Word Document
          </button>
          <button
            data-testid="desktop-download-button"
            onClick={() => downloadWordDoc(activeResume)}
            style={{
              backgroundColor: "#2B579A",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⬇️ Download Word Doc
          </button>
          <button
            data-testid="desktop-email-button"
            onClick={() => setEmailModal(true)}
            style={{
              backgroundColor: "#0078d4",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ✉️ Email Resume
          </button>
        </div>

        {/* Live Preview */}
        <div style={{ marginTop: "25px" }}>
          <h3
            data-testid="preview-title"
            style={{
              color: lighterBlue,
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Live Preview -{" "}
            {resumeUtils.findResumeById(resumeOptions, activeResume)?.title}
          </h3>
          <div
            ref={resumePreviewRef}
            data-testid="resume-preview"
            style={{
              padding: "40px",
              color: darkBlack,
              backgroundColor: "white",
              minHeight: "800px",
              maxWidth: "800px",
              margin: "0 auto",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Resume Content Based on Active Selection */}
            {activeResume === "fullstack" && <FullStackResumeContent />}
            {activeResume === "general" && <MasterResumeContent />}
            {activeResume === "projects" && <ProjectsResumeContent />}
          </div>
        </div>

        <div className="pdfButtonDiv" style={{ marginTop: "30px" }}>
          <button
            className="pdfButton"
            data-testid="desktop-pdf-button"
            onClick={exportPDF}
            style={{
              backgroundColor: anotherBlue,
              color: darkBlack,
              padding: "12px 24px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📋 Generate PDF Preview
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div
          data-testid="email-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            data-testid="email-modal-content"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              color: darkBlack,
            }}
          >
            <h3 data-testid="email-modal-title">
              Email Resume:{" "}
              {resumeUtils.findResumeById(resumeOptions, activeResume)?.title}
            </h3>
            <form data-testid="email-form" onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Recipient Email *</label>
                <input
                  data-testid="email-recipient-input"
                  type="email"
                  required
                  value={emailForm.toEmail}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, toEmail: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "5px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Your Name</label>
                <input
                  data-testid="email-from-name-input"
                  type="text"
                  value={emailForm.fromName}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, fromName: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "5px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label>Message (Optional)</label>
                <textarea
                  data-testid="email-message-input"
                  value={emailForm.message}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, message: e.target.value })
                  }
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "5px",
                    resize: "vertical",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  data-testid="email-cancel-button"
                  onClick={() => setEmailModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="email-send-button"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#0078d4",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Resume Content Components
const FullStackResumeContent: React.FC = () => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      lineHeight: "1.5",
      color: "#2c3e50",
    }}
  >
    {/* Header */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          margin: "0 0 5px 0",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Jonathan Holloway
      </h1>
      <h2
        style={{
          fontSize: "16px",
          margin: "0 0 15px 0",
          color: "#34495e",
          fontWeight: "600",
        }}
      >
        Full Stack Software Engineer
      </h2>
      <p style={{ margin: "5px 0", fontSize: "12px" }}>
        Crown Point, IN | (708) 465-2230 | mrjonathanjholloway@gmail.com
      </p>
      <p style={{ margin: "5px 0", fontSize: "12px" }}>
        <a
          href="https://linkedin.com/in/jonathanjholloway"
          style={{ color: "#3498db" }}
        >
          linkedin.com/in/jonathanjholloway
        </a>
        {" | "}
        <a href="https://github.com/codejoncode" style={{ color: "#3498db" }}>
          github.com/codejoncode
        </a>
        {" | "}
        <a
          href="https://jonathanhollowayportfolio.netlify.app"
          style={{ color: "#3498db" }}
        >
          Portfolio
        </a>
      </p>
    </div>

    {/* Professional Summary */}
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        PROFESSIONAL SUMMARY
      </h3>
      <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.6" }}>
        Full-Stack Software Engineer with 4+ years of production experience
        building scalable applications across Fortune 500 clients in financial
        services, technology, agriculture, and food industries. Expert in
        designing secure APIs, responsive React frontends, and enterprise
        backend systems. Certified Scrum Master with proven ability to deliver
        complex features while maintaining code quality, accessibility, and
        security standards.
      </p>
    </div>

    {/* Technical Expertise */}
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        TECHNICAL EXPERTISE
      </h3>
      <div style={{ fontSize: "12px" }}>
        <p style={{ margin: "4px 0" }}>
          <strong>Frontend:</strong> React.js, Next.js, Angular, Redux, HTML5,
          CSS3, LESS/SASS, Semantic UI, Responsive Design, TypeScript
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Backend:</strong> Node.js/Express, C#/ASP.NET, .NET Core,
          Python/Django, RESTful APIs, GraphQL, Authentication (JWT/OAuth)
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Database & Infrastructure:</strong> PostgreSQL, MongoDB, MS
          SQL Server, ElasticSearch, Azure, Docker, Git, CI/CD Pipelines
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Testing & Quality:</strong> Jest, TDD, ADA/WCAG
          Accessibility, Agile/Scrum Methodologies, Code Reviews
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Integrations & Tools:</strong> MuleSoft ESB, Headless CMS,
          Third-party API Integration, Microsoft Office Suite
        </p>
      </div>
    </div>

    {/* Featured Projects */}
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        FEATURED PROJECTS
      </h3>
      <div style={{ marginBottom: "10px" }}>
        <h4
          style={{ fontSize: "12px", fontWeight: "bold", margin: "0 0 3px 0" }}
        >
          Fleek Session Events App
        </h4>
        <ul style={{ margin: "3px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>
            Social platform for event creation and management built with React
            and Redux
          </li>
          <li>
            Implemented real-time notifications and secure authentication
          </li>
          <li>Integrated Google Maps API for location-based services</li>
          <li>Live production deployment with Firebase backend</li>
        </ul>
      </div>
      <div>
        <h4
          style={{ fontSize: "12px", fontWeight: "bold", margin: "0 0 3px 0" }}
        >
          Crypto Currency Dashboard
        </h4>
        <ul style={{ margin: "3px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>Interactive cryptocurrency tracking application</li>
          <li>
            Built responsive UI with React Context API and Styled Components
          </li>
          <li>Developed Node.js/Express backend with real-time API integration</li>
          <li>Deployed on Netlify with live price feeds and market analysis</li>
        </ul>
      </div>
    </div>

    {/* Core Competencies */}
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        CORE COMPETENCIES
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          fontSize: "12px",
        }}
      >
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>Modern Web Development (React, Next.js, TypeScript)</li>
          <li>Full-Stack Application Architecture</li>
          <li>GraphQL & RESTful API Design</li>
          <li>Enterprise Security & Authentication</li>
        </ul>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>Database Design & Optimization</li>
          <li>Cloud Deployment & CI/CD</li>
          <li>Team Leadership & Mentorship</li>
          <li>Agile Sprint Management</li>
        </ul>
      </div>
    </div>

    {/* Professional Highlights */}
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        PROFESSIONAL HIGHLIGHTS
      </h3>
      <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px" }}>
        <li>4+ years of Fortune 500 consulting experience</li>
        <li>40% improvement in code coverage through Jest testing framework</li>
        <li>
          Architected CMS-driven solutions enabling non-technical teams to
          manage content
        </li>
        <li>
          Designed secure data flows protecting against thousands of breach
          attempts
        </li>
        <li>Led cross-functional teams and mentored junior developers</li>
        <li>ADA/WCAG compliant accessibility implementations</li>
      </ul>
    </div>

    {/* Education & Certifications */}
    <div>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        EDUCATION & CERTIFICATIONS
      </h3>
      <div style={{ fontSize: "12px" }}>
        <p style={{ margin: "5px 0" }}>
          <strong>Certified Full Stack Developer</strong> | Bloom Institute of
          Technology | 2019
        </p>
        <p style={{ margin: "5px 0", paddingLeft: "10px", fontSize: "11px" }}>
          9-month intensive program covering computer science fundamentals and
          modern web development
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Certified Scrum Master</strong> | Scrum Alliance | 2020
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Additional Training:</strong>
        </p>
        <ul style={{ margin: "3px 0", paddingLeft: "20px" }}>
          <li>Creative Problem-Solving Certificate | University of Minnesota | 2014</li>
          <li>Business Administration Coursework | University of Dubuque | 2003–2006</li>
        </ul>
      </div>
    </div>
  </div>
);

const MasterResumeContent: React.FC = () => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      lineHeight: "1.5",
      color: "#2c3e50",
    }}
  >
    {/* Header */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "22px", margin: "0 0 5px 0" }}>
        Jonathan Jamel Holloway
      </h1>
      <p style={{ margin: "5px 0", fontSize: "12px" }}>
        Crown Point, IN | (708) 465-2230 | mrjonathanjholloway@gmail.com
      </p>
      <p style={{ margin: "5px 0", fontSize: "12px" }}>
        <a href="https://linkedin.com/in/jonathanjholloway" style={{ color: "#3498db" }}>
          linkedin.com/in/jonathanjholloway
        </a>
        {" | "}
        <a href="https://github.com/codejoncode" style={{ color: "#3498db" }}>
          github.com/codejoncode
        </a>
        {" | "}
        <a href="https://jonathanhollowayportfolio.netlify.app" style={{ color: "#3498db" }}>
          Portfolio
        </a>
      </p>
      <p style={{ margin: "5px 0", fontSize: "12px" }}>
        ⚖{" "}
        <a href="https://www.jonathanhollowayportfolio.netlify.app/legal-research" style={{ color: "#3498db" }}>
          Legal Research Portfolio
        </a>
      </p>
    </div>

    {/* Professional Summary */}
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        PROFESSIONAL SUMMARY
      </h3>
      <p style={{ margin: "0", lineHeight: "1.6", fontSize: "12px" }}>
        Full-stack software engineer with 4+ years of production consulting
        experience across Fortune 500 clients in financial services, technology,
        agriculture, and food industries — and a versatile professional
        background spanning healthcare insurance, customer service, quality
        assurance, and hospitality. Skilled across C#, TypeScript, JavaScript,
        Python, React, Angular, Node.js, ASP.NET, .NET Core, SQL Server,
        MongoDB, Docker, Azure, and CI/CD. Licensed Life, Accident & Health
        Insurance Professional (Indiana License #3968155 — Active). Certified
        Scrum Master. U.S.-based remote-first professional since 2019.
      </p>
    </div>

    {/* Technical Skills */}
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        TECHNICAL SKILLS
      </h3>
      <div style={{ fontSize: "12px" }}>
        <p style={{ margin: "5px 0" }}>
          <strong>Languages:</strong> JavaScript, TypeScript, Python, C#, HTML5,
          CSS3, SQL, PHP, Ruby
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Frameworks & Libraries:</strong> React, Next.js, Angular,
          Node.js/Express, ASP.NET, .NET Core, Django, WPF
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>APIs & Integration:</strong> REST, GraphQL, MuleSoft ESB,
          Headless CMS, third-party API integration
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Data & Infrastructure:</strong> PostgreSQL, MongoDB, MS SQL,
          ElasticSearch, Azure, Docker, Git, CI/CD
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Testing & Quality:</strong> Jest, TDD, ADA/WCAG Accessibility,
          QA Monitoring, 90%+ calibration accuracy
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Insurance & Healthcare:</strong> L/A&H Licensed (IN #3968155),
          Claims Processing, HIPAA, Member Benefits, CRM
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Methods & Tools:</strong> Agile/Scrum (Certified Scrum Master),
          Project Management, Microsoft Office, 67 WPM
        </p>
      </div>
    </div>

    {/* Professional Experience */}
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        PROFESSIONAL EXPERIENCE
      </h3>

      <div style={{ marginBottom: "12px" }}>
        <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "bold" }}>
          Full Stack Software Engineer Consultant | Perficient, Inc.
        </h4>
        <p style={{ margin: "2px 0", fontSize: "12px", fontStyle: "italic", color: "#7f8c8d" }}>
          2019 – 2023 | Remote · Fortune 500 Clients: Financial Services,
          Technology, Agriculture & Food
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>
            Contributed to design, development, testing, and maintenance of
            production applications for Fortune 500 clients
          </li>
          <li>
            Designed and built GraphQL and RESTful API services with secure data
            flows between backend services and React frontends
          </li>
          <li>
            Architected headless CMS integrations with React; built reusable
            component libraries
          </li>
          <li>
            Engineered C#/ASP.NET backend services and MS SQL data layers
            supporting enterprise workflow applications
          </li>
          <li>
            Built WPF-based frontend components for a vending machine management
            application
          </li>
          <li>
            Led development of pandemic-response leave management system
            achieving 100% operational continuity
          </li>
          <li>
            Optimized ElasticSearch filtering algorithms and integrated
            third-party APIs
          </li>
          <li>
            Developed Jest testing framework increasing code coverage by 40%;
            engineered security mechanisms
          </li>
          <li>
            Managed Git-based version control; deployed and maintained
            applications on Azure using CI/CD pipelines
          </li>
          <li>
            Led daily standups, sprint planning, and backlog management as
            Certified Scrum Master
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "bold" }}>
          Technical Teaching Assistant / Labs Team Lead | Bloom Institute of
          Technology
        </h4>
        <p style={{ margin: "2px 0", fontSize: "12px", fontStyle: "italic", color: "#7f8c8d" }}>
          2018 – 2019 | Remote
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>
            Guided distributed cohort through full-stack curriculum achieving
            100% graduation rate
          </li>
          <li>
            Coordinated project timelines and managed Agile team activities
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "bold" }}>
          Quality Assurance Analyst — Healthcare Insurance | Teleperformance
        </h4>
        <p style={{ margin: "2px 0", fontSize: "12px", fontStyle: "italic", color: "#7f8c8d" }}>
          Dec 2015 – Feb 2018 | Healthcare Customer Service, Claims & QA
          Compliance
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "12px" }}>
          <li>
            Managed inbound healthcare insurance inquiries for members: medical
            benefits, claims status, coverage questions
          </li>
          <li>
            Processed and researched insurance claims; coordinated with providers
            to resolve discrepancies
          </li>
          <li>
            Explained complex policy benefits in clear, accessible language to
            members
          </li>
          <li>
            Resolved escalated member concerns including coverage disputes and
            billing issues
          </li>
          <li>
            Monitored CSR calls against quality guidelines and HIPAA/regulatory
            compliance standards
          </li>
          <li>
            Provided real-time coaching and structured feedback to improve call
            quality
          </li>
          <li>
            Created Microsoft Office-based reporting tools to track quality
            metrics
          </li>
          <li>
            Recognized as Employee of the Month (3 nominations, 1 award) and
            Blue Diamond Award recipient
          </li>
        </ul>
      </div>
    </div>

    {/* Education & Certifications */}
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        EDUCATION & CERTIFICATIONS
      </h3>
      <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px" }}>
        <li>
          <strong>Indiana Life, Accident & Health Insurance License</strong> ·
          License #3968155 — Active
        </li>
        <li>
          <strong>Certified Scrum Master</strong> · Scrum Alliance (2020)
        </li>
        <li>
          <strong>Certified Full Stack Developer</strong> · Bloom Institute of
          Technology (2019)
        </li>
        <li>
          <strong>Creative Problem-Solving Certificate</strong> · University of
          Minnesota (2014)
        </li>
        <li>
          <strong>Business Administration (Coursework)</strong> · University of
          Dubuque (2003–2006)
        </li>
        <li>
          <strong>High School Diploma</strong> · Thornton Fractional South High
          School (2003)
        </li>
      </ul>
    </div>

    {/* Key Achievements */}
    <div>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
          margin: "0 0 8px 0",
          borderBottom: "2px solid #3498db",
          paddingBottom: "4px",
        }}
      >
        KEY ACHIEVEMENTS
      </h3>
      <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px" }}>
        <li>
          4+ years enterprise consulting — Fortune 500 clients across financial
          services, technology, agriculture, and food industries
        </li>
        <li>100% graduation rate as Teaching Assistant at Bloom Institute</li>
        <li>40% increase in code coverage through Jest testing framework</li>
        <li>
          3+ years healthcare insurance experience: claims processing, QA
          monitoring, and member advocacy
        </li>
        <li>
          90%+ quality calibration accuracy; Employee of the Month and Blue
          Diamond Award recipient
        </li>
        <li>
          Active Indiana Life, Accident & Health Insurance License — obtained
          post-layoff
        </li>
        <li>
          Filed four pro se court documents in Indiana dissolution proceeding
          within statutory deadlines
        </li>
      </ul>
    </div>
  </div>
);

const ProjectsResumeContent: React.FC = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "40px",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      lineHeight: "1.4",
    }}
  >
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "8px", color: "#2c3e50" }}>
        Jonathan J. Holloway
      </h1>
      <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#34495e" }}>
        Scrum Master - Agile Project Lead
      </h2>

      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "10px",
            borderBottom: "2px solid #3498db",
            paddingBottom: "5px",
          }}
        >
          CONTACT
        </h3>
        <p style={{ margin: "5px 0" }}>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/jonathanjholloway/"
            style={{ color: "#3498db" }}
          >
            linkedin.com/in/jonathanjholloway
          </a>
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>GitHub:</strong>{" "}
          <a href="https://github.com/codejoncode" style={{ color: "#3498db" }}>
            github.com/codejoncode
          </a>
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Email:</strong> jonathanjamelholloway@gmail.com
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Location:</strong> Crown Point, IN, USA
        </p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "10px",
            borderBottom: "2px solid #3498db",
            paddingBottom: "5px",
          }}
        >
          TECHNICAL SKILLS
        </h3>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>Development:</p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>JavaScript/TypeScript</li>
            <li>React.js/Redux</li>
            <li>Node.js/Express.js</li>
            <li>Python/Django</li>
            <li>HTML5/CSS3/SASS</li>
          </ul>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Backend & Database:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>PostgreSQL/MySQL</li>
            <li>MongoDB/Firestore</li>
            <li>REST/GraphQL APIs</li>
            <li>Firebase/Cloud Functions</li>
          </ul>
        </div>
        <div>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Project Management:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Agile/Scrum Methodologies</li>
            <li>JIRA/Azure DevOps</li>
            <li>Git/GitHub</li>
            <li>AI/ML Integration</li>
            <li>CI/CD Pipelines</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "10px",
            borderBottom: "2px solid #3498db",
            paddingBottom: "5px",
          }}
        >
          CERTIFICATIONS
        </h3>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>Scrum Master Certification</li>
          <li>Agile Project Management</li>
          <li>Full Stack Development</li>
        </ul>
      </div>
    </div>

    <div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: "15px",
          borderBottom: "2px solid #3498db",
          paddingBottom: "5px",
        }}
      >
        FEATURED PROJECTS
      </h3>

      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Larkist - AI Anti-Bullying Platform
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
          Live: https://larkist.com | Role: Project Manager & Lead Developer
        </p>
        <p style={{ margin: "5px 0", fontSize: "13px" }}>
          <strong>Tech Stack:</strong> React, Node.js, Python, AI/ML, Real-time
          Processing
        </p>
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold", fontSize: "13px" }}>
            Project Scope & Leadership:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px" }}>
            <li>
              Led team of 5 engineers and 3 data scientists through 8-month
              development cycle
            </li>
            <li>
              Managed $150K budget and coordinated cross-functional deliverables
            </li>
            <li>Implemented agile sprint cycles with 2-week iterations</li>
            <li>
              Conducted daily standups, sprint planning, and retrospectives
            </li>
          </ul>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold", fontSize: "13px" }}>
            Technical Implementation:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px" }}>
            <li>
              AI-powered platform for detecting and blocking online bullying
            </li>
            <li>Real-time sentiment analysis and timeline optimization</li>
            <li>Scalable architecture supporting 10,000+ concurrent users</li>
            <li>Mission-driven approach to social media enhancement</li>
          </ul>
        </div>
        <div>
          <p style={{ margin: "8px 0", fontWeight: "bold", fontSize: "13px" }}>
            Project Outcomes:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px" }}>
            <li>
              Successfully launched live platform on schedule and under budget
            </li>
            <li>Achieved 95% user satisfaction rating in initial feedback</li>
            <li>Implemented automated testing reducing bugs by 60%</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Events App - Social Platform
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
          Live: https://the-events-app.firebaseapp.com/
        </p>
        <p style={{ margin: "5px 0", fontSize: "13px" }}>
          <strong>Tech Stack:</strong> React, Redux, Firebase, Google Maps API
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px", fontSize: "13px" }}>
          <li>Social media application for event creation and management</li>
          <li>Google Maps/Places integration for location services</li>
          <li>Serverless backend with Cloud Functions and Firestore</li>
          <li>Real-time updates and user authentication system</li>
          <li>Responsive design supporting mobile and desktop platforms</li>
        </ul>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Note Taking App - Full Stack CRUD
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
          Live: https://notetakingapp.netlify.com/
        </p>
        <p style={{ margin: "5px 0", fontSize: "13px" }}>
          <strong>Tech Stack:</strong> React, Redux, Node, Express, PostgreSQL
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px", fontSize: "13px" }}>
          <li>Full-stack application with complete CRUD functionality</li>
          <li>RESTful API backend with PostgreSQL database</li>
          <li>Responsive React/Redux frontend with state management</li>
          <li>User authentication and data persistence layers</li>
          <li>Deployed with CI/CD pipeline and automated testing</li>
        </ul>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Lambda Treasure Hunt - Game Development
        </h4>
        <p style={{ margin: "5px 0", fontSize: "13px" }}>
          <strong>Tech Stack:</strong> Python, Django, Graph Algorithms, REST
          APIs
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px", fontSize: "13px" }}>
          <li>
            Multi-player treasure hunting game with complex pathfinding
            algorithms
          </li>
          <li>Implemented BFS/DFS algorithms for optimal route calculation</li>
          <li>Real-time player tracking and collision detection</li>
          <li>RESTful API integration for game state management</li>
        </ul>
      </div>

      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: "15px",
          borderBottom: "2px solid #3498db",
          paddingBottom: "5px",
        }}
      >
        PROFESSIONAL EXPERIENCE
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Lambda School - Teaching Assistant & Team Lead
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d", fontStyle: "italic" }}>
          April 2019 - Present
        </p>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            Instruction on data structures, algorithms, and full-stack
            development
          </li>
          <li>
            Code reviews and debugging assistance for 17+ students per cohort
          </li>
          <li>
            Team leadership for groups of 8+ developers on capstone projects
          </li>
          <li>
            Agile project management including sprint planning and
            retrospectives
          </li>
          <li>
            Mentorship on software engineering best practices and career
            development
          </li>
        </ul>
      </div>

      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: "15px",
          borderBottom: "2px solid #3498db",
          paddingBottom: "5px",
        }}
      >
        PROJECT MANAGEMENT APPROACH
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          fontSize: "13px",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
            Agile Methodologies:
          </p>
          <ul style={{ margin: "0", paddingLeft: "15px" }}>
            <li>Sprint planning & execution</li>
            <li>Daily standups & retrospectives</li>
            <li>User story development</li>
            <li>Continuous integration</li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
            Team Leadership:
          </p>
          <ul style={{ margin: "0", paddingLeft: "15px" }}>
            <li>Cross-functional coordination</li>
            <li>Technical mentorship</li>
            <li>Performance optimization</li>
            <li>Risk management</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default ResumePage;