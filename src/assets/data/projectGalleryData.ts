// Comprehensive Project Gallery Data
// This file contains detailed project information grouped with their images

import { projectImageMap } from "./projectImageMap";

// Enhanced project interface
export interface GalleryProject {
  id: string;
  name: string;
  image: string;
  category: string;
  type: "web-app" | "mobile-app" | "game" | "tool" | "api" | "ui-design";
  description: string;
  technologies: string[];
  features: string[];
  learningOutcomes: string[];
  technicalFocus: string[];
  status:
    | "Live & Active"
    | "Code Showcase"
    | "Backend Focus"
    | "Full-Stack Demo"
    | "Advanced Features"
    | "In Development";
  githubUrl?: string;
  deploymentUrl?: string;
  planUrl?: string;
  gifPlay?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  keyTakeaways: string[];
}

// Comprehensive project gallery data
export const projectGalleryData: GalleryProject[] = [
  {
    id: "events-app",
    name: projectImageMap["events-app"].name,
    image: projectImageMap["events-app"].image,
    category: projectImageMap["events-app"].category,
    type: projectImageMap["events-app"].type,
    description:
      "A social media type application that allows users to create or join events with real-time updates and Google Maps integration.",
    technologies: [
      "React",
      "Redux",
      "Firebase",
      "Google Maps API",
      "Material-UI",
    ],
    features: [
      "Event Creation & Management",
      "User Authentication",
      "Google Maps Integration",
      "Real-time Updates",
      "Social Media Features",
      "Event Discovery",
    ],
    learningOutcomes: [
      "Advanced React patterns and state management",
      "Real-time database operations with Firebase",
      "Third-party API integration (Google Maps)",
      "User authentication and authorization",
    ],
    technicalFocus: [
      "React Hooks and Context API",
      "Firebase Firestore real-time listeners",
      "Google Maps JavaScript API",
      "Responsive design principles",
    ],
    status: "Live & Active",
    githubUrl: "https://github.com/codejoncode/events-app",
    deploymentUrl: "https://the-events-app.firebaseapp.com/",
    planUrl: "https://trello.com/b/example",
    gifPlay: "https://gfycat.com/ifr/FlatGrimyCuckoo",
    difficulty: "Advanced",
    duration: "4 weeks",
    keyTakeaways: [
      "Real-time data synchronization",
      "Complex state management",
      "API integration best practices",
    ],
  },
  {
    id: "basketball-league",
    name: projectImageMap["basketball-league"].name,
    image: projectImageMap["basketball-league"].image,
    category: projectImageMap["basketball-league"].category,
    type: projectImageMap["basketball-league"].type,
    description:
      "A comprehensive basketball league management system with player statistics, game scheduling, and team management.",
    technologies: ["React", "Redux", "Node.js", "Express", "PostgreSQL"],
    features: [
      "Player Management",
      "Game Scheduling",
      "Statistics Tracking",
      "Team Organization",
      "Score Management",
      "Season Planning",
    ],
    learningOutcomes: [
      "Full-stack application development",
      "Database design and relationships",
      "CRUD operations implementation",
      "State management in complex applications",
    ],
    technicalFocus: [
      "Redux for complex state management",
      "PostgreSQL database design",
      "RESTful API development",
      "Data visualization with charts",
    ],
    status: "Code Showcase",
    githubUrl: "https://github.com/codejoncode/basketball-league",
    difficulty: "Advanced",
    duration: "6 weeks",
    keyTakeaways: [
      "Complex data relationships",
      "Performance optimization",
      "Scalable architecture design",
    ],
  },
  {
    id: "calculator-components",
    name: projectImageMap["calculator-components"].name,
    image: projectImageMap["calculator-components"].image,
    category: projectImageMap["calculator-components"].category,
    type: projectImageMap["calculator-components"].type,
    description:
      "A modular calculator built with reusable React components, demonstrating component architecture and state management.",
    technologies: ["React", "JavaScript", "CSS3", "Jest", "Testing Library"],
    features: [
      "Basic Arithmetic Operations",
      "Memory Functions",
      "History Tracking",
      "Keyboard Support",
      "Responsive Design",
      "Error Handling",
    ],
    learningOutcomes: [
      "Component-based architecture",
      "React testing strategies",
      "Mathematical operations in JavaScript",
      "User interface design principles",
    ],
    technicalFocus: [
      "Reusable component design",
      "State management patterns",
      "Event handling optimization",
      "Unit testing with Jest",
    ],
    status: "Code Showcase",
    githubUrl: "https://github.com/codejoncode/calculator-components",
    deploymentUrl: "https://calculator-components.netlify.com/",
    difficulty: "Intermediate",
    duration: "2 weeks",
    keyTakeaways: [
      "Component reusability",
      "Testing methodologies",
      "Clean code principles",
    ],
  },
  {
    id: "conways-game",
    name: projectImageMap["conways-game"].name,
    image: projectImageMap["conways-game"].image,
    category: projectImageMap["conways-game"].category,
    type: projectImageMap["conways-game"].type,
    description:
      "Interactive implementation of Conway's Game of Life with customizable grid sizes and pattern presets.",
    technologies: ["JavaScript", "HTML5 Canvas", "CSS3", "Algorithms"],
    features: [
      "Interactive Grid Interface",
      "Pattern Presets",
      "Speed Controls",
      "Grid Size Customization",
      "Play/Pause/Reset Controls",
      "Cell Population Counter",
    ],
    learningOutcomes: [
      "Algorithm implementation",
      "Canvas API manipulation",
      "Game loop optimization",
      "Mathematical modeling",
    ],
    technicalFocus: [
      "Cellular automata algorithms",
      "Canvas rendering optimization",
      "Animation frame management",
      "Performance optimization techniques",
    ],
    status: "Code Showcase",
    githubUrl: "https://github.com/codejoncode/conways-game-of-life",
    deploymentUrl: "https://conways-game-life.netlify.com/",
    difficulty: "Intermediate",
    duration: "1 week",
    keyTakeaways: [
      "Algorithm optimization",
      "Canvas performance",
      "Mathematical thinking",
    ],
  },
  {
    id: "note-taking-app",
    name: projectImageMap["note-taking-app"].name,
    image: projectImageMap["note-taking-app"].image,
    category: projectImageMap["note-taking-app"].category,
    type: projectImageMap["note-taking-app"].type,
    description:
      "A full-stack note-taking application with CRUD operations, search functionality, and user authentication.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "JWT",
      "Bcrypt",
    ],
    features: [
      "Create, Read, Update, Delete Notes",
      "Search Functionality",
      "User Authentication",
      "Note Categories",
      "Rich Text Editor",
      "Export Options",
    ],
    learningOutcomes: [
      "Full-stack development workflow",
      "Database operations and queries",
      "Authentication and authorization",
      "API design and implementation",
    ],
    technicalFocus: [
      "RESTful API design",
      "JWT token management",
      "PostgreSQL queries",
      "Frontend-backend communication",
    ],
    status: "Full-Stack Demo",
    githubUrl: "https://github.com/codejoncode/note-taking-app",
    deploymentUrl: "https://note-taking-app.netlify.com/",
    difficulty: "Advanced",
    duration: "5 weeks",
    keyTakeaways: [
      "Full-stack integration",
      "Security best practices",
      "Database optimization",
    ],
  },
  {
    id: "react-wars",
    name: projectImageMap["react-wars"].name,
    image: projectImageMap["react-wars"].image,
    category: projectImageMap["react-wars"].category,
    type: projectImageMap["react-wars"].type,
    description:
      "A Star Wars-themed React application consuming the SWAPI, featuring character information and search capabilities.",
    technologies: ["React", "JavaScript", "CSS3", "SWAPI", "Axios"],
    features: [
      "Character Information Display",
      "Search Functionality",
      "Responsive Cards",
      "Loading States",
      "Error Handling",
      "Themed UI Design",
    ],
    learningOutcomes: [
      "API consumption and data handling",
      "React hooks implementation",
      "Responsive design principles",
      "Error boundary implementation",
    ],
    technicalFocus: [
      "useEffect and useState hooks",
      "Async data fetching",
      "Component lifecycle management",
      "CSS styling and theming",
    ],
    status: "Code Showcase",
    githubUrl: "https://github.com/codejoncode/react-wars",
    deploymentUrl: "https://react-wars-swapi.netlify.com/",
    difficulty: "Intermediate",
    duration: "2 weeks",
    keyTakeaways: [
      "API integration patterns",
      "React hooks mastery",
      "Component design",
    ],
  },
];

