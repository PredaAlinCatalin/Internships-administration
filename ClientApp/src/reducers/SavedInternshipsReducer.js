export const SavedInternshipsReducer = async (state, action) => {
  switch (action.type) {
    case "ADD_SAVED_INTERNSHIP":
      console.log("DA");
      console.log(state);
      let body = {
        internshipId: action.savedInternship.internshipId,
        studentId: action.savedInternship.studentId,
      };
      const response = await fetch("api/savedstudentinternships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof state === "object")
          return [
            ...state,
            {
              internshipId: data.internshipId,
              studentId: data.studentId,
            },
          ];
        else
          return [
            {
              internshipId: data.internshipId,
              studentId: data.studentId,
            },
          ];
      } else {
        return state;
      }
    default:
      return state;
  }
};

// export const SavedInternshipsReducer = (state, action) => {
//     switch(action.type) {
//         case 'ADD_SAVED_INTERNSHIP':
//             return [
//                 ...state,
//                 action.payload
//             ];
//         default:
//             return state;

//     }
// }
