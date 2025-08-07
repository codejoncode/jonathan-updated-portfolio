import { Dispatch } from "redux";
import axios from "axios";
import { Blog } from "../../types";

// Action Types
const FETCH_BLOGS_START = "FETCH_BLOGS_START";
const FETCH_BLOGS_SUCCESS = "FETCH_BLOGS_SUCCESS";
const FETCH_BLOGS_FAILURE = "FETCH_BLOGS_FAILURE";
const FETCH_ONE_BLOG_START = "FETCH_ONE_BLOG_START";
const FETCH_ONE_BLOG_SUCCESS = "FETCH_ONE_BLOG_SUCCESS";
const FETCH_ONE_BLOG_FAILURE = "FETCH_ONE_BLOG_FAILURE";
const POST_BLOG_SUCCESS = "POST_BLOG_SUCCESS";
const EDIT_BLOG_SUCCESS = "EDIT_BLOG_SUCCESS";
const DELETE_BLOG_SUCCESS = "DELETE_BLOG_SUCCESS";

// API endpoints
const API_BASE_URL = "https://jonathan-holloway.herokuapp.com";
const BLOGS_URL = `${API_BASE_URL}/blogs`;

// Mock data for development/fallback
const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    message:
      "React Hooks have revolutionized the way we write React components...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/images/react-hooks.png",
    createdAt: "2023-01-15",
    updatedAt: "2023-01-15",
  },
  {
    id: 2,
    title: "TypeScript Best Practices",
    message:
      "TypeScript provides excellent type safety for JavaScript applications...Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/typescript.png",
    createdAt: "2023-02-10",
    updatedAt: "2023-02-10",
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    message:
      "Learn how to structure and organize your React applications for maximum scalability and maintainability...",
    image: "/images/react-architecture.png",
    createdAt: "2023-03-05",
    updatedAt: "2023-03-05",
  },
  {
    id: 4,
    title: "Modern State Management Patterns",
    message:
      "Exploring different state management solutions and when to use each one in your React applications...",
    image: "/images/state-management.png",
    createdAt: "2023-03-20",
    updatedAt: "2023-03-20",
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
        !error.response)
    ) {
      console.log("Using fallback data due to API unavailability");
      return fallbackData;
    }
    throw error;
  }
};

// Action Creators
export const fetchBlogs = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_BLOGS_START });

  try {
    console.log("Fetching blogs from API...");

    const blogs = await makeApiRequest(
      {
        method: "GET",
        url: BLOGS_URL,
      },
      mockBlogs,
    );

    console.log("Successfully fetched blogs:", blogs.length, "blogs");
    dispatch({ type: FETCH_BLOGS_SUCCESS, payload: blogs });
  } catch (error: any) {
    dispatch({
      type: FETCH_BLOGS_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch blogs",
    });
  }
};

export const fetchOneBlog = (id: number) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ONE_BLOG_START });

  try {
    console.log(`Fetching blog with ID: ${id}`);

    const blog = await makeApiRequest({
      method: "GET",
      url: `${BLOGS_URL}/${id}`,
    });

    if (blog) {
      dispatch({ type: FETCH_ONE_BLOG_SUCCESS, payload: blog });
    } else {
      // Fallback to mock data
      const mockBlog = mockBlogs.find((b) => b.id === id);
      if (mockBlog) {
        console.log("Using mock data for blog:", id);
        dispatch({ type: FETCH_ONE_BLOG_SUCCESS, payload: mockBlog });
      } else {
        dispatch({
          type: FETCH_ONE_BLOG_FAILURE,
          payload: "Blog not found",
        });
      }
    }
  } catch (error: any) {
    // Try to find in mock data as fallback
    const mockBlog = mockBlogs.find((b) => b.id === id);
    if (mockBlog) {
      console.log("API failed, using mock data for blog:", id);
      dispatch({ type: FETCH_ONE_BLOG_SUCCESS, payload: mockBlog });
    } else {
      dispatch({
        type: FETCH_ONE_BLOG_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch blog",
      });
    }
  }
};

export const postBlog =
  (token: string, blogData: Partial<Blog>) => async (dispatch: Dispatch) => {
    try {
      console.log("Creating new blog...");

      const newBlog = await makeApiRequest({
        method: "POST",
        url: BLOGS_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: blogData,
      });

      dispatch({ type: POST_BLOG_SUCCESS, payload: newBlog });
      console.log("Blog created successfully:", newBlog.id);
    } catch (error: any) {
      // For write operations, don't use fallback data
      dispatch({
        type: FETCH_BLOGS_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to create blog",
      });
    }
  };

export const editBlog =
  (id: number, token: string, blogData: Partial<Blog>) =>
  async (dispatch: Dispatch) => {
    try {
      console.log(`Editing blog with ID: ${id}`);

      const updatedBlog = await makeApiRequest({
        method: "PUT",
        url: `${BLOGS_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: blogData,
      });

      dispatch({ type: EDIT_BLOG_SUCCESS, payload: updatedBlog });
      console.log("Blog updated successfully:", id);
    } catch (error: any) {
      dispatch({
        type: FETCH_BLOGS_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to edit blog",
      });
    }
  };

export const deleteBlog =
  (token: string, id: number) => async (dispatch: Dispatch) => {
    try {
      console.log(`Deleting blog with ID: ${id}`);

      await makeApiRequest({
        method: "DELETE",
        url: `${BLOGS_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: DELETE_BLOG_SUCCESS, payload: id });
      console.log("Blog deleted successfully:", id);
    } catch (error: any) {
      dispatch({
        type: FETCH_BLOGS_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete blog",
      });
    }
  };

// Optional: Refresh blogs function
export const refreshBlogs = () => async (dispatch: Dispatch) => {
  console.log("Refreshing blogs...");
  dispatch(fetchBlogs() as any);
};

// Export action types for reducer
export const BLOG_ACTION_TYPES = {
  FETCH_BLOGS_START,
  FETCH_BLOGS_SUCCESS,
  FETCH_BLOGS_FAILURE,
  FETCH_ONE_BLOG_START,
  FETCH_ONE_BLOG_SUCCESS,
  FETCH_ONE_BLOG_FAILURE,
  POST_BLOG_SUCCESS,
  EDIT_BLOG_SUCCESS,
  DELETE_BLOG_SUCCESS,
};