// Helper functions for the gallery data
export const getProjectById = (id: string): GalleryProject | undefined => {
  return projectGalleryData.find((project) => project.id === id);
};

export const getProjectsByCategory = (category: string): GalleryProject[] => {
  return projectGalleryData.filter((project) => project.category === category);
};

export const getProjectsByType = (type: string): GalleryProject[] => {
  return projectGalleryData.filter((project) => project.type === type);
};

export const getProjectsByDifficulty = (
  difficulty: string,
): GalleryProject[] => {
  return projectGalleryData.filter(
    (project) => project.difficulty === difficulty,
  );
};

export const getProjectsByStatus = (status: string): GalleryProject[] => {
  return projectGalleryData.filter((project) => project.status === status);
};

export const searchProjects = (query: string): GalleryProject[] => {
  const lowerQuery = query.toLowerCase();
  return projectGalleryData.filter(
    (project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(lowerQuery),
      ) ||
      project.features.some((feature) =>
        feature.toLowerCase().includes(lowerQuery),
      ),
  );
};

export const getAllCategories = (): string[] => {
  const categories: string[] = [];
  projectGalleryData.forEach((project) => {
    if (!categories.includes(project.category)) {
      categories.push(project.category);
    }
  });
  return categories;
};

export const getAllTechnologies = (): string[] => {
  const allTechs = projectGalleryData.flatMap(
    (project) => project.technologies,
  );
  const uniqueTechs: string[] = [];
  allTechs.forEach((tech) => {
    if (!uniqueTechs.includes(tech)) {
      uniqueTechs.push(tech);
    }
  });
  return uniqueTechs;
};
