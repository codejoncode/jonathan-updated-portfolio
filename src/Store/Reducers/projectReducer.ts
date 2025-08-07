import { ProjectState, Project } from "../../types";

// Action Types
const FETCH_PROJECTS_START = "FETCH_PROJECTS_START";
const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";
const FETCH_ONE_PROJECT_START = "FETCH_ONE_PROJECT_START";
const FETCH_ONE_PROJECT_SUCCESS = "FETCH_ONE_PROJECT_SUCCESS";
const FETCH_ONE_PROJECT_FAILURE = "FETCH_ONE_PROJECT_FAILURE";

// Action Interfaces
interface FetchProjectsStartAction {
  type: typeof FETCH_PROJECTS_START;
}

interface FetchProjectsSuccessAction {
  type: typeof FETCH_PROJECTS_SUCCESS;
  payload: Project[];
}

interface FetchProjectsFailureAction {
  type: typeof FETCH_PROJECTS_FAILURE;
  payload: string;
}

interface FetchOneProjectStartAction {
  type: typeof FETCH_ONE_PROJECT_START;
}

interface FetchOneProjectSuccessAction {
  type: typeof FETCH_ONE_PROJECT_SUCCESS;
  payload: Project;
}

interface FetchOneProjectFailureAction {
  type: typeof FETCH_ONE_PROJECT_FAILURE;
  payload: string;
}

type ProjectActionTypes =
  | FetchProjectsStartAction
  | FetchProjectsSuccessAction
  | FetchProjectsFailureAction
  | FetchOneProjectStartAction
  | FetchOneProjectSuccessAction
  | FetchOneProjectFailureAction;

// Initial State
const initialState: ProjectState = {
  projects: [],
  soloProject: null,
  loading: false,
  error: null,
};

// Reducer
const projectReducer = (
  state = initialState,
  action: ProjectActionTypes,
): ProjectState => {
  switch (action.type) {
    case FETCH_PROJECTS_START:
    case FETCH_ONE_PROJECT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ONE_PROJECT_SUCCESS:
      return {
        ...state,
        soloProject: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_PROJECTS_FAILURE:
    case FETCH_ONE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default projectReducer;
