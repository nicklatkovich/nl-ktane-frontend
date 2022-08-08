import axios from "axios";
import { BACKEND_URL } from "../constants/backend";
import { MissionDTO, MissionListDTO } from "../dtos";

export async function getMissionList(): Promise<MissionListDTO> {
  return axios(`${BACKEND_URL}/mission/list`).then((res) => res.data.result);
}

export async function getMission(id: string): Promise<MissionDTO> {
  return axios(`${BACKEND_URL}/mission/${id}`).then((res) => res.data.result);
}
