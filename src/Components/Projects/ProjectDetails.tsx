import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Header,
  Item,
  Segment,
  Grid,
  Message,
  Container,
} from "semantic-ui-react";
import ProjectFeatureList from "./ProjectFeatureList";
import GithubLinks from "./GithubLinks";
import PlanLinks from "./PlanLinks";
import DeploymentLinks from "./DeploymentLinks";
import { darkBlack, lighterBlue } from "../../Helpers/Colors/colors";
import {
  fetchProjects,
  fetchOneProject,
} from "../../Store/Actions/projectActions";
import { RootState } from "../../types";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const projects = useSelector(
    (state: RootState) => state.projectReducer.projects,
  );
  const soloProject = useSelector(
    (state: RootState) => state.projectReducer.soloProject,
  );
  const loading = useSelector(
    (state: RootState) => state.projectReducer.loading,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOneProject(parseInt(id)) as any);
      dispatch(fetchProjects() as any);
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          color: lighterBlue,
        }}
      >
        Loading project details...
      </div>
    );
  }

  const projectId = id ? parseInt(id) : 0;
  const project = soloProject || projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <Container style={{ padding: "50px" }}>
        <Header as="h1" style={{ color: lighterBlue, textAlign: "center" }}>
          Project not found
        </Header>
      </Container>
    );
  }

  return (
    <div>
      <Segment textAlign="center" style={{ backgroundColor: darkBlack }}>
        <Item>
          <Header style={{ color: lighterBlue }}>{project.title}</Header>
          <div
            style={{
              position: "relative",
              paddingBottom: "calc(50.90% + 44px)",
            }}
          >
            {project.gifPlay ? (
              <iframe
                title={project.title}
                src={project.gifPlay}
                frameBorder="0"
                scrolling="no"
                width="100%"
                height="100%"
                style={{ position: "absolute", top: "0", left: "0" }}
              />
            ) : (
              <img
                src={project.image || "/images/placeholder-project.png"}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              />
            )}
          </div>
        </Item>
      </Segment>

      <Grid>
        <Grid.Row>
          <Message
            style={{
              backgroundColor: darkBlack,
              padding: "40px",
              marginTop: "14px",
              boxShadow: "none",
            }}
          >
            <Header style={{ color: lighterBlue }}>Project Description</Header>
            <p
              style={{
                color: lighterBlue,
                fontSize: "1.2em",
                lineHeight: "1.6",
              }}
            >
              {project.description}
            </p>
          </Message>

          <Message
            style={{
              backgroundColor: darkBlack,
              padding: "40px",
              marginTop: "14px",
              boxShadow: "none",
            }}
          >
            <Header style={{ color: lighterBlue }}>Technologies Used</Header>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: lighterBlue,
                    color: darkBlack,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "1em",
                    fontWeight: "bold",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </Message>

          <Message
            style={{
              backgroundColor: darkBlack,
              padding: "40px",
              boxShadow: "none",
            }}
          >
            <Header style={{ color: lighterBlue }}>Features Implemented</Header>
            <ProjectFeatureList
              features={project.features}
              lighterBlue={lighterBlue}
            />
          </Message>

          <Message
            style={{
              backgroundColor: darkBlack,
              padding: "40px",
              boxShadow: "none",
            }}
          >
            <GithubLinks links={project.githubUrl} lighterBlue={lighterBlue} />
          </Message>

          {project.planUrl && (
            <Message
              style={{
                backgroundColor: darkBlack,
                padding: "40px",
                boxShadow: "none",
              }}
            >
              <PlanLinks links={project.planUrl} lighterBlue={lighterBlue} />
            </Message>
          )}

          {project.deploymentUrl && (
            <Message
              style={{
                backgroundColor: darkBlack,
                padding: "40px",
                boxShadow: "none",
              }}
            >
              <DeploymentLinks
                links={project.deploymentUrl}
                lighterBlue={lighterBlue}
              />
            </Message>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default ProjectDetails;
