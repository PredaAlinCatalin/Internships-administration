import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchStudentAptitudes = createAsyncThunk(
  "studentAptitudes/fetchStudentAptitudes",
  async (studentId) => {
    const response = await axios.get("api/studentAptitudes/student/" + studentId);
    return response.data;
  }
);

export const addStudentAptitude = createAsyncThunk(
  "studentAptitudes/addStudentAptitude",
  async (studentAptitude) => {
    const response = await axios.post("api/studentAptitudes", studentAptitude);
    return response.data;
  }
);

export const deleteStudentAptitude = createAsyncThunk(
  "studentAptitudes/deleteStudentAptitude",
  async (studentAptitude) => {
    const url =
      "api/studentAptitudes/student/" +
      studentAptitude.studentId +
      "/aptitude/" +
      studentAptitude.aptitudeId;
    const response = await axios.delete(url);
    return response.data;
  }
);

const studentAptitudesSlice = createSlice({
  name: "studentAptitudes",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStudentAptitudes.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchStudentAptitudes.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchStudentAptitudes.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addStudentAptitude.fulfilled]: (state, action) => {
      state.items.push(action.payload);
    },
    [deleteStudentAptitude.fulfilled]: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.aptitudeId === action.payload.aptitudeId &&
            item.studentId === action.payload.studentId
          )
      );
    },
  },
});

export default studentAptitudesSlice.reducer;

export const selectAllStudentAptitudes = (state) => state.studentAptitudes.items;
