import { combineReducers } from "redux";
import projectReducer from "./projectReducer";
import blogReducer from "./blogReducer";
import lecturesReducer from "./lecturesReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  projectReducer,
  blogReducer,
  lecturesReducer,
  authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
