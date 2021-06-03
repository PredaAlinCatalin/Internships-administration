import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import savedInternshipsReducer from "../components/savedInternships/savedInternshipsSlice";
import internshipsReducer from "../components/internship/internshipsSlice";
import studentsReducer from "../components/Student/studentsSlice";
import companiesReducer from "../components/Company-account/companiesSlice";

const combinedReducer = combineReducers({
  savedInternships: savedInternshipsReducer,
  internships: internshipsReducer,
  students: studentsReducer,
  companies: companiesReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
});

// export default configureStore({
//   reducer: {
//     savedInternships: savedInternshipsReducer,
//     internships: internshipsReducer,
//     students: studentsReducer,
//     companies: companiesReducer,
//   }
// })
