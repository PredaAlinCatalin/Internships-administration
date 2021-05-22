import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  item: null,
  status: "idle",
  error: null,
};

export const fetchStudent = createAsyncThunk(
  "Students/fetchStudents",
  async (studentId) => {
    const response = await axios.get("api/Students/" + studentId);
    console.log(response.data);
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  "Students/updateStudent",
  async (student) => {
    const response = await axios.put("api/students/" + student.id, student);
    return student;
  }
);

const StudentSlice = createSlice({
  name: "Students",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStudent.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchStudent.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.item = action.payload;
    },
    [fetchStudent.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateStudent.fulfilled]: (state, action) => {
      state.item = action.payload;
    },
  },
});

export default StudentSlice.reducer;

export const selectStudent = (state) => state.student.item;
