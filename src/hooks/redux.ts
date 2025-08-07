import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../Store/Reducers/rootReducer";
import type { AppDispatch } from "../index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
