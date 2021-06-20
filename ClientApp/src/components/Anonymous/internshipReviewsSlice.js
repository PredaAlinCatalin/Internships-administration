import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchInternshipReviews = createAsyncThunk(
  "internshipReviews/fetchInternshipReviews",
  async (studentId) => {
    const response = await axios.get("api/studentInternshipReviews/student/" + studentId);
    return response.data;
  }
);

export const addInternshipReview = createAsyncThunk(
  "internshipReviews/addInternshipReview",
  async (internshipReview) => {
    const response = await axios.post("api/studentInternshipReviews", internshipReview);
    return response.data;
  }
);

export const updateInternshipReview = createAsyncThunk(
  "internshipReviews/addInternshipReview",
  async (internshipReview) => {
    const response = await axios.put(
      "api/studentInternshipReviews/student/" +
        internshipReview.studentId +
        "/internship/" +
        internshipReview.internshipId,
      internshipReview
    );
    return response.data;
  }
);

export const deleteInternshipReview = createAsyncThunk(
  "internshipReviews/deleteInternshipReview",
  async (internshipReview) => {
    const url =
      "api/studentInternshipReviews/student/" +
      internshipReview.studentId +
      "/internship/" +
      internshipReview.internshipId;
    const response = await axios.delete(url);
    return response.data;
  }
);

const internshipReviewsSlice = createSlice({
  name: "internshipReviews",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchInternshipReviews.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchInternshipReviews.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchInternshipReviews.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addInternshipReview.fulfilled]: (state, action) => {
      state.items.push(action.payload);
    },
    [updateInternshipReview.fulfilled]: (state, action) => {
      const existingReview = state.items.find(
        (item) =>
          item.studentId === action.payload.studentId &&
          item.internshipId === action.payload.internshipId
      );
      if (existingReview) {
        existingReview.title = action.payload.title;
        existingReview.comment = action.payload.comment;
        existingReview.grade = action.payload.grade;
      }
    },
    [deleteInternshipReview.fulfilled]: (state, action) => {
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

export default internshipReviewsSlice.reducer;

export const selectAllInternshipReviews = (state) => state.internshipReviews.items;
