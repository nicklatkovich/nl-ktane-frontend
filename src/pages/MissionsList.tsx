import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { missionsActions, missionsSelectors } from "../modules/missions.module";
import { useAppDispatch, useAppSelector } from "../store";
import "../styles/missions-list-page.scss";
import { timeToString } from "../utils";

export const MissionsListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const missions = useAppSelector(missionsSelectors.getMissionList);
  const searchString = useAppSelector(missionsSelectors.getSearchString);
  const total = useAppSelector(missionsSelectors.getTotal);
  useEffect(() => {
    dispatch(missionsActions.updateList());
  }, [dispatch]);
  return (
    <div className="missions-list-page">
      <div className="search-block">
        <label>Search:&#160;</label>
        <input
          type="text"
          value={searchString}
          onChange={(event) => dispatch(missionsActions.setSearchString(event.target.value))}
        ></input>
        <label className="button delete" onClick={() => dispatch(missionsActions.setSearchString(""))}>X</label>
      </div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Pack</td>
            <td>Author</td>
            <td>Modules</td>
            <td>Time</td>
            <td>
              Completers /<br />
              Completions
            </td>
            <td>Team Solve</td>
            <td>EFM Solve</td>
            <td>TP Solve</td>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr key={mission.id}>
              <td>
                <Link to={`/mission/${mission.id}`}>{mission.name}</Link>
              </td>
              <td>
                <a href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mission.pack.steamId}`}>
                  {mission.pack.name}
                </a>
              </td>
              <td>{mission.author}</td>
              <td>{mission.modules}</td>
              <td>{timeToString(mission.time)}</td>
              <td>
                {mission.completers} / {mission.complitions}
              </td>
              <td>{mission.teamSolve ? "+" : ""}</td>
              <td>{mission.efmSolve ? "+" : ""}</td>
              <td>{mission.tpSolve ? "+" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bottom">{total} items</div>
    </div>
  );
};
