import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import savedInternshipsReducer from "../components/Student/savedInternshipsSlice";
import internshipsReducer from "../components/Anonymous/internshipsSlice";
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
