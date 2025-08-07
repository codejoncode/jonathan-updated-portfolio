import { Dispatch } from "redux";
import axios from "axios";
import { Project } from "../../types";

// Import images directly
import eventsAppImage from "../../Images/events-app-fleek-session.png";
import noteAppImage from "../../Images/noteTakingApp.png";
import portfolioImage from "../../Images/White background engineer.png";
import ecommerceApiImage from "../../Images/socialCard.png";
import taskManagerImage from "../../Images/simpleTodList.png";
import basketballImage from "../../Images/basketballLeague.png";
import calculatorImage from "../../Images/calculatorComponents.png";
import conwaysGameImage from "../../Images/conwaysGame.png";
import forexLandingImage from "../../Images/forexLandingPage.png";
import lambdaTreasureImage from "../../Images/Lambda Treasure Hunt.png";
import lambdaMudImage from "../../Images/lambdaMud.png";
import lambdaTimesImage from "../../Images/lambdaTimes.png";
import reactWarsImage from "../../Images/reactWars.png";
import simpleCalendarImage from "../../Images/simpleCalendarApp.png";
import sudokuImage from "../../Images/sudoku.png";
import symposiumImage from "../../Images/Symposium.png";
import uiDesignImage from "../../Images/ui design.png";
import larkistImage from "../../Images/larkist.png";

// Action Types
const FETCH_PROJECTS_START = "FETCH_PROJECTS_START";
const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";
const FETCH_ONE_PROJECT_START = "FETCH_ONE_PROJECT_START";
const FETCH_ONE_PROJECT_SUCCESS = "FETCH_ONE_PROJECT_SUCCESS";
const FETCH_ONE_PROJECT_FAILURE = "FETCH_ONE_PROJECT_FAILURE";

// API endpoint
const API_URL = "https://jonathan-holloway.herokuapp.com/projects";

