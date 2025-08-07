import { Project } from "../../types";

// Filter and organize projects by technology/category
export const filterData = (
  projects: Project[],
  columnCount: number,
  activeItem: string,
): [Project[][], string[]] => {
  if (!projects || projects.length === 0) {
    return [[], []];
  }

  // Filter projects based on active item
  let filteredProjects = projects;
  if (activeItem !== "ALL") {
    filteredProjects = projects.filter(
      (project) =>
        project.category === activeItem ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(activeItem.toLowerCase()),
        ),
    );
  }

  // Get unique technologies for filter menu
  const allTechnologies = projects.reduce<string[]>((acc, project) => {
    project.technologies.forEach((tech) => {
      if (!acc.includes(tech.toUpperCase())) {
        acc.push(tech.toUpperCase());
      }
    });
    if (project.category && !acc.includes(project.category)) {
      acc.push(project.category);
    }
    return acc;
  }, []);

  // Group projects into chunks based on column count
  const chunkedProjects: Project[][] = [];
  for (let i = 0; i < filteredProjects.length; i += columnCount) {
    chunkedProjects.push(filteredProjects.slice(i, i + columnCount));
  }

  return [chunkedProjects, allTechnologies.sort()];
};

export default filterData;
