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
            {activeResume === "general" && <GeneralResumeContent />}
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
        Full Stack Engineer
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
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>Frontend:</p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>JavaScript/TypeScript</li>
            <li>React.js/Redux</li>
            <li>HTML5/CSS3/LESS/SASS</li>
            <li>Semantic UI React</li>
            <li>Responsive Design</li>
            <li>Bootstrap</li>
          </ul>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>Backend:</p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Node.js/Express.js</li>
            <li>Python/Django</li>
            <li>REST API Development</li>
            <li>GraphQL</li>
            <li>Authentication (JWT, OAuth)</li>
          </ul>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Database & Cloud:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>PostgreSQL/MySQL</li>
            <li>MongoDB</li>
            <li>Firebase/Firestore</li>
            <li>Cloud Functions</li>
            <li>AWS Services</li>
          </ul>
        </div>
        <div>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Tools & Methods:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Git/GitHub</li>
            <li>AI/ML Integration</li>
            <li>Agile/Scrum</li>
            <li>Code Reviews</li>
            <li>Testing (Jest, Cypress)</li>
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
          EDUCATION
        </h3>
        <h5 style={{ margin: "8px 0", fontWeight: "bold" }}>
          Lambda School Academy of Computer Science
        </h5>
        <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
          Full Stack Web Development Certificate - 2019
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>9-month intensive program</li>
          <li>Computer Science fundamentals</li>
          <li>Full-stack web development</li>
          <li>Data structures & algorithms</li>
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
        PROFESSIONAL EXPERIENCE
      </h3>

      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Project Manager – Larkist (https://larkist.com)
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d", fontStyle: "italic" }}>
          AI-Powered Full Stack Application | 2024 - Present
        </p>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            Spearheaded end-to-end development of AI-powered platform for online
            bullying detection
          </li>
          <li>
            Led cross-functional team of 5 software engineers and 3 data
            scientists
          </li>
          <li>
            Directed product strategy, UX design alignment, and AI model
            integration
          </li>
          <li>
            Implemented real-time sentiment analysis and content filtering
            systems
          </li>
          <li>
            Managed project timelines, deliverables, and stakeholder
            communications
          </li>
          <li>
            Architected scalable backend infrastructure supporting 10,000+
            concurrent users
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Lambda School - Teaching Assistant & Team Lead
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d", fontStyle: "italic" }}>
          April 2019 - Present
        </p>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            Provide instruction to groups of up to 17 students on computer
            science fundamentals
          </li>
          <li>
            Conduct comprehensive code reviews and assist with debugging complex
            problems
          </li>
          <li>
            Lead development teams of up to 8 developers through full-stack
            projects
          </li>
          <li>
            Mentor students on data structures, algorithms, and software
            engineering best practices
          </li>
          <li>
            Facilitate daily standups, sprint planning, and retrospective
            meetings
          </li>
          <li>
            Guide students through full application deployment and CI/CD
            processes
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
        KEY PROJECTS
      </h3>

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
          <li>Serverless backend with Cloud Functions</li>
          <li>Real-time updates and user authentication</li>
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
          <li>Responsive React/Redux frontend with user authentication</li>
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
        ACHIEVEMENTS
      </h3>
      <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
        <li>
          Successfully launched Larkist.com - live AI-powered platform
          addressing cyberbullying
        </li>
        <li>
          Led cross-functional teams to deliver complex full-stack applications
        </li>
        <li>Mentored 50+ aspiring developers through Lambda School program</li>
        <li>
          Built and deployed multiple full-stack applications with modern tech
          stacks
        </li>
        <li>
          Expertise in integrating AI/ML capabilities into web applications
        </li>
      </ul>
    </div>
  </div>
);

