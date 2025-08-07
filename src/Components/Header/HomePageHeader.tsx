import React from "react";
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
  OTHERS: string[];
}

const HomePageHeader: React.FC = () => {
  const skillGroups: SkillGroups = {
    FRONTEND: [
      "React/Redux",
      "JavaScript",
      "Node.js",
      "HTML/CSS/Less",
      "Styled Components",
    ],
    BACKEND: ["Python/Django", "Firebase", "PostgresSQL", "Sqlite3", "Express"],
    OTHERS: [
      "C Programming",
      "Unit Testing",
      "Project Management",
      "Coding Teaching Assistant",
      "Customer Service Professional",
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
                    Full Stack Software Engineer
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
                    Passionate Developer & Technical Leader
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
                    Experienced software engineer specializing in modern web
                    technologies, with a passion for creating scalable
                    applications and mentoring developers. Skilled in full-stack
                    development, project management, and technical education.
                  </p>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>

        <Grid columns={3} stackable>
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
      </Grid.Column>
    </Container>
  );
};

export default HomePageHeader;
