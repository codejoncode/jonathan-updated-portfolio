import React from "react";
import { darkBlack, lighterBlue, anotherBlue } from "../../Helpers/Colors/colors";

const TIMELINE = [
  {
    year: "2014",
    label: "The Spark",
    detail:
      "Analyzing data by hand at work, I kept thinking: there has to be a better way. That question led me to programming languages. I started on Codecademy — nights, weekends, any free hour I had.",
    accent: "#00D2FF",
  },
  {
    year: "2014–2019",
    label: "Learning While Working",
    detail:
      "Warehousing, truck loading and unloading, cleaning crews, tech support, sales — I worked every job I could find 9-to-5. Then came home and opened the laptop. Built scripts that did the data work faster. Proved the idea worked.",
    accent: "#7b61ff",
  },
  {
    year: "2019–2021",
    label: "Bloom Institute of Technology",
    detail:
      "Enrolled in a full computer science and full-stack engineering program. Didn't just graduate — became a Teaching Assistant, leading lectures for the next cohort coming up behind me.",
    accent: "#39ff14",
  },
  {
    year: "2021–2023",
    label: "Technical Project Manager — Larkist.com",
    detail:
      "Joined Larkist, a data science and AI-powered full-stack platform. Coordinated engineers, data scientists, and stakeholders. Shipped real product. Learned what it means to own delivery end-to-end.",
    accent: "#ffc947",
  },
  {
    year: "Now",
    label: "AI Engineer",
    detail:
      "Building RAG pipelines, LLM integrations, and autonomous agents. The same drive that started this — making data faster and smarter — just at a different scale. Not prototype demos. Production systems.",
    accent: "#00D2FF",
  },
];

const About: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkBlack,
        padding: "60px 24px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <h1
          style={{
            color: lighterBlue,
            fontSize: "2.6rem",
            fontWeight: 800,
            marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}
        >
          Jonathan J. Holloway
        </h1>
        <p
          style={{
            color: anotherBlue,
            fontSize: "1.15rem",
            marginBottom: "48px",
            fontWeight: 400,
          }}
        >
          AI Engineer · Full-Stack Software Engineer · Technical PM
        </p>

        {/* Story block */}
        <div
          style={{
            backgroundColor: "rgba(26, 26, 46, 0.9)",
            border: `1px solid rgba(0, 210, 255, 0.2)`,
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "56px",
            lineHeight: 1.9,
          }}
        >
          <p style={{ color: "#ccd6f6", fontSize: "1.1rem", margin: 0 }}>
            I didn't start in tech. I started in warehouses, truck docks, and
            cleaning crews — working every job I could find while teaching
            myself to code at night.
          </p>
          <p style={{ color: "#ccd6f6", fontSize: "1.1rem", marginTop: "20px" }}>
            It started in 2014 with a simple frustration: I was analyzing data
            by hand and kept thinking <em style={{ color: lighterBlue }}>there
            has to be a better way.</em> That thought led me to programming
            languages, then to scripts that did the work faster, then to a
            full-stack engineering program at Bloom Institute of Technology.
          </p>
          <p style={{ color: "#ccd6f6", fontSize: "1.1rem", marginTop: "20px" }}>
            While most people were commuting to offices, I was commuting from a
            9-to-5 to a laptop. By the time I finished the program I was already
            a Teaching Assistant, leading lectures for the next cohort. From
            there: Technical Project Manager at Larkist.com, a data science and
            AI-powered platform — coordinating engineers, data scientists, and
            stakeholders to ship real product.
          </p>
          <p style={{ color: "#ccd6f6", fontSize: "1.1rem", marginTop: "20px" }}>
            Today I build AI systems. RAG pipelines, LLM integrations, autonomous
            agents. Not because it's trendy — because it's the same drive that
            started this whole thing. Data is slow and manual until it isn't.{" "}
            <span style={{ color: lighterBlue, fontWeight: 600 }}>
              I make it faster.
            </span>
          </p>
        </div>

        {/* Timeline */}
        <h2
          style={{
            color: lighterBlue,
            fontSize: "1.4rem",
            fontWeight: 700,
            marginBottom: "32px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          The Journey
        </h2>

        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div
            style={{
              position: "absolute",
              left: "80px",
              top: 0,
              bottom: 0,
              width: "2px",
              background:
                "linear-gradient(to bottom, #00D2FF33, #7b61ff33, #00D2FF33)",
            }}
          />

          {TIMELINE.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "32px",
                marginBottom: "40px",
                alignItems: "flex-start",
              }}
            >
              {/* Year label */}
              <div
                style={{
                  minWidth: "80px",
                  textAlign: "right",
                  paddingTop: "4px",
                  paddingRight: "24px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    color: item.accent,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.year}
                </span>
                {/* dot */}
                <div
                  style={{
                    position: "absolute",
                    right: "-5px",
                    top: "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: item.accent,
                    boxShadow: `0 0 8px ${item.accent}`,
                  }}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  backgroundColor: "rgba(26, 26, 46, 0.7)",
                  border: `1px solid ${item.accent}33`,
                  borderRadius: "10px",
                  padding: "18px 22px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: item.accent,
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "8px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "#8892b0",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: "56px",
            padding: "40px",
            backgroundColor: "rgba(26, 26, 46, 0.9)",
            border: `1px solid rgba(0, 210, 255, 0.2)`,
            borderRadius: "14px",
          }}
        >
          <p
            style={{
              color: "#ccd6f6",
              fontSize: "1.15rem",
              marginBottom: "24px",
              lineHeight: 1.7,
            }}
          >
            I'm looking for a senior AI engineering role at a company using LLMs
            in production. If you're building something real, I want to talk.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/contact"
              style={{
                backgroundColor: lighterBlue,
                color: darkBlack,
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Get In Touch
            </a>
            <a
              href="/resume"
              style={{
                backgroundColor: "transparent",
                color: lighterBlue,
                border: `2px solid ${lighterBlue}`,
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              View Resumes
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
