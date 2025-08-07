import { BlogState, Blog } from "../../types";

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

// Action Interfaces
interface FetchBlogsStartAction {
  type: typeof FETCH_BLOGS_START;
}

interface FetchBlogsSuccessAction {
  type: typeof FETCH_BLOGS_SUCCESS;
  payload: Blog[];
}

interface FetchBlogsFailureAction {
  type: typeof FETCH_BLOGS_FAILURE;
  payload: string;
}

interface FetchOneBlogStartAction {
  type: typeof FETCH_ONE_BLOG_START;
}

interface FetchOneBlogSuccessAction {
  type: typeof FETCH_ONE_BLOG_SUCCESS;
  payload: Blog;
}

interface FetchOneBlogFailureAction {
  type: typeof FETCH_ONE_BLOG_FAILURE;
  payload: string;
}

interface PostBlogSuccessAction {
  type: typeof POST_BLOG_SUCCESS;
  payload: Blog;
}

interface EditBlogSuccessAction {
  type: typeof EDIT_BLOG_SUCCESS;
  payload: Blog;
}

interface DeleteBlogSuccessAction {
  type: typeof DELETE_BLOG_SUCCESS;
  payload: number;
}

type BlogActionTypes =
  | FetchBlogsStartAction
  | FetchBlogsSuccessAction
  | FetchBlogsFailureAction
  | FetchOneBlogStartAction
  | FetchOneBlogSuccessAction
  | FetchOneBlogFailureAction
  | PostBlogSuccessAction
  | EditBlogSuccessAction
  | DeleteBlogSuccessAction;

// Initial State
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
};

// Reducer
const blogReducer = (
  state = initialState,
  action: BlogActionTypes,
): BlogState => {
  switch (action.type) {
    case FETCH_BLOGS_START:
    case FETCH_ONE_BLOG_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BLOGS_SUCCESS:
      return {
        ...state,
        blogs: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ONE_BLOG_SUCCESS:
      return {
        ...state,
        currentBlog: action.payload,
        loading: false,
        error: null,
      };
    case POST_BLOG_SUCCESS:
      return {
        ...state,
        blogs: [...state.blogs, action.payload],
        loading: false,
        error: null,
      };
    case EDIT_BLOG_SUCCESS:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog,
        ),
        currentBlog: action.payload,
        loading: false,
        error: null,
      };
    case DELETE_BLOG_SUCCESS:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.id !== action.payload),
        loading: false,
        error: null,
      };
    case FETCH_BLOGS_FAILURE:
    case FETCH_ONE_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default blogReducer;
