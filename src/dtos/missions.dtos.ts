import { ElOrArr, MissionInfo, MissionType } from "nl-ktane-lib";

export interface MissionPackDTO {
  name: string;
  steamId: number;
  author: ElOrArr<string>;
}

export interface MissionListItemDTO {
  id: string;
  name: string;
  pack: MissionPackDTO;
  author: ElOrArr<string> | null;
  modules: number;
  time: number;
  teamSolve: boolean;
  efmSolve: boolean;
  tpSolve: boolean;
  completers: number;
  complitions: number;
}

export interface MissionListDTO {
  count: number;
  result: MissionListItemDTO[];
}

export type MissionDTO<T extends MissionType = MissionType> = T extends any
  ? Omit<MissionInfo<T>, "missionPack"> & { missionPack: MissionPackDTO }
  : never;