// Mock data with imported images
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Events App",
    description:
      "A social media type application that allows users to create or join events.",
    image: eventsAppImage, // Use imported image
    gifPlay: "https://gfycat.com/ifr/FlatGrimyCuckoo",
    githubUrl: "https://github.com/codejoncode/events-app",
    deploymentUrl: "https://the-events-app.firebaseapp.com/",
    planUrl: "https://trello.com/b/example",
    features:
      "Event Creation,User Authentication,Google Maps Integration,Real-time Updates",
    technologies: ["React", "Redux", "Firebase", "Google Maps API"],
    category: "REACT",
  },
  {
    id: 2,
    title: "Note Taking App",
    description: "A full-stack note-taking application with CRUD operations.",
    image: noteAppImage,
    githubUrl: "https://github.com/codejoncode/note-app",
    deploymentUrl: "https://notetakingapp.netlify.com/",
    features: "Create Notes,Edit Notes,Delete Notes,Search Functionality",
    technologies: ["React", "Node", "Express", "PostgreSQL"],
    category: "FULLSTACK",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description:
      "Modern responsive portfolio website built with React and TypeScript.",
    image: portfolioImage,
    githubUrl: "https://github.com/codejoncode/portfolio",
    deploymentUrl: "https://jonathan-holloway.dev",
    features: "Responsive Design,TypeScript,Modern React Hooks,SEO Optimized",
    technologies: ["React", "TypeScript", "Semantic UI", "Redux"],
    category: "REACT",
  },
  {
    id: 4,
    title: "E-Commerce API",
    description:
      "RESTful API for e-commerce platform with full CRUD operations.",
    image: ecommerceApiImage,
    githubUrl: "https://github.com/codejoncode/ecommerce-api",
    deploymentUrl: "https://ecommerce-api.herokuapp.com/",
    features:
      "User Authentication,Product Management,Order Processing,Payment Integration",
    technologies: ["Node", "Express", "PostgreSQL", "JWT"],
    category: "BACKEND",
  },
  {
    id: 5,
    title: "Task Management System",
    description:
      "Full-stack task management application with team collaboration features.",
    image: taskManagerImage,
    githubUrl: "https://github.com/codejoncode/task-manager",
    deploymentUrl: "https://task-manager-app.netlify.com/",
    features:
      "Team Collaboration,Real-time Updates,File Attachments,Due Date Tracking",
    technologies: ["React", "Node", "Express", "MongoDB", "Socket.io"],
    category: "FULLSTACK",
  },
  {
    id: 6,
    title: "Basketball League Manager",
    description:
      "A comprehensive basketball league management system with player stats and game scheduling.",
    image: basketballImage,
    githubUrl: "https://github.com/codejoncode/basketball-league",
    deploymentUrl: "https://basketball-league.netlify.com/",
    features:
      "Player Management,Game Scheduling,Statistics Tracking,Team Organization",
    technologies: ["React", "Redux", "Node", "PostgreSQL"],
    category: "FULLSTACK",
  },
  {
    id: 7,
    title: "Calculator Components",
    description: "A modular calculator built with reusable React components.",
    image: calculatorImage,
    githubUrl: "https://github.com/codejoncode/calculator-components",
    deploymentUrl: "https://calculator-components.netlify.com/",
    features:
      "Modular Design,Reusable Components,Mathematical Operations,Memory Functions",
    technologies: ["React", "JavaScript", "CSS3", "Jest"],
    category: "REACT",
  },
  {
    id: 8,
    title: "Conway's Game of Life",
    description:
      "Interactive implementation of Conway's Game of Life with customizable settings.",
    image: conwaysGameImage,
    githubUrl: "https://github.com/codejoncode/conways-game-of-life",
    deploymentUrl: "https://conways-game-life.netlify.com/",
    features:
      "Interactive Grid,Pattern Presets,Speed Controls,Grid Customization",
    technologies: ["JavaScript", "HTML5 Canvas", "CSS3"],
    category: "REACT",
  },
  {
    id: 9,
    title: "Forex Landing Page",
    description:
      "Modern landing page for forex trading platform with responsive design.",
    image: forexLandingImage,
    githubUrl: "https://github.com/codejoncode/forex-landing",
    deploymentUrl: "https://forex-landing.netlify.com/",
    features: "Responsive Design,Modern UI,Call-to-Action,Contact Forms",
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    category: "REACT",
  },
  {
    id: 10,
    title: "Lambda Treasure Hunt",
    description:
      "Adventure game using pathfinding algorithms and API integration.",
    image: lambdaTreasureImage,
    githubUrl: "https://github.com/codejoncode/lambda-treasure-hunt",
    features:
      "Pathfinding Algorithms,API Integration,Game Logic,Data Structures",
    technologies: ["Python", "Algorithms", "REST API"],
    category: "BACKEND",
  },
  {
    id: 11,
    title: "Lambda MUD",
    description:
      "Multi-user dungeon game with real-time multiplayer functionality.",
    image: lambdaMudImage,
    githubUrl: "https://github.com/codejoncode/lambda-mud",
    deploymentUrl: "https://lambda-mud.netlify.com/",
    features:
      "Multiplayer Gaming,Real-time Communication,Game State Management",
    technologies: ["Python", "Django", "WebSockets", "React"],
    category: "FULLSTACK",
  },
  {
    id: 12,
    title: "Lambda Times",
    description: "News website with modern layout and responsive design.",
    image: lambdaTimesImage,
    githubUrl: "https://github.com/codejoncode/lambda-times",
    deploymentUrl: "https://lambda-times.netlify.com/",
    features:
      "Responsive Layout,News Articles,Interactive Components,Modern Design",
    technologies: ["JavaScript", "HTML5", "CSS3", "jQuery"],
    category: "REACT",
  },
  {
    id: 13,
    title: "React Wars",
    description: "Star Wars themed React application consuming the SWAPI API.",
    image: reactWarsImage,
    githubUrl: "https://github.com/codejoncode/react-wars",
    deploymentUrl: "https://react-wars-swapi.netlify.com/",
    features:
      "API Integration,Character Information,Search Functionality,Themed Design",
    technologies: ["React", "JavaScript", "SWAPI", "CSS3"],
    category: "REACT",
  },
  {
    id: 14,
    title: "Simple Calendar App",
    description:
      "Clean and intuitive calendar application with event management.",
    image: simpleCalendarImage,
    githubUrl: "https://github.com/codejoncode/simple-calendar",
    deploymentUrl: "https://simple-calendar-app.netlify.com/",
    features: "Event Management,Calendar View,Date Navigation,Clean Interface",
    technologies: ["React", "JavaScript", "CSS3", "Date-fns"],
    category: "REACT",
  },
  {
    id: 15,
    title: "Sudoku Game",
    description:
      "Interactive Sudoku puzzle game with multiple difficulty levels.",
    image: sudokuImage,
    githubUrl: "https://github.com/codejoncode/sudoku-game",
    deploymentUrl: "https://sudoku-puzzle-game.netlify.com/",
    features:
      "Multiple Difficulty Levels,Puzzle Generation,Solution Validation,Hints System",
    technologies: ["JavaScript", "HTML5", "CSS3", "Game Logic"],
    category: "REACT",
  },
  {
    id: 16,
    title: "Symposium Platform",
    description: "Event management platform for conferences and symposiums.",
    image: symposiumImage,
    githubUrl: "https://github.com/codejoncode/symposium-platform",
    deploymentUrl: "https://symposium-platform.netlify.com/",
    features:
      "Event Management,Speaker Profiles,Schedule Management,Registration System",
    technologies: ["React", "Node", "Express", "MongoDB"],
    category: "FULLSTACK",
  },
  {
    id: 17,
    title: "UI Design Showcase",
    description: "Collection of modern UI components and design patterns.",
    image: uiDesignImage,
    githubUrl: "https://github.com/codejoncode/ui-design-showcase",
    deploymentUrl: "https://ui-design-showcase.netlify.com/",
    features:
      "Component Library,Design Patterns,Interactive Examples,Responsive Design",
    technologies: ["React", "Styled Components", "Storybook", "Design Systems"],
    category: "REACT",
  },
  {
    id: 18,
    title: "Larkist - AI-Powered Anti-Bullying Platform",
    description:
      "AI-powered full stack application designed to detect and block online bullying while curating emotionally intelligent content lists to enhance user experience on Twitter. Transforms timelines into safe, engaging, and personalized spaces.",
    image: larkistImage,
    githubUrl: "https://github.com/codejoncode/larkist", // Update with actual GitHub URL if available
    deploymentUrl: "https://larkist.com",
    planUrl: "https://trello.com/b/larkist-project", // Update with actual project planning URL if available
    features:
      "Led end-to-end development with AI model integration for real-time sentiment analysis and timeline optimization, Managed cross-functional team of 5 software engineers and 3 data scientists, AI-Powered Bullying Detection,Real-time Sentiment Analysis,Timeline Optimization,Content Curation,Cross-functional Team Management,Mission-driven Social Media Enhancement",
    technologies: [
      "React",
      "Node.js",
      "Python",
      "AI/ML",
      "Sentiment Analysis",
      "Data Science",
      "Full Stack",
    ],
    category: "FULLSTACK",
    status: "Live & Active",
    learningOutcomes:
      "Advanced AI/ML integration, cross-functional team leadership, product strategy, UX design alignment, mission-driven development approach, real-time data processing",
  },
];

