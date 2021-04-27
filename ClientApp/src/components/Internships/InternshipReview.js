import React from "react";

const InternshipReview = ({ internshipData, studentData }) => {
  return (
    <div>
      {studentData.photoPath}
      {studentData.firstName}
      {studentData.lastName}
      {internshipData.internshipGrade}
      {internshipData.description}
    </div>
  );
};

export default InternshipReview;
