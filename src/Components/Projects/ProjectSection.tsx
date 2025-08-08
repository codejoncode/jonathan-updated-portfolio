import React from "react";
import {
  Grid,
  Image,
  Card,
  Container,
  Reveal,
  Header,
  Label,
  Button,
  Icon,
  List,
} from "semantic-ui-react";
import { Project } from "../../types";
import {
  textPrimary,
  textAccent,
  glassmorphismBorder,
} from "../../Helpers/Colors/colors";

interface ProjectSectionProps {
  projects: Project[];
  goToProjectPage?: (id: number) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  projects,
  goToProjectPage,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live & Active":
        return "green";
      case "Code Showcase":
        return "blue";
      case "Backend Focus":
        return "purple";
      case "Full-Stack Demo":
        return "orange";
      case "Advanced Features":
        return "red";
      default:
        return "grey";
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    border: glassmorphismBorder,
    borderRadius: "12px",
    transition: "all 0.3s ease",
    height: "100%",
    backdropFilter: "blur(10px)",
  };

  const revealStyle = {
    borderRadius: 0,
    padding: "1.5em",
    color: "white",
    fontWeight: 500,
    background:
      "linear-gradient(135deg, var(--navy-deep), var(--blue-primary))",
    height: "400px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  };

  return (
    <Grid.Row stretched>
      <br />
      {projects &&
        projects.map((project, index) => (
          <Grid.Column key={index}>
            <Container>
              <Card style={cardStyle} className="project-card">
                <Reveal animated="move down">
                  <Reveal.Content visible>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={project.image || "/images/placeholder-project.png"}
                        fluid
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                      <Label
                        color={getStatusColor(
                          project.status || "Code Showcase",
                        )}
                        ribbon="right"
                        style={{
                          position: "absolute",
                          top: "10px",
                          fontSize: "0.8em",
                        }}
                      >
                        {project.status || "Code Showcase"}
                      </Label>
                    </div>
                    <Card.Content style={{ background: "transparent" }}>
                      <Card.Header
                        style={{ color: textAccent, fontSize: "1.3em" }}
                      >
                        {project.title}
                      </Card.Header>
                      <Card.Meta
                        style={{ color: textPrimary, marginTop: "5px" }}
                      >
                        {project.technologies
                          .slice(0, 3)
                          .map((tech, techIndex) => (
                            <Label
                              key={techIndex}
                              size="mini"
                              style={{
                                background:
                                  "linear-gradient(135deg, var(--cyan-primary), var(--blue-primary))",
                                color: "white",
                                margin: "2px",
                                borderRadius: "8px",
                              }}
                            >
                              {tech}
                            </Label>
                          ))}
                        {project.technologies.length > 3 && (
                          <Label size="mini" style={{ color: textPrimary }}>
                            +{project.technologies.length - 3} more
                          </Label>
                        )}
                      </Card.Meta>
                    </Card.Content>
                  </Reveal.Content>

                  <Reveal.Content hidden>
                    <div style={revealStyle}>
                      <div>
                        <Header
                          as="h3"
                          style={{ color: "white", marginBottom: "10px" }}
                        >
                          {project.title}
                        </Header>

                        <p
                          style={{
                            fontSize: "0.9em",
                            lineHeight: "1.4",
                            margin: "0 0 15px 0",
                            color: "white",
                          }}
                        >
                          {project.description.substring(0, 120)}...
                        </p>

                        {/* Technical Focus */}
                        {project.technicalFocus && (
                          <div style={{ marginBottom: "15px" }}>
                            <strong
                              style={{ color: "white", fontSize: "0.9em" }}
                            >
                              Key Technical Features:
                            </strong>
                            <List
                              bulleted
                              size="small"
                              style={{ marginTop: "5px" }}
                            >
                              {project.technicalFocus
                                .slice(0, 3)
                                .map((focus, focusIndex) => (
                                  <List.Item
                                    key={focusIndex}
                                    style={{
                                      color: "white",
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    {focus}
                                  </List.Item>
                                ))}
                            </List>
                          </div>
                        )}

                        {/* Learning Outcome */}
                        {project.learningOutcomes && (
                          <div
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              padding: "8px",
                              borderRadius: "8px",
                              marginBottom: "15px",
                            }}
                          >
                            <strong
                              style={{ fontSize: "0.8em", color: "white" }}
                            >
                              Learning Focus:
                            </strong>
                            <div
                              style={{
                                fontSize: "0.75em",
                                color: "white",
                                marginTop: "3px",
                              }}
                            >
                              {project.learningOutcomes}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          as="a"
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="mini"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <Icon name="github" /> View Code
                        </Button>

                        {project.deploymentUrl && (
                          <Button
                            as="a"
                            href={project.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="mini"
                            style={{
                              backgroundColor: "#00D2FF",
                              color: "white",
                            }}
                          >
                            <Icon name="external" /> Live Demo
                          </Button>
                        )}

                        {goToProjectPage && (
                          <Button
                            onClick={() => goToProjectPage(project.id)}
                            size="mini"
                            style={{
                              backgroundColor: "#3A7BD5",
                              color: "white",
                            }}
                          >
                            <Icon name="info circle" /> Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </Reveal.Content>
                </Reveal>
              </Card>
            </Container>
          </Grid.Column>
        ))}
    </Grid.Row>
  );
};

export default ProjectSection;
