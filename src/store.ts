import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { createHashHistory } from "history";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { missionsReducer } from "./modules/missions.module";
import { repoReducer } from "./modules/repo.module";

export const history = createHashHistory();

export const store = configureStore({
  reducer: {
    router: connectRouter(history),
    missions: missionsReducer,
    repo: repoReducer,
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
