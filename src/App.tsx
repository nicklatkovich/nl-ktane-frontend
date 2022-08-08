import React, { useEffect } from "react";
import { Route, Routes } from "react-router";

import { repoActions, repoSelectors, RepoStatus } from "./modules";
import { HomePage, MissionsListPage, MissionPage } from "./pages";
import { useAppDispatch, useAppSelector } from "./store";

import "./styles/App.scss";

export const AppComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const repoStatus = useAppSelector(repoSelectors.getStatus);
  useEffect(() => { if (repoStatus === RepoStatus.INITIAL) dispatch(repoActions.load()); }, [dispatch, repoStatus]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/missions" element={<MissionsListPage />} />
        <Route path="/mission/:id" element={<MissionPage />} />
        <Route path="*" element={<div>(Not Found)</div>} />
      </Routes>
    </div>
  );
};
