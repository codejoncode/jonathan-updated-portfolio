import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Menu, Popup, Container } from "semantic-ui-react";
import ProjectSection from "./ProjectSection";
import { fetchProjects } from "../../Store/Actions/projectActions";
import filterData from "../../Helpers/Functions/filterData";
import { RootState } from "../../types";
import { ThemeProps } from "../../types";
import {
  textPrimary,
  textAccent,
  glassmorphismBorder,
} from "../../Helpers/Colors/colors";
import { projectUtils } from "../../Helpers/Functions/projectUtils";

interface ProjectsProps extends ThemeProps {
  columnCount: number;
  goToProjectPage: (id: number) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  columnCount,
  goToProjectPage,
}) => {
  const dispatch = useDispatch();
  const projects = useSelector(
    (state: RootState) => state.projectReducer.projects,
  );
  const loading = useSelector(
    (state: RootState) => state.projectReducer.loading,
  );

  const [activeItem, setActiveItem] = useState("ALL");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects() as any);
  }, [dispatch]);

  const handleItemClick = (e: React.MouseEvent, data: any) => {
    setActiveItem(data.name || "ALL");
  };

  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  // Use utility function for responsive column calculation
  const getResponsiveColumns = () => {
    if (typeof window !== "undefined") {
      return projectUtils.calculateResponsiveColumns(
        window.innerWidth,
        columnCount,
      );
    }
    return columnCount;
  };

  const [responsiveColumns, setResponsiveColumns] =
    useState(getResponsiveColumns);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setResponsiveColumns(
          projectUtils.calculateResponsiveColumns(
            window.innerWidth,
            columnCount,
          ),
        );
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [columnCount]);

  if (loading) {
    return (
      <Container
        textAlign="center"
        data-testid="projects-loading"
        style={{
          padding: "4rem 1rem",
          color: textPrimary,
        }}
      >
        <div style={{ fontSize: "1.2rem" }}>Loading projects...</div>
      </Container>
    );
  }

  const data = filterData(projects, responsiveColumns, activeItem);
  const projectsDisplay = data[0];
  const technologies = ["ALL", ...data[1]];

  const popUpStyle = projectUtils.createPopupStyle(
    textPrimary,
    glassmorphismBorder,
  );
  const containerStyle = projectUtils.createContainerStyle();

  return (
    <Container fluid style={containerStyle} data-testid="projects-container">
      {/* Responsive Menu */}
      <Menu
        pagination
        fluid
        stackable
        size="small"
        className="glass-card"
        data-testid="projects-filter-menu"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: glassmorphismBorder,
          marginBottom: "1rem",
          overflowX: "auto",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
      >
        {technologies.map((tech, index) => {
          const isActive = projectUtils.isTechnologyActive(tech, activeItem);
          const windowWidth =
            typeof window !== "undefined" ? window.innerWidth : 1024;
          const itemStyles = projectUtils.getMenuItemStyles(
            isActive,
            windowWidth,
            textPrimary,
          );

          return (
            <Menu.Item
              key={index}
              name={projectUtils.formatTechnologyName(tech)}
              active={isActive}
              onClick={handleItemClick}
              data-testid={`projects-filter-${tech.toLowerCase()}`}
              style={itemStyles}
            />
          );
        })}
      </Menu>

      {/* Help Popup */}
      <Popup
        content="Click a tab to filter the projects list. Hover over projects to see technical details. Click 'View Code' to see the GitHub repository."
        open={isPopupOpen}
        onClose={handlePopupClose}
        onOpen={handlePopupOpen}
        position="top center"
        trigger={<div data-testid="projects-help-trigger" />}
        style={popUpStyle}
        data-testid="projects-help-popup"
      />

      {/* Responsive Grid */}
      <Grid
        columns={responsiveColumns as any}
        divided
        stackable
        doubling
        style={{ margin: "0" }}
        data-testid="projects-grid"
      >
        {projectsDisplay.map((projects, index) => (
          <ProjectSection
            key={index}
            projects={projects}
            goToProjectPage={goToProjectPage}
            data-testid={`projects-section-${index}`}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
