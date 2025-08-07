// Project Image Mapping
// This file creates a key-value mapping of project names to their images

// Import all project images
import eventsApp from "../../Images/events-app-fleek-session.png";
import basketballLeague from "../../Images/basketballLeague.png";
import calculator from "../../Images/calculatorComponents.png";
import conwaysGame from "../../Images/conwaysGame.png";
import forexLanding from "../../Images/forexLandingPage.png";
import lambdaTreasure from "../../Images/Lambda Treasure Hunt.png";
import lambdaMud from "../../Images/lambdaMud.png";
import lambdaTimes from "../../Images/lambdaTimes.png";
import noteTaking from "../../Images/noteTakingApp.png";
import reactWars from "../../Images/reactWars.png";
import simpleCalendar from "../../Images/simpleCalendarApp.png";
import todoList from "../../Images/simpleTodList.png";
import socialCard from "../../Images/socialCard.png";
import sudoku from "../../Images/sudoku.png";
import symposium from "../../Images/Symposium.png";
import uiDesign from "../../Images/ui design.png";

// Image mapping interface
export interface ProjectImageMap {
  [key: string]: {
    name: string;
    image: string;
    category: string;
    type: "web-app" | "mobile-app" | "game" | "tool" | "api" | "ui-design";
  };
}

// Project image key-value mapping
export const projectImageMap: ProjectImageMap = {
  "events-app": {
    name: "Events App",
    image: eventsApp,
    category: "REACT",
    type: "web-app",
  },
  "basketball-league": {
    name: "Basketball League Manager",
    image: basketballLeague,
    category: "REACT",
    type: "web-app",
  },
  "calculator-components": {
    name: "Calculator Components",
    image: calculator,
    category: "REACT",
    type: "tool",
  },
  "conways-game": {
    name: "Conway's Game of Life",
    image: conwaysGame,
    category: "JAVASCRIPT",
    type: "game",
  },
  "forex-landing": {
    name: "Forex Landing Page",
    image: forexLanding,
    category: "HTML/CSS",
    type: "web-app",
  },
  "lambda-treasure-hunt": {
    name: "Lambda Treasure Hunt",
    image: lambdaTreasure,
    category: "PYTHON",
    type: "game",
  },
  "lambda-mud": {
    name: "Lambda MUD",
    image: lambdaMud,
    category: "FULLSTACK",
    type: "web-app",
  },
  "lambda-times": {
    name: "Lambda Times",
    image: lambdaTimes,
    category: "JAVASCRIPT",
    type: "web-app",
  },
  "note-taking-app": {
    name: "Note Taking App",
    image: noteTaking,
    category: "FULLSTACK",
    type: "web-app",
  },
  "react-wars": {
    name: "React Wars",
    image: reactWars,
    category: "REACT",
    type: "web-app",
  },
  "simple-calendar": {
    name: "Simple Calendar App",
    image: simpleCalendar,
    category: "REACT",
    type: "web-app",
  },
  "todo-list": {
    name: "Simple Todo List",
    image: todoList,
    category: "JAVASCRIPT",
    type: "web-app",
  },
  "social-card": {
    name: "Social Card Component",
    image: socialCard,
    category: "REACT",
    type: "tool",
  },
  sudoku: {
    name: "Sudoku Game",
    image: sudoku,
    category: "JAVASCRIPT",
    type: "game",
  },
  symposium: {
    name: "Symposium Platform",
    image: symposium,
    category: "FULLSTACK",
    type: "web-app",
  },
  "ui-design": {
    name: "UI Design Showcase",
    image: uiDesign,
    category: "DESIGN",
    type: "ui-design",
  },
};

// Helper function to get image by project key
export const getProjectImage = (key: string): string | null => {
  return projectImageMap[key]?.image || null;
};

// Helper function to get all project names
export const getAllProjectNames = (): string[] => {
  return Object.values(projectImageMap).map((project) => project.name);
};

// Helper function to get projects by category
export const getProjectsByCategory = (category: string): ProjectImageMap => {
  return Object.entries(projectImageMap)
    .filter(([_, project]) => project.category === category)
    .reduce((acc, [key, project]) => {
      acc[key] = project;
      return acc;
    }, {} as ProjectImageMap);
};

// Helper function to get projects by type
export const getProjectsByType = (type: string): ProjectImageMap => {
  return Object.entries(projectImageMap)
    .filter(([_, project]) => project.type === type)
    .reduce((acc, [key, project]) => {
      acc[key] = project;
      return acc;
    }, {} as ProjectImageMap);
};
