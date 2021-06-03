import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchStudents = createAsyncThunk("Students/fetchStudents", async () => {
  const response = await axios.get("api/Students");
  return response.data;
});

export const updateStudent = createAsyncThunk(
  "Students/updateStudent",
  async (student) => {
    const response = await axios.put("api/students/" + student.id, student);
    return student;
  }
);

const StudentsSlice = createSlice({
  name: "Students",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStudents.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchStudents.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.items = state.items.concat(action.payload);
    },
    [fetchStudents.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateStudent.fulfilled]: (state, action) => {
      const existingStudent = state.items.find((item) => item.id === action.payload.id);
      if (existingStudent) {
        existingStudent.lastName = action.payload.lastName;
        existingStudent.firstName = action.payload.firstName;
        existingStudent.faculty = action.payload.faculty;
        existingStudent.specialization = action.payload.specialization;
        existingStudent.year = action.payload.year;
        existingStudent.annualAverage = action.payload.annualAverage;
        existingStudent.personalDescription = action.payload.personalDescription;
        existingStudent.photoPath = action.payload.photoPath;
        existingStudent.coverPath = action.payload.coverPath;
        existingStudent.passions = action.payload.passions;
        existingStudent.phoneNumber = action.payload.phoneNumber;
      }
    },
  },
});

export default StudentsSlice.reducer;

export const selectStudents = (state) => state.students.items;

export const selectStudentById = (state, id) =>
  state.students.items.find((s) => s.id === id);