const GeneralResumeContent: React.FC = () => (
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
        Technology Professional & Project Leader
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
          CORE COMPETENCIES
        </h3>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Leadership & Management:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Project Management</li>
            <li>Team Leadership (8+ professionals)</li>
            <li>Cross-functional Collaboration</li>
            <li>Strategic Planning</li>
            <li>Stakeholder Communication</li>
          </ul>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Technical Expertise:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Software Development</li>
            <li>System Architecture</li>
            <li>AI/ML Integration</li>
            <li>Database Management</li>
            <li>Cloud Technologies</li>
          </ul>
        </div>
        <div>
          <p style={{ margin: "8px 0", fontWeight: "bold" }}>
            Professional Skills:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Technical Training & Mentorship</li>
            <li>Problem Solving</li>
            <li>Process Improvement</li>
            <li>Quality Assurance</li>
            <li>Documentation</li>
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
          EDUCATION
        </h3>
        <h5 style={{ margin: "8px 0", fontWeight: "bold" }}>
          Lambda School Academy of Computer Science
        </h5>
        <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
          Full Stack Web Development Certificate - 2019
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Intensive 9-month program</li>
          <li>Software engineering principles</li>
          <li>Team collaboration methodologies</li>
          <li>Leadership development</li>
        </ul>
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
          <li>Full Stack Web Development</li>
          <li>Agile Project Management</li>
          <li>Team Leadership</li>
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
        PROFESSIONAL EXPERIENCE
      </h3>

      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Project Manager – Larkist
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d", fontStyle: "italic" }}>
          Technology Leadership Role | 2024 - Present
        </p>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            Led end-to-end product development for AI-powered platform
            addressing cyberbullying
          </li>
          <li>
            Managed cross-functional team of 8 professionals including engineers
            and data scientists
          </li>
          <li>
            Directed product strategy and user experience design alignment
          </li>
          <li>
            Coordinated project timelines, deliverables, and budget management
          </li>
          <li>
            Facilitated stakeholder communications and project status reporting
          </li>
          <li>
            Implemented agile methodologies to improve team productivity by 40%
          </li>
          <li>
            Successfully launched live platform serving thousands of users
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ fontSize: "15px", margin: "0 0 5px 0", color: "#2c3e50" }}>
          Teaching Assistant & Team Lead - Lambda School
        </h4>
        <p style={{ margin: "5px 0", color: "#7f8c8d", fontStyle: "italic" }}>
          April 2019 - Present
        </p>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            Provide technical instruction and mentorship to groups of up to 17
            students
          </li>
          <li>
            Lead development teams through complex project completion cycles
          </li>
          <li>
            Facilitate meetings, coordinate deliverables, and manage team
            dynamics
          </li>
          <li>Conduct performance reviews and provide constructive feedback</li>
          <li>Develop training materials and curriculum improvements</li>
          <li>
            Mentor team members on professional development and career
            advancement
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
        KEY ACHIEVEMENTS
      </h3>
      <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
        <li>
          <strong>Product Launch:</strong> Successfully launched Larkist.com -
          live AI-powered platform
        </li>
        <li>
          <strong>Team Leadership:</strong> Led cross-functional teams to
          deliver complex projects on time and budget
        </li>
        <li>
          <strong>Mentorship Impact:</strong> Mentored 50+ aspiring
          professionals through career development
        </li>
        <li>
          <strong>Process Improvement:</strong> Implemented agile practices
          resulting in 40% productivity increase
        </li>
        <li>
          <strong>Innovation:</strong> Integrated cutting-edge AI/ML
          technologies into production systems
        </li>
        <li>
          <strong>Stakeholder Management:</strong> Maintained strong
          relationships across technical and business teams
        </li>
      </ul>

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
        LEADERSHIP PHILOSOPHY
      </h3>
      <p style={{ margin: "10px 0", fontSize: "13px", lineHeight: "1.5" }}>
        I believe in empowering teams through clear communication, collaborative
        decision-making, and continuous learning. My approach combines technical
        expertise with people-focused leadership to drive innovation and deliver
        exceptional results. I thrive in environments that challenge
        conventional thinking and require creative problem-solving.
      </p>

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
        AREAS OF IMPACT
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
            Project Management:
          </p>
          <ul style={{ margin: "0", paddingLeft: "15px" }}>
            <li>Agile/Scrum methodologies</li>
            <li>Resource allocation</li>
            <li>Risk management</li>
            <li>Timeline optimization</li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
            Technology Integration:
          </p>
          <ul style={{ margin: "0", paddingLeft: "15px" }}>
            <li>AI/ML implementation</li>
            <li>System architecture</li>
            <li>Performance optimization</li>
            <li>Scalability planning</li>
          </ul>
        </div>
      </div>
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
