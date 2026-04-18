import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Header,
  Segment,
  Item,
  Icon,
  Container,
} from "semantic-ui-react";

// import profilePic from "../../Images/profile pic.PNG";
import {
  textPrimary,
  glassmorphism,
  glassmorphismBorder,
  shadowHeavy,
} from "../../Helpers/Colors/colors";
import HeaderCard from "./HeaderCard";

interface SkillGroups {
  FRONTEND: string[];
  BACKEND: string[];
  "AI TOOLS": string[];
  OTHERS: string[];
}

const HomePageHeader: React.FC = () => {
  const skillGroups: SkillGroups = {
    FRONTEND: [
      "React/Redux",
      "JavaScript / TypeScript",
      "Node.js",
      "HTML/CSS/Less",
      "Styled Components",
    ],
    BACKEND: ["Python/Django", "C# / .NET", "PostgreSQL", "Firebase", "Express"],
    "AI TOOLS": [
      "Claude (Anthropic)",
      "GitHub Copilot",
      "Cursor",
      "Perplexity",
      "LangChain / LlamaIndex",
    ],
    OTHERS: [
      "RAG Pipelines & Vector Search",
      "Prompt Engineering",
      "LLM Agent Development",
      "Scrum Master / Technical PM",
      "Jest / Unit Testing",
    ],
  };

  const groups = Object.keys(skillGroups) as (keyof SkillGroups)[];

  return (
    <Container
      fluid
      style={{
        background: "transparent",
        padding: "60px 20px",
        position: "relative",
      }}
    >
      <Grid.Column>
        <Segment
          textAlign="center"
          className="glass-card fade-in"
          style={{
            background: glassmorphism,
            backdropFilter: "blur(20px)",
            border: `1px solid ${glassmorphismBorder}`,
            borderRadius: "30px",
            boxShadow: shadowHeavy,
            padding: "50px 30px",
            margin: "0 auto",
            maxWidth: "1000px",
          }}
        >
          <Item.Group>
            <Item>
              <Item.Image
                size="medium"
                src="/profile-pic.png"
                circular
                style={{
                  margin: "0 auto",
                  marginBottom: "30px",
                }}
                className="hover-lift"
              />
              <Item.Content verticalAlign="middle">
                <Item.Header
                  as="h1"
                  className="gradient-text"
                  style={{
                    fontSize: "3.5em",
                    marginBottom: "20px",
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  Jonathan J. Holloway
                </Item.Header>
                <Item.Meta>
                  <span
                    style={{
                      color: textPrimary,
                      fontSize: "1.8em",
                      display: "block",
                      marginBottom: "25px",
                      fontWeight: "300",
                    }}
                  >
                    AI Engineer & Full Stack Software Engineer
                  </span>
                </Item.Meta>
                <Item.Description>
                  <Header
                    as="h3"
                    className="gradient-text-secondary"
                    style={{
                      marginBottom: "20px",
                      fontSize: "1.5em",
                    }}
                  >
                    <Icon name="code" />
                    Building Production AI Systems · Shipping Full-Stack Products
                  </Header>
                  <p
                    style={{
                      color: textPrimary,
                      fontSize: "1.3em",
                      lineHeight: "1.8",
                      maxWidth: "700px",
                      margin: "0 auto",
                      fontWeight: "300",
                    }}
                  >
                    I build RAG pipelines, LLM integrations, and autonomous agents
                    that solve real business problems — not prototype demos. A
                    self-taught engineer since 2014, bootcamp graduate, former
                    teaching assistant, and technical PM. I got here the hard way
                    and I build like it.
                  </p>
                  <p
                    style={{
                      color: "#8892b0",
                      fontSize: "0.95em",
                      marginTop: "20px",
                      fontStyle: "italic",
                    }}
                  >
                    Open to: AI-Augmented Engineer · Prompt Engineer · AI-Assisted Full Stack · Technical Consultant (AI Workflow) · Developer Relations
                  </p>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>

        <Grid columns={4} stackable>
          <Grid.Row style={{ margin: "10px" }}>
            {groups.map((groupList, index) => (
              <HeaderCard
                title={groupList}
                group={skillGroups[groupList]}
                key={index}
              />
            ))}
          </Grid.Row>
        </Grid>

        {/* Live Demo CTA */}
        <div style={{
          maxWidth: "1000px",
          margin: "24px auto 0",
          background: "linear-gradient(135deg, rgba(0,210,255,0.06), rgba(123,97,255,0.06))",
          border: "1px solid rgba(0,210,255,0.2)",
          borderRadius: "16px",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div>
            <div style={{ color: "#ff6b35", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
              Live Demo · Serverless AI Tool
            </div>
            <div style={{ color: "#ccd6f6", fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
              AI Bug Triage Assistant
            </div>
            <div style={{ color: "#8892b0", fontSize: "0.88rem" }}>
              Paste any stack trace — get root cause, fix, and prevention in under 1 second.
            </div>
          </div>
          <Link
            to="/ai-bug-triage"
            style={{
              background: "linear-gradient(135deg, #00D2FF, #7b61ff)",
              color: "#0f0f23",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.92rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Try It Live →
          </Link>
        </div>
      </Grid.Column>
    </Container>
  );
};

export default HomePageHeader;
