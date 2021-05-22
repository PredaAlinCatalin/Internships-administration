import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchInternships = createAsyncThunk(
  "Internships/fetchInternships",
  async () => {
    const response = await axios.get("api/Internships");
    console.log(response.data);
    return response.data;
  }
);

export const addInternship = createAsyncThunk(
  "Internships/addInternship",
  async (internship) => {
    const response = await axios.post("api/Internships", internship);
    return response.data;
  }
);

export const deleteInternship = createAsyncThunk(
  "Internships/deleteInternship",
  async (internshipId) => {
    const url = "api/Internships/" + internshipId;
    const response = await axios.delete(url);
    return response.data;
  }
);

const InternshipsSlice = createSlice({
  name: "Internships",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchInternships.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchInternships.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchInternships.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addInternship.fulfilled]: (state, action) => {
      state.items.push(action.payload);
    },
    [deleteInternship.fulfilled]: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export default InternshipsSlice.reducer;

export const selectAllInternships = (state) => state.internships.items;
