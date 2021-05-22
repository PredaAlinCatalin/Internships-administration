import axios from "axios";

async function getSavedInternships() {
  let user = JSON.parse(sessionStorage.getItem("user"));
  let data = [];
  if (user !== null) {
    let url = "api/savedstudentinternships/student/" + user.id;
    return await axios
      .get(url)
      .then((response) => {
        console.log(response.status);
        if (response.status.ok) data = response.data;
        console.log(response.data);
        console.log(data);
      })
      .finally(() => {
        console.log(data);
      });
    console.log(data);
  }
}

export const initialState = { savedInternships: [] };

function reducer(state, action) {
  switch (action.type) {
    case "add":
      let url = "api/savedstudentinternships/";
      let success = false;
      let data = "";
      axios
        .post(url)
        .then((response) => {
          if (response.status.ok) {
            success = true;
            data = response.data;
          }
        })
        .catch((error) => console.log(error));

      if (success) {
        // return {...state, savedInternships: [...savedInternships, data]}
        return state;
      } else return state;
      break;

    default:
      return state;
      break;
  }
}

export default reducer;
