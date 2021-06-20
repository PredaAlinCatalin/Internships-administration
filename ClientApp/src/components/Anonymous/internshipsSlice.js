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
    const response = await axios.get("api/internships");
    console.log(response.data);
    return response.data;
  }
);

export const addInternship = createAsyncThunk(
  "Internships/addInternship",
  async (internship) => {
    const response = await axios.post("api/internships", internship);
    return response.data;
  }
);

export const updateInternship = createAsyncThunk(
  "Internships/updateInternship",
  async (internship) => {
    const response = await axios.put("api/internships/" + internship.id, internship);
    return response.data;
  }
);

export const deleteInternship = createAsyncThunk(
  "Internships/deleteInternship",
  async (internshipId) => {
    const url = "api/internships/" + internshipId;
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
    [updateInternship.fulfilled]: (state, action) => {
      const existingInternship = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingInternship) {
        // existingInternship = {...action.payload};
        existingInternship.name = action.payload.name
        existingInternship.startDate = action.payload.startDate
        existingInternship.endDate = action.payload.endDate
        existingInternship.deadline = action.payload.deadline
        existingInternship.status = action.payload.status
        existingInternship.maxNumberStudents = action.payload.maxNumberStudents
        existingInternship.paid = action.payload.paid
        existingInternship.salary = action.payload.salary
        existingInternship.description = action.payload.description
        existingInternship.cityId = action.payload.cityId

      }
      // state.items = state.items.filter((item) => item.id !== action.payload.id);
      // state.items.push(action.payload);
    },
  },
});

export default InternshipsSlice.reducer;

export const selectAllInternships = (state) => state.internships.items;

export const selectInternshipsByStatus = (state, status) =>
  state.internships.items.filter((item) => item.status === status);
