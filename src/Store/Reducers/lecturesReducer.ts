import { LectureState, Lecture } from "../../types";

// Action Types
const FETCH_LECTURES_START = "FETCH_LECTURES_START";
const FETCH_LECTURES_SUCCESS = "FETCH_LECTURES_SUCCESS";
const FETCH_LECTURES_FAILURE = "FETCH_LECTURES_FAILURE";

// Action Interfaces
interface FetchLecturesStartAction {
  type: typeof FETCH_LECTURES_START;
}

interface FetchLecturesSuccessAction {
  type: typeof FETCH_LECTURES_SUCCESS;
  payload: Lecture[];
}

interface FetchLecturesFailureAction {
  type: typeof FETCH_LECTURES_FAILURE;
  payload: string;
}

type LectureActionTypes =
  | FetchLecturesStartAction
  | FetchLecturesSuccessAction
  | FetchLecturesFailureAction;

// Initial State
const initialState: LectureState = {
  lectures: [],
  loading: false,
  error: null,
};

// Reducer
const lecturesReducer = (
  state = initialState,
  action: LectureActionTypes,
): LectureState => {
  switch (action.type) {
    case FETCH_LECTURES_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_LECTURES_SUCCESS:
      return {
        ...state,
        lectures: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_LECTURES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default lecturesReducer;