// Helper function for API requests with fallback
const makeApiRequest = async (config: any, fallbackData?: any) => {
  try {
    const response = await axios({
      ...config,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
    return response.data;
  } catch (error: any) {
    console.warn("API request failed:", error.message);

    if (
      fallbackData &&
      (error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT" ||
        error.response?.status >= 500 ||
        !error.response ||
        error.message.includes("CORS") ||
        error.message.includes("Access-Control-Allow-Origin") ||
        error.name === "AxiosError")
    ) {
      console.log("Using fallback data due to API unavailability");
      return fallbackData;
    }
    throw error;
  }
};

// Action Creators
export const fetchProjects = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_PROJECTS_START });

  try {
    console.log("Fetching projects from API...");

    const projects = await makeApiRequest(
      {
        method: "GET",
        url: API_URL,
      },
      mockProjects,
    );

    console.log("Successfully fetched projects:", projects.length, "projects");
    dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: projects });
  } catch (error: any) {
    dispatch({
      type: FETCH_PROJECTS_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch projects",
    });
  }
};

export const fetchOneProject = (id: number) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ONE_PROJECT_START });

  try {
    console.log(`Fetching project with ID: ${id}`);

    const project = await makeApiRequest({
      method: "GET",
      url: `${API_URL}/${id}`,
    });

    if (project) {
      dispatch({ type: FETCH_ONE_PROJECT_SUCCESS, payload: project });
    } else {
      // Fallback to mock data
      const mockProject = mockProjects.find((p) => p.id === id);
      if (mockProject) {
        console.log("Using mock data for project:", id);
        dispatch({ type: FETCH_ONE_PROJECT_SUCCESS, payload: mockProject });
      } else {
        dispatch({
          type: FETCH_ONE_PROJECT_FAILURE,
          payload: "Project not found",
        });
      }
    }
  } catch (error: any) {
    // Try to find in mock data as fallback
    const mockProject = mockProjects.find((p) => p.id === id);
    if (mockProject) {
      console.log("API failed, using mock data for project:", id);
      dispatch({ type: FETCH_ONE_PROJECT_SUCCESS, payload: mockProject });
    } else {
      dispatch({
        type: FETCH_ONE_PROJECT_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch project",
      });
    }
  }
};

// Optional: Get projects by category
export const fetchProjectsByCategory =
  (category: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PROJECTS_START });

    try {
      console.log(`Fetching projects for category: ${category}`);

      const projects = await makeApiRequest(
        {
          method: "GET",
          url: `${API_URL}?category=${category}`,
        },
        mockProjects.filter((p) => p.category === category.toUpperCase()),
      );

      dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: projects });
    } catch (error: any) {
      dispatch({
        type: FETCH_PROJECTS_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch projects",
      });
    }
  };

// Optional: Search projects
export const searchProjects = (query: string) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_PROJECTS_START });

  try {
    console.log(`Searching projects for: ${query}`);

    const projects = await makeApiRequest(
      {
        method: "GET",
        url: `${API_URL}?search=${encodeURIComponent(query)}`,
      },
      mockProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.technologies.some((tech) =>
            tech.toLowerCase().includes(query.toLowerCase()),
          ),
      ),
    );

    dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: projects });
  } catch (error: any) {
    dispatch({
      type: FETCH_PROJECTS_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to search projects",
    });
  }
};

// Optional: Refresh projects function
export const refreshProjects = () => async (dispatch: Dispatch) => {
  console.log("Refreshing projects...");
  dispatch(fetchProjects() as any);
};

// Export action types for reducer
export const PROJECT_ACTION_TYPES = {
  FETCH_PROJECTS_START,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  FETCH_ONE_PROJECT_START,
  FETCH_ONE_PROJECT_SUCCESS,
  FETCH_ONE_PROJECT_FAILURE,
};
