import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchSavedInternships = createAsyncThunk(
  "savedInternships/fetchSavedInternships",
  async (studentId) => {
    const response = await axios.get("api/savedStudentInternships/student/" + studentId);
    return response.data;
  }
);

export const addSavedInternship = createAsyncThunk(
  "savedInternships/addSavedInternship",
  async (savedInternship) => {
    const response = await axios.post("api/savedStudentInternships", savedInternship);
    return response.data;
  }
);

export const deleteSavedInternship = createAsyncThunk(
  "savedInternships/deleteSavedInternship",
  async (savedInternship) => {
    const url =
      "api/savedStudentInternships/student/" +
      savedInternship.studentId +
      "/internship/" +
      savedInternship.internshipId;
    const response = await axios.delete(url);
    return response.data;
  }
);

const savedInternshipsSlice = createSlice({
  name: "savedInternships",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchSavedInternships.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchSavedInternships.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchSavedInternships.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addSavedInternship.fulfilled]: (state, action) => {
      state.items.push(action.payload);
    },
    [deleteSavedInternship.fulfilled]: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.internshipId === action.payload.internshipId &&
            item.studentId === action.payload.studentId
          )
      );
    },
  },
});

export default savedInternshipsSlice.reducer;

export const selectAllSavedInternships = (state) => state.savedInternships.items;
