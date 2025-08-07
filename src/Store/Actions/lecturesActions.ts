import { Dispatch } from "redux";
import axios from "axios";
import { Lecture } from "../../types";

// Action Types
const FETCH_LECTURES_START = "FETCH_LECTURES_START";
const FETCH_LECTURES_SUCCESS = "FETCH_LECTURES_SUCCESS";
const FETCH_LECTURES_FAILURE = "FETCH_LECTURES_FAILURE";

// API endpoint
const API_URL = "https://jonathan-holloway-be.onrender.com/lectures";

// Mock data as fallback for development/backup
const mockLectures: Lecture[] = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    url: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
    description:
      "Learn the basics of React Hooks and how they can simplify your components.",
  },
  {
    id: 2,
    title: "Advanced State Management",
    url: "https://www.youtube.com/watch?v=35lXWvCuM8o",
    description:
      "Deep dive into advanced state management patterns in React applications.",
  },
  {
    id: 3,
    title: "TypeScript with React",
    url: "https://www.youtube.com/watch?v=Z5iWr6Srsj8",
    description:
      "How to effectively use TypeScript in your React projects for better type safety.",
  },
  {
    id: 4,
    title: "Testing React Components",
    url: "https://www.youtube.com/watch?v=8Xwq35cPwYg",
    description:
      "Best practices for testing React components using Jest and React Testing Library.",
  },
  {
    id: 5,
    title: "Performance Optimization",
    url: "https://www.youtube.com/watch?v=8pDqJVdNa44",
    description:
      "Techniques for optimizing React application performance and avoiding common pitfalls.",
  },
];

// Action Creators
export const fetchLectures = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_LECTURES_START });

  try {
    console.log("Attempting to fetch lectures from API...");

    // Try to fetch from your API first
    const response = await axios.get(API_URL, {
      timeout: 10000, // 10 second timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Successfully fetched lectures from API:", response.data);
    dispatch({
      type: FETCH_LECTURES_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    console.warn("API fetch failed, falling back to mock data:", error.message);

    // Check if it's a network error or server error
    if (
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500 ||
      !error.response
    ) {
      console.log("Using fallback mock data due to API unavailability");

      // Use mock data as fallback
      dispatch({
        type: FETCH_LECTURES_SUCCESS,
        payload: mockLectures,
      });

      // Optionally show a warning to the user that offline data is being used
      console.warn("Using offline data - API temporarily unavailable");
    } else {
      // For other errors (like 400, 401, 403), dispatch failure
      dispatch({
        type: FETCH_LECTURES_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lectures",
      });
    }
  }
};

// Optional: Action to refresh lectures (useful for retry functionality)
export const refreshLectures = () => async (dispatch: Dispatch) => {
  console.log("Refreshing lectures...");
  dispatch(fetchLectures() as any);
};

// Export action types for reducer
export const LECTURES_ACTION_TYPES = {
  FETCH_LECTURES_START,
  FETCH_LECTURES_SUCCESS,
  FETCH_LECTURES_FAILURE,
};
