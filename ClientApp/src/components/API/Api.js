export default class Api {
  static getStudentInternshipsByInternshipId(internshipId) {
    return fetch("api/studentInternships/internship/" + internshipId)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("Error on getting studentInternships", error);
      });
  }
}
