import React, { useEffect, useState } from "react";
import API from "../../api";
import InternshipReview from "./InternshipReview";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
const InternshipReviews = ({ internshipId }) => {
  const [internship, setInternship] = useState(null);
  const [students, setStudents] = useState([]);
  const [emptyList, setEmptyList] = useState(true);

  useEffect(() => {
    async function populateWithData() {
      await fetch("api/internships/" + internshipId)
        .then((resp) => resp.json())
        .then(async (data) => {
          console.log(data);
          setInternship(data);
          let studentsList = [];
          await fetch("api/studentInternships/internship/" + internshipId)
            .then((res) => res.json())
            .then(async (data) => {
              for (let i = 0; i < data.length; i++) {
                await fetch("api/students/" + data[i].idStudent)
                  .then((res) => res.json())
                  .then((data) => {
                    studentsList.add(data);
                    setEmptyList(false);
                  });
              }
              setStudents(studentsList);
            });
        });
    }
    populateWithData();
  }, []);

  return !emptyList ? (
    students.map((student) => (
      <InternshipReview internshipData={internship} studentData={student} />
    ))
  ) : (
    <div className="text-center text-muted">Niciun review al acestui stagiu</div>
  );
};

export default InternshipReviews;
