import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  Image,
  Header,
  Label,
  Button,
  Icon,
  List,
  Segment,
  Menu,
  Statistic,
  Tab,
} from "semantic-ui-react";
import {
  projectGalleryData,
  GalleryProject,
  getProjectsByCategory,
  getAllCategories,
} from "../assets/data/projectGalleryData";
import {
  groupProjectsByCategory,
  groupProjectsByDifficulty,
  getProjectStatistics,
  getMostUsedTechnologies,
  formatProjectForDisplay,
} from "../Helpers/projectHelpers";
import {
  darkBlack,
  lighterBlue,
  anotherBlue,
  grey,
} from "../Helpers/Colors/colors";

const ProjectGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [filteredProjects, setFilteredProjects] =
    useState<GalleryProject[]>(projectGalleryData);

  const categories = getAllCategories();
  const statistics = getProjectStatistics();
  const topTechnologies = getMostUsedTechnologies(8);
  const groupedByCategory = groupProjectsByCategory();
  const groupedByDifficulty = groupProjectsByDifficulty();

  useEffect(() => {
    let filtered = projectGalleryData;

    if (selectedCategory !== "ALL") {
      filtered = getProjectsByCategory(selectedCategory);
    }

    if (selectedDifficulty !== "ALL") {
      filtered = filtered.filter(
        (project) => project.difficulty === selectedDifficulty,
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedDifficulty]);

  const renderProjectCard = (project: GalleryProject) => {
    const formattedProject = formatProjectForDisplay(project);

    return (
      <Grid.Column key={project.id} width={5}>
        <Card
          fluid
          style={{
            backgroundColor: lighterBlue,
            border: `2px solid ${anotherBlue}`,
          }}
        >
          {/* Project Image */}
          <div
            style={{
              position: "relative",
              height: "250px",
              overflow: "hidden",
            }}
          >
            <Image
              src={project.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Label
              color={project.status === "Live & Active" ? "green" : "blue"}
              ribbon="right"
              style={{ position: "absolute", top: "10px" }}
            >
              {project.status}
            </Label>
            <Label
              color={
                project.difficulty === "Beginner"
                  ? "green"
                  : project.difficulty === "Intermediate"
                    ? "yellow"
                    : "red"
              }
              attached="bottom left"
            >
              {project.difficulty}
            </Label>
          </div>

          <Card.Content>
            <Card.Header style={{ color: darkBlack, fontSize: "1.3em" }}>
              {project.name}
            </Card.Header>
            <Card.Meta style={{ color: grey, margin: "10px 0" }}>
              <Label
                size="small"
                style={{ backgroundColor: darkBlack, color: lighterBlue }}
              >
                {project.category}
              </Label>
              <Label size="small" color="orange">
                {project.type}
              </Label>
              <Label size="small" color="purple">
                {project.duration}
              </Label>
            </Card.Meta>
            <Card.Description
              style={{ color: darkBlack, marginBottom: "10px" }}
            >
              {project.description.substring(0, 120)}...
            </Card.Description>

            {/* Technologies */}
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: darkBlack, fontSize: "0.9em" }}>
                Technologies:
              </strong>
              <div style={{ marginTop: "5px" }}>
                {project.technologies.slice(0, 4).map((tech, index) => (
                  <Label
                    key={index}
                    size="mini"
                    style={{
                      backgroundColor: anotherBlue,
                      color: "white",
                      margin: "2px",
                    }}
                  >
                    {tech}
                  </Label>
                ))}
                {project.technologies.length > 4 && (
                  <Label size="mini" color="grey">
                    +{project.technologies.length - 4} more
                  </Label>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: darkBlack, fontSize: "0.9em" }}>
                Key Features:
              </strong>
              <List bulleted size="small" style={{ marginTop: "5px" }}>
                {formattedProject.features.map((feature, index) => (
                  <List.Item
                    key={index}
                    style={{ color: darkBlack, fontSize: "0.8em" }}
                  >
                    {feature}
                  </List.Item>
                ))}
              </List>
            </div>

            {/* Technical Focus */}
            {formattedProject.technicalFocus.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: darkBlack, fontSize: "0.9em" }}>
                  Technical Focus:
                </strong>
                <List bulleted size="small" style={{ marginTop: "5px" }}>
                  {formattedProject.technicalFocus.map((focus, index) => (
                    <List.Item
                      key={index}
                      style={{ color: darkBlack, fontSize: "0.8em" }}
                    >
                      {focus}
                    </List.Item>
                  ))}
                </List>
              </div>
            )}

            {/* Key Takeaways */}
            {project.keyTakeaways.length > 0 && (
              <div
                style={{
                  backgroundColor: `${darkBlack}20`,
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "15px",
                }}
              >
                <strong style={{ fontSize: "0.8em", color: darkBlack }}>
                  Key Takeaways:
                </strong>
                <List bulleted size="small" style={{ marginTop: "3px" }}>
                  {project.keyTakeaways.slice(0, 2).map((takeaway, index) => (
                    <List.Item
                      key={index}
                      style={{ color: darkBlack, fontSize: "0.75em" }}
                    >
                      {takeaway}
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
          </Card.Content>

          {/* Action Buttons */}
          <Card.Content extra>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {project.githubUrl && (
                <Button
                  as="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  style={{ backgroundColor: darkBlack, color: lighterBlue }}
                >
                  <Icon name="github" /> Code
                </Button>
              )}
              {project.deploymentUrl && (
                <Button
                  as="a"
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  color="green"
                >
                  <Icon name="external" /> Live Demo
                </Button>
              )}
              {project.gifPlay && (
                <Button
                  as="a"
                  href={project.gifPlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  color="purple"
                >
                  <Icon name="play" /> Demo GIF
                </Button>
              )}
            </div>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  };

  const statisticsPane = (
    <Tab.Pane
      style={{
        backgroundColor: darkBlack,
        color: lighterBlue,
        padding: "20px",
      }}
    >
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h2" style={{ color: lighterBlue }}>
              <Icon name="chart bar" />
              Project Portfolio Statistics
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={4}>
            <Statistic inverted>
              <Statistic.Value>{statistics.totalProjects}</Statistic.Value>
              <Statistic.Label>Total Projects</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column width={4}>
            <Statistic inverted>
              <Statistic.Value>
                {statistics.projectsWithLiveDemo}
              </Statistic.Value>
              <Statistic.Label>Live Demos</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column width={4}>
            <Statistic inverted>
              <Statistic.Value>
                {statistics.averageTechnologiesPerProject}
              </Statistic.Value>
              <Statistic.Label>Avg Tech/Project</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column width={4}>
            <Statistic inverted>
              <Statistic.Value>{statistics.categories.length}</Statistic.Value>
              <Statistic.Label>Categories</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Segment style={{ backgroundColor: lighterBlue }}>
              <Header as="h3" style={{ color: darkBlack }}>
                Most Used Technologies
              </Header>
              <List>
                {topTechnologies.map((item, index) => (
                  <List.Item key={index} style={{ marginBottom: "5px" }}>
                    <Label color="blue" horizontal>
                      {item.count}
                    </Label>
                    <span style={{ color: darkBlack }}>{item.tech}</span>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column width={8}>
            <Segment style={{ backgroundColor: lighterBlue }}>
              <Header as="h3" style={{ color: darkBlack }}>
                Projects by Difficulty
              </Header>
              <List>
                {Object.entries(groupedByDifficulty).map(
                  ([difficulty, projects]) => (
                    <List.Item key={difficulty} style={{ marginBottom: "5px" }}>
                      <Label
                        color={
                          difficulty === "Beginner"
                            ? "green"
                            : difficulty === "Intermediate"
                              ? "yellow"
                              : "red"
                        }
                        horizontal
                      >
                        {projects.length}
                      </Label>
                      <span style={{ color: darkBlack }}>{difficulty}</span>
                    </List.Item>
                  ),
                )}
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );

  const projectsPane = (
    <Tab.Pane style={{ backgroundColor: darkBlack, padding: "20px" }}>
      {/* Filters */}
      <Segment style={{ backgroundColor: lighterBlue, marginBottom: "20px" }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h4" style={{ color: darkBlack }}>
                Filter by Category:
              </Header>
              <Menu compact>
                <Menu.Item
                  name="ALL"
                  active={selectedCategory === "ALL"}
                  onClick={() => setSelectedCategory("ALL")}
                  style={{
                    backgroundColor:
                      selectedCategory === "ALL" ? darkBlack : "transparent",
                    color: selectedCategory === "ALL" ? lighterBlue : darkBlack,
                  }}
                />
                {categories.map((category) => (
                  <Menu.Item
                    key={category}
                    name={category}
                    active={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      backgroundColor:
                        selectedCategory === category
                          ? darkBlack
                          : "transparent",
                      color:
                        selectedCategory === category ? lighterBlue : darkBlack,
                    }}
                  />
                ))}
              </Menu>
            </Grid.Column>

            <Grid.Column width={8}>
              <Header as="h4" style={{ color: darkBlack }}>
                Filter by Difficulty:
              </Header>
              <Menu compact>
                {["ALL", "Beginner", "Intermediate", "Advanced"].map(
                  (difficulty) => (
                    <Menu.Item
                      key={difficulty}
                      name={difficulty}
                      active={selectedDifficulty === difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      style={{
                        backgroundColor:
                          selectedDifficulty === difficulty
                            ? darkBlack
                            : "transparent",
                        color:
                          selectedDifficulty === difficulty
                            ? lighterBlue
                            : darkBlack,
                      }}
                    />
                  ),
                )}
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      {/* Projects Grid */}
      <Header as="h3" style={{ color: lighterBlue, marginBottom: "20px" }}>
        <Icon name="folder open" />
        Projects ({filteredProjects.length})
      </Header>

      <Grid stackable>{filteredProjects.map(renderProjectCard)}</Grid>
    </Tab.Pane>
  );

  const panes = [
    {
      menuItem: { key: "projects", icon: "folder open", content: "Projects" },
      render: () => projectsPane,
    },
    {
      menuItem: { key: "statistics", icon: "chart bar", content: "Statistics" },
      render: () => statisticsPane,
    },
  ];

  return (
    <Container
      fluid
      style={{
        backgroundColor: darkBlack,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Header
        as="h1"
        textAlign="center"
        style={{ color: lighterBlue, marginBottom: "30px" }}
      >
        <Icon name="code" />
        Project Portfolio Gallery
      </Header>

      <Tab
        panes={panes}
        renderActiveOnly={false}
        style={{ backgroundColor: darkBlack }}
      />
    </Container>
  );
};

export default ProjectGallery;
