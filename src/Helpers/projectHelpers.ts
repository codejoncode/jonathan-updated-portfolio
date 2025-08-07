// Helper functions for project image and data management
import {
  GalleryProject,
  projectGalleryData,
} from "../assets/data/projectGalleryData";
import { projectImageMap } from "../assets/data/projectImageMap";

// Image helper functions
export const getImageByProjectKey = (key: string): string | null => {
  const project = projectImageMap[key];
  return project ? project.image : null;
};

export const getImageByProjectName = (name: string): string | null => {
  const project = projectGalleryData.find((p) => p.name === name);
  return project ? project.image : null;
};

// Project grouping helper functions
export const groupProjectsByCategory = (): {
  [key: string]: GalleryProject[];
} => {
  const grouped: { [key: string]: GalleryProject[] } = {};

  projectGalleryData.forEach((project) => {
    if (!grouped[project.category]) {
      grouped[project.category] = [];
    }
    grouped[project.category].push(project);
  });

  return grouped;
};

export const groupProjectsByType = (): { [key: string]: GalleryProject[] } => {
  const grouped: { [key: string]: GalleryProject[] } = {};

  projectGalleryData.forEach((project) => {
    if (!grouped[project.type]) {
      grouped[project.type] = [];
    }
    grouped[project.type].push(project);
  });

  return grouped;
};

export const groupProjectsByDifficulty = (): {
  [key: string]: GalleryProject[];
} => {
  const grouped: { [key: string]: GalleryProject[] } = {};

  projectGalleryData.forEach((project) => {
    if (!grouped[project.difficulty]) {
      grouped[project.difficulty] = [];
    }
    grouped[project.difficulty].push(project);
  });

  return grouped;
};

// Project filtering and sorting helper functions
export const filterProjectsByTechnology = (
  technology: string,
): GalleryProject[] => {
  return projectGalleryData.filter((project) =>
    project.technologies.some((tech) =>
      tech.toLowerCase().includes(technology.toLowerCase()),
    ),
  );
};

export const sortProjectsByDifficulty = (
  ascending: boolean = true,
): GalleryProject[] => {
  const difficultyOrder = ["Beginner", "Intermediate", "Advanced"];

  return [...projectGalleryData].sort((a, b) => {
    const aIndex = difficultyOrder.indexOf(a.difficulty);
    const bIndex = difficultyOrder.indexOf(b.difficulty);

    return ascending ? aIndex - bIndex : bIndex - aIndex;
  });
};

export const sortProjectsByName = (
  ascending: boolean = true,
): GalleryProject[] => {
  return [...projectGalleryData].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return ascending ? comparison : -comparison;
  });
};

// Advanced filtering functions
export const getProjectsWithLiveDemo = (): GalleryProject[] => {
  return projectGalleryData.filter((project) => project.deploymentUrl);
};

export const getProjectsWithGif = (): GalleryProject[] => {
  return projectGalleryData.filter((project) => project.gifPlay);
};

export const getProjectsByTechStack = (
  techStack: string[],
): GalleryProject[] => {
  return projectGalleryData.filter((project) =>
    techStack.every((tech) =>
      project.technologies.some((projectTech) =>
        projectTech.toLowerCase().includes(tech.toLowerCase()),
      ),
    ),
  );
};

// Statistics and analytics helper functions
export const getProjectStatistics = () => {
  const stats = {
    totalProjects: projectGalleryData.length,
    projectsByCategory: groupProjectsByCategory(),
    projectsByType: groupProjectsByType(),
    projectsByDifficulty: groupProjectsByDifficulty(),
    projectsWithLiveDemo: getProjectsWithLiveDemo().length,
    projectsWithGif: getProjectsWithGif().length,
    mostUsedTechnologies: getMostUsedTechnologies(5),
    averageTechnologiesPerProject: getAverageTechnologiesPerProject(),
    categories: Object.keys(groupProjectsByCategory()),
    types: Object.keys(groupProjectsByType()),
    difficulties: Object.keys(groupProjectsByDifficulty()),
  };

  return stats;
};

export const getMostUsedTechnologies = (
  limit: number = 10,
): { tech: string; count: number }[] => {
  const techCount: { [key: string]: number } = {};

  projectGalleryData.forEach((project) => {
    project.technologies.forEach((tech) => {
      techCount[tech] = (techCount[tech] || 0) + 1;
    });
  });

  return Object.entries(techCount)
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getAverageTechnologiesPerProject = (): number => {
  const totalTech = projectGalleryData.reduce(
    (sum, project) => sum + project.technologies.length,
    0,
  );
  return Math.round((totalTech / projectGalleryData.length) * 100) / 100;
};

// Display helper functions for UI components
export const formatProjectForDisplay = (project: GalleryProject) => {
  return {
    id: project.id,
    title: project.name,
    description: project.description,
    image: project.image,
    technologies: project.technologies,
    features: project.features.slice(0, 3), // Limit to 3 features for display
    status: project.status,
    githubUrl: project.githubUrl,
    deploymentUrl: project.deploymentUrl,
    category: project.category,
    difficulty: project.difficulty,
    keyTakeaways: project.keyTakeaways,
    technicalFocus: project.technicalFocus.slice(0, 3), // Limit for display
  };
};

export const formatProjectsForGrid = (
  projects: GalleryProject[],
  columns: number = 3,
) => {
  const formatted = projects.map(formatProjectForDisplay);
  const gridData: ReturnType<typeof formatProjectForDisplay>[][] = [];

  for (let i = 0; i < formatted.length; i += columns) {
    gridData.push(formatted.slice(i, i + columns));
  }

  return gridData;
};

// Search and recommendation helper functions
export const getRecommendedProjects = (
  currentProjectId: string,
  limit: number = 3,
): GalleryProject[] => {
  const currentProject = projectGalleryData.find(
    (p) => p.id === currentProjectId,
  );
  if (!currentProject) return [];

  // Score projects based on similarity
  const scoredProjects = projectGalleryData
    .filter((p) => p.id !== currentProjectId)
    .map((project) => {
      let score = 0;

      // Same category gets higher score
      if (project.category === currentProject.category) score += 3;

      // Same type gets higher score
      if (project.type === currentProject.type) score += 2;

      // Same difficulty gets higher score
      if (project.difficulty === currentProject.difficulty) score += 1;

      // Shared technologies increase score
      const sharedTech = project.technologies.filter((tech) =>
        currentProject.technologies.includes(tech),
      ).length;
      score += sharedTech;

      return { project, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredProjects.map((item) => item.project);
};
