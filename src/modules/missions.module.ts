import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { MissionDTO, MissionListItemDTO } from "../dtos";
import { getMission, getMissionList } from "../services";
import { RootState } from "../store";

export enum MissionState {
  NONE = "NONE",
  LOADING = "LOADING",
  NOT_FOUND = "NOT_FOUND",
}

export interface MissionsState {
  loading?: boolean;
  total?: number;
  list?: MissionListItemDTO[];
  displayedList?: MissionListItemDTO[];
  map: { [id: string]: MissionState | MissionDTO };
  lastRequestId?: string;
  searchString: string;
}

const initialState: MissionsState = { map: {}, searchString: "" };

const updateDisplayedList = (state: MissionsState) => {
  if (!state.searchString) state.displayedList = state.list;
  else {
    const searchSplit = state.searchString.toLowerCase().split(" ");
    state.displayedList = state.list?.filter((mission) => {
      const name = mission.name.toLowerCase();
      return searchSplit.every((subStr) => name.includes(subStr));
    });
  }
};

export const missionsSlice = createSlice({
  name: "missions",
  initialState,
  reducers: {
    updateDisplayedList,
    setSearchString: (state, { payload }) => {
      state.searchString = payload;
      updateDisplayedList(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateList.pending, (state, { meta }) => {
      state.loading = true;
      state.lastRequestId = meta.requestId;
    });
    builder.addCase(updateList.fulfilled, (state, { payload, meta }) => {
      if (meta.requestId !== state.lastRequestId) return;
      state.list = payload.result;
      state.total = payload.count;
      state.loading = false;
      updateDisplayedList(state);
    });
    builder.addCase(loadMission.pending, (state, { meta }) => {
      const id = meta.arg;
      if (state.map[id] === MissionState.NONE) state.map[id] = MissionState.LOADING;
    });
    builder.addCase(loadMission.fulfilled, (state, { meta, payload }) => {
      const id = meta.arg;
      state.map[id] = payload;
    });
  },
});

export const updateList = createAsyncThunk("missions/updateList", async () => getMissionList());

export const loadMission = createAsyncThunk("missions/loadMission", async (id: string) => getMission(id), {
  condition: (id, { getState }) => {
    const mission = (getState() as RootState).missions.map[id];
    return !mission || mission === MissionState.NONE;
  },
});

export const missionsSelectors = {
  getMissionList: (state: RootState) => state.missions.displayedList ?? [],
  getTotal: (state: RootState) => state.missions.total,
  isLoading: (state: RootState) => state.missions.loading,
  getMission: (id: string) => (state: RootState) => state.missions.map[id],
  getSearchString: (state: RootState) => state.missions.searchString,
};

export const missionsActions = { ...missionsSlice.actions, updateList, loadMission };
export const missionsReducer = missionsSlice.reducer;
