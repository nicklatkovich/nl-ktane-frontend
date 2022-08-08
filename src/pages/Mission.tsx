import {
  BombInfo,
  CompletionType,
  CompletionVerification,
  getCompleters,
  getMissionModules,
  getPoolCount,
  getPoolModules,
  getSolveType,
  isGlobalStrikes,
  isGlobalTime,
  MissionInfo,
  missionToBombs,
  NotGStrikesType,
  NotGTimeType,
} from "nl-ktane-lib";
import React, { useEffect } from "react";
import { useParams } from "react-router";

import { loadMission, missionsSelectors, MissionState } from "../modules/missions.module";
import { useAppDispatch, useAppSelector } from "../store";
import { elOrArrToArr, MergeUnion, strOrArrToString, timeToString } from "../utils";

import "../styles/mission-page.scss";
import { repoSelectors, RepoStatus } from "../modules";
import { ExternalLink } from "../components/ExternalLink";
import { Link } from "react-router-dom";

export const MissionPage: React.FC = () => {
  const { id } = useParams();

  if (id === undefined) {
    throw new Error("id param is undefined");
  }

  const mission = useAppSelector(missionsSelectors.getMission(id));
  const repoStatus = useAppSelector(repoSelectors.getStatus);
  const repoModules = useAppSelector(repoSelectors.getModules);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadMission(id));
  }, [dispatch, id]);

  if (!mission || mission === MissionState.NONE || mission === MissionState.LOADING) return <div>Loading...</div>;
  if (mission === MissionState.NOT_FOUND) return <div>Mission not found</div>;
  if (repoStatus === RepoStatus.ERROR) return <div>Unable to load data from ktane.timwi.de</div>;
  if (repoStatus !== RepoStatus.LOADED) return <div>Loading data from ktane.timwi.de ...</div>;

  const missionInfo = { ...mission, missionPack: mission.missionPack.name } as MissionInfo;
  const bombs = missionToBombs(missionInfo);
  const globalTime: number | null = isGlobalTime(missionInfo)
    ? missionInfo.time
    : bombs.length === 1
    ? (bombs[0] as BombInfo<NotGTimeType>).time
    : null;
  const globalStrikes: number | null = isGlobalStrikes(missionInfo)
    ? missionInfo.strikes
    : bombs.length === 1
    ? (bombs[0] as BombInfo<NotGStrikesType>).strikes
    : null;
  const modules = [...getMissionModules(missionInfo)].map((mId) => repoModules[mId]?.Name ?? mId).sort();
  const maxCompletersCount = mission.completions?.reduce((acc, c) => Math.max(acc, getCompleters(c).length), 0) ?? 0;

  return (
    <>
      <Link to="/missions" className="button">
        Back
      </Link>
      <div className="mission-page">
        <div className="title">{mission.name}</div>
        <div>
          Pack:&#160;
          <b>
            <ExternalLink
              href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mission.missionPack.steamId}`}
            >
              {mission.missionPack.name}
            </ExternalLink>
          </b>
        </div>
        <div>
          Author: <b>{strOrArrToString(mission.author || mission.missionPack.author)}</b>
        </div>
        <table>
          <thead>
            <tr>
              {bombs.length > 1 ? <td>Bomb #</td> : null}
              <td>Modules</td>
              <td>Time</td>
              <td>Strikes</td>
              <td>Widgets</td>
            </tr>
          </thead>
          <tbody>
            {bombs.map((bomb, index) => (
              <tr key={index}>
                {bombs.length > 1 ? <td>{index + 1}</td> : null}
                <td>{bomb.modules.length}</td>
                {globalTime ? (
                  index === 0 ? (
                    <td rowSpan={bombs.length}>{timeToString(globalTime)}</td>
                  ) : null
                ) : (
                  <td>{timeToString((bomb as BombInfo<NotGTimeType>).time)}</td>
                )}
                {globalStrikes ? (
                  index === 0 ? (
                    <td rowSpan={bombs.length}>{globalStrikes}</td>
                  ) : null
                ) : (
                  <td>{(bomb as BombInfo<NotGStrikesType>).strikes}</td>
                )}
                <td>{bomb.widgets}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="columns">
          <div>
            <div className="title">Modules</div>
            <table>
              <tbody>
                {modules.map((m) => (
                  <tr key={m}>
                    <td>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="title">Completions</div>
            {mission.solvedByTP ? <div>Solved by TP</div> : null}
            {mission.completions ? (
              <table>
                <thead>
                  <tr>
                    <td>Proof</td>
                    <td>Time</td>
                    <td>Defuser</td>
                    {maxCompletersCount > 1 ? <td colSpan={maxCompletersCount - 1}>Experts</td> : null}
                  </tr>
                </thead>
                <tbody>
                  {mission.completions.map((completion, index) => {
                    const completers = getCompleters(completion);
                    const verification: MergeUnion<CompletionVerification> = completion;
                    const type = getSolveType(completion);
                    const logVerification = verification.log ? (
                      <ExternalLink href={`https://ktane.timwi.de/More/Logfile%20Analyzer.html#${verification.log}`}>
                        Log
                      </ExternalLink>
                    ) : null;
                    return (
                      <tr key={index}>
                        <td>
                          {verification.vid ? (
                            <>
                              {elOrArrToArr(verification.vid).map((link, ind) => (
                                <>
                                  <ExternalLink key={ind} href={link}>
                                    Vid
                                    {Array.isArray(verification.vid) && verification.vid.length > 1
                                      ? ` #${ind + 1}`
                                      : ""}
                                  </ExternalLink>
                                  {Array.isArray(verification.vid) && verification.vid.length > ind + 1 ? <br /> : null}
                                </>
                              ))}
                              {logVerification ? (
                                <>
                                  <br />
                                  {logVerification}
                                </>
                              ) : null}
                            </>
                          ) : verification.log ? (
                            <ExternalLink
                              href={`https://ktane.timwi.de/More/Logfile%20Analyzer.html#${verification.log}`}
                            >
                              Log
                            </ExternalLink>
                          ) : verification.scr ? (
                            <ExternalLink href={verification.scr}>Scr</ExternalLink>
                          ) : (
                            <div>Igl</div>
                          )}
                        </td>
                        <td className={completion.isFirst ? "first" : ""}>{timeToString(completion.time)}</td>
                        {completers.map((name, ind) => (
                          <td
                            key={name}
                            className={
                              type === CompletionType.SOLO
                                ? "soloer"
                                : type === CompletionType.EFM
                                ? "efmer"
                                : ind === 0
                                ? "defuser"
                                : "expert"
                            }
                          >
                            {name}
                          </td>
                        ))}
                        {completers.length < maxCompletersCount ? (
                          <td colSpan={maxCompletersCount - completers.length} />
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
          </div>
          <div>
            <div className="title">Module Pools</div>
            {bombs.map((bomb, ind) => (
              <div key={ind}>
                {bombs.length > 1 ? <div>Bomb #{ind + 1}</div> : null}
                <table>
                  <tbody>
                    {bomb.modules.map((pool, ind) => (
                      <tr key={ind}>
                        <td>
                          [{getPoolModules(pool).join(", ")}] Count: {getPoolCount(pool)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
