// Updated Project Actions using the new image mapping structure
import { Dispatch } from "redux";
import axios from "axios";
import { Project } from "../../types";

// Import the new data structures
import {
  projectGalleryData,
  GalleryProject,
} from "../../assets/data/projectGalleryData";
import { getProjectImage } from "../../assets/data/projectImageMap";

// Action Types
const FETCH_PROJECTS_START = "FETCH_PROJECTS_START";
const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";
const FETCH_ONE_PROJECT_START = "FETCH_ONE_PROJECT_START";
const FETCH_ONE_PROJECT_SUCCESS = "FETCH_ONE_PROJECT_SUCCESS";
const FETCH_ONE_PROJECT_FAILURE = "FETCH_ONE_PROJECT_FAILURE";

// Convert GalleryProject to Project type for compatibility
const convertGalleryToProject = (galleryProject: GalleryProject): Project => ({
  id: parseInt(galleryProject.id) || 0,
  title: galleryProject.name,
  description: galleryProject.description,
  image: galleryProject.image,
  gifPlay: galleryProject.gifPlay,
  githubUrl: galleryProject.githubUrl || "",
  deploymentUrl: galleryProject.deploymentUrl,
  planUrl: galleryProject.planUrl,
  features: galleryProject.features.join(","),
  technologies: galleryProject.technologies,
  category: galleryProject.category as "REACT" | "FULLSTACK" | "BACKEND",
  // Additional fields from GalleryProject that match Project interface
  status: galleryProject.status as
    | "Live & Active"
    | "Code Showcase"
    | "Backend Focus"
    | "Full-Stack Demo"
    | "Advanced Features",
  technicalFocus: galleryProject.technicalFocus,
  learningOutcomes: galleryProject.learningOutcomes.join(", "),
});

// Convert gallery data to compatible project format
const mockProjects: Project[] = projectGalleryData.map(convertGalleryToProject);

// API endpoint
const API_URL = "https://jonathan-holloway.herokuapp.com/projects";

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

// Optional: Get projects by category using the new helper functions
export const fetchProjectsByCategory =
  (category: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PROJECTS_START });

    try {
      console.log(`Fetching projects for category: ${category}`);

      const filteredGalleryProjects = projectGalleryData.filter(
        (p) => p.category === category.toUpperCase(),
      );
      const filteredProjects = filteredGalleryProjects.map(
        convertGalleryToProject,
      );

      const projects = await makeApiRequest(
        {
          method: "GET",
          url: `${API_URL}?category=${category}`,
        },
        filteredProjects,
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

// Helper function to get project image by key
export const getProjectImageByKey = (key: string): string | null => {
  return getProjectImage(key);
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

// Export the enhanced mock projects for direct use
export { mockProjects, projectGalleryData };
