import React, { createContext, useReducer, useEffect } from "react";
import { SavedInternshipsReducer } from "../reducers/SavedInternshipsReducer";
// import {useAuthentication} from '../components/Authentication/Authentication';
export const SavedInternshipsContext = createContext();

const SavedInternshipsContextProvider = (props) => {
  // const auth = useAuthentication();
  const [savedInternships, dispatchSavedInternships] = useReducer(
    SavedInternshipsReducer,
    [],
    async () => {
      console.log("DA");
      let data = [];
      const user = sessionStorage.getItem("user");
      if (user !== null && user.role === "Student") {
        const response = await fetch("api/savedstudentinternships/student/" + user.id);
        if (response.ok) {
          data = await response.json();
        }
      }
      return data;
    }
  );

  useEffect(() => {
    console.log(props.children);
  }, [savedInternships]);

  return (
    <SavedInternshipsContext.Provider
      value={{ savedInternships, dispatchSavedInternships }}
    >
      {props.children}
    </SavedInternshipsContext.Provider>
  );
};

export default SavedInternshipsContextProvider;
