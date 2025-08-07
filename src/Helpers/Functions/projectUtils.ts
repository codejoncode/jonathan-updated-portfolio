// Utility functions for Projects component testing
export const projectUtils = {
  // Calculate responsive columns based on screen width
  calculateResponsiveColumns: (windowWidth: number, maxColumns: number) => {
    if (windowWidth <= 768) return 1; // Mobile: 1 column
    if (windowWidth <= 1024) return Math.min(maxColumns, 2); // Tablet: max 2 columns
    return Math.min(maxColumns, 4); // Desktop: max 4 columns
  },

  // Get responsive styles based on screen width
  getResponsiveStyles: (windowWidth: number) => ({
    fontSize: windowWidth <= 768 ? "0.8rem" : "1rem",
    padding: windowWidth <= 768 ? "0.5rem" : "1rem",
  }),

  // Format technology name for display
  formatTechnologyName: (tech: string) => tech.toUpperCase(),

  // Check if a technology is active
  isTechnologyActive: (tech: string, activeItem: string) =>
    activeItem === tech.toUpperCase(),

  // Get menu item styles based on active state
  getMenuItemStyles: (
    isActive: boolean,
    windowWidth: number,
    textPrimary: string,
  ) => ({
    color: isActive ? "white" : textPrimary,
    background: isActive
      ? "linear-gradient(135deg, var(--cyan-primary), var(--blue-primary))"
      : "transparent",
    fontSize: windowWidth <= 768 ? "0.8rem" : "1rem",
    padding: windowWidth <= 768 ? "0.5rem" : "1rem",
    borderRadius: "8px",
    margin: "4px",
    transition: "all 0.3s ease",
  }),

  // Create popup styles
  createPopupStyle: (textPrimary: string, glassmorphismBorder: string) => ({
    background: "rgba(255, 255, 255, 0.1)",
    color: textPrimary,
    border: glassmorphismBorder,
    padding: "1rem",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    maxWidth: "300px",
    fontSize: "0.9rem",
  }),

  // Create container styles with responsive padding
  createContainerStyle: () => ({
    padding: "1rem",
    "@media (min-width: 768px)": {
      padding: "2rem",
    },
  }),

  // Validate project data
  validateProjectData: (projects: any[]) => {
    return Array.isArray(projects) && projects.length > 0;
  },

  // Get unique technologies from projects
  getUniqueTechnologies: (projects: any[]) => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach((tech: string) => techSet.add(tech));
      }
    });
    return Array.from(techSet).sort();
  },
};
