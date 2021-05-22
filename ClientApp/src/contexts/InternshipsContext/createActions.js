function createActions(dispatch) {
  return {
    add: (savedInternship) => dispatch({ type: "add", payload: savedInternship }),
  };
}

export default createActions;
