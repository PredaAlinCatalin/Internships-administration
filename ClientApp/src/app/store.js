import { configureStore } from "@reduxjs/toolkit";
import savedInternshipsReducer from "../components/savedInternships/savedInternshipsSlice";
import internshipsReducer from "../components/internship/internshipsSlice";
import studentReducer from "../components/Student/studentSlice";
import studentAptitudesReducer from "../components/Student/Profile/studentAptitudesSlice";

export default configureStore({
  reducer: {
    savedInternships: savedInternshipsReducer,
    internships: internshipsReducer,
    student: studentReducer,
    studentAptitudes: studentAptitudesReducer,
  },
});
