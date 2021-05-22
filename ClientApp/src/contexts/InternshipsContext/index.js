import React from "react";
import createActions from "./createActions";
import useAsyncReducer from "../../hooks/useAsyncReducer";
import reducer, { initialState } from "./reducer";

export const InternshipsContext = React.createContext();

export const InternshipsContextProvider = ({ children }) => {
  const [state, dispatch] = useAsyncReducer(reducer, initialState);
  const actions = createActions(dispatch);

  return (
    <InternshipsContext.Provider value={[state, actions]}>
      {children}
    </InternshipsContext.Provider>
  );
};
