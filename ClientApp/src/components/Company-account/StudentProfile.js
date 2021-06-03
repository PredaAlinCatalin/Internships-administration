import React, { useState, useEffect } from "react";
import Loading from "../Universal/Loading";
import Paper from "@material-ui/core/Paper";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import { getFormattedDateNoTime } from "../Utility/Utility";
import * as Icon from "react-bootstrap-icons";

const StudentProfile = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [studentAptitudes, setStudentAptitudes] = useState([]);
  const [studentForeignLanguages, setStudentForeignLanguages] = useState([]);
  const [studentEducations, setStudentEducations] = useState([]);
  const [studentExperiences, setStudentExperiences] = useState([]);
  const [studentProjects, setStudentProjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    populateStudentProfileData();
  }, []);

  const populateStudentProfileData = async () => {
    var studentResponse = await fetch("api/students/" + studentId);
    var studentData = "";
    if (studentResponse.ok) studentData = await studentResponse.json();

    const studentAptitudesResponse = await fetch("api/aptitudes/student/" + studentId);
    var studentAptitudesData = [];
    if (studentAptitudesResponse.ok)
      studentAptitudesData = await studentAptitudesResponse.json();

    const studentEducationsResponse = await fetch("api/educations/student/" + studentId);
    var studentEducationsData = [];
    if (studentEducationsResponse.ok)
      studentEducationsData = await studentEducationsResponse.json();

    const studentExperiencesResponse = await fetch(
      "api/experiences/student/" + studentId
    );
    var studentExperiencesData = [];
    if (studentExperiencesResponse.ok)
      studentExperiencesData = await studentExperiencesResponse.json();

    const studentForeignLanguagesResponse = await fetch(
      "api/foreignLanguages/student/" + studentId
    );
    var studentForeignLanguagesData = [];
    if (studentForeignLanguagesResponse.ok)
      studentForeignLanguagesData = await studentForeignLanguagesResponse.json();

    const studentProjectsResponse = await fetch("api/projects/student/" + studentId);
    var studentProjectsData = [];
    if (studentProjectsResponse.ok)
      studentProjectsData = await studentProjectsResponse.json();

    const facultiesResponse = await fetch("api/faculties");
    var facultiesData = [];
    if (facultiesResponse.ok) facultiesData = await facultiesResponse.json();

    setStudent(studentData);
    setStudentAptitudes(studentAptitudesData);
    setStudentEducations(studentEducationsData);
    setStudentExperiences(studentExperiencesData);
    setStudentForeignLanguages(studentForeignLanguagesData);
    setStudentProjects(studentProjectsData);
    setFaculties(facultiesData);
    setLoading(false);
  };
  return loading ? (
    <Loading />
  ) : (
    <div>
      <Paper className="m-3 p-3" elevation={3} style={{ maxWidth: 800 }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3 mr-4">
              <img
                width="200"
                height="200"
                alt="photo"
                src={"photos/" + student.photoPath}
              />
            </div>
            <div className="col-md-8">
              <div className="p-2">
                <h5>
                  {student["lastName"]}&nbsp;
                  {student["firstName"]}
                </h5>
              </div>

              <div
                style={{
                  display: "inline-block",
                  color: "#0c56a5",
                }}
                className="p-2"
              >
                <Icon.TelephoneFill />
                {student.phoneNumber}
              </div>

              <div className="p-2">
                <Icon.EnvelopeFill /> {student.email}
              </div>

              <div className="p-2">
                <b
                  style={{
                    display: "inline-block",
                  }}
                >
                  {faculties.find((f) => f.id === student.facultyId).name}
                  <br />
                  anul&nbsp;{student["year"]}
                </b>
              </div>

              <div class="p-2">
                Medie anuala:&nbsp;&nbsp;
                <b>{student["annualAverage"]}</b>
              </div>
            </div>
          </div>

          <hr className="break-line" />

          <div className="rounded row justify-content-center m-2 p-3 pen-icon-parent">
            <div style={{ whiteSpace: "pre-line" }}>
              <span
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                <FormatQuoteIcon style={{ color: "gray" }} />
                {student.personalDescription}
                <FormatQuoteIcon style={{ color: "gray" }} />
              </span>
            </div>
          </div>
          <hr className="break-line" />

          <div className="d-flex flex-column">
            <div className="rounded row p-2 ml-2 mr-2 pen-icon-parent">
              <div className="col-md-3 mr-2">
                <div className="row justify-content-end">Aptitudini</div>
              </div>
              <div
                className="col-md-7"
                style={{
                  display: "inline-block",
                  whiteSpace: "pre-line",
                }}
              >
                <b
                  style={{
                    display: "inline-block",
                  }}
                >
                  {studentAptitudes !== []
                    ? studentAptitudes.map((aptitude) => aptitude.name).join(", ")
                    : ""}
                </b>
              </div>
            </div>

            <div className="rounded row p-2 ml-2 mr-2 pen-icon-parent">
              <div className="col-md-3 mr-2">
                <div className="row justify-content-end">Limbi străine</div>
              </div>
              <div
                className="col-md-7"
                style={{
                  display: "inline-block",
                  whiteSpace: "pre-line",
                }}
              >
                <b
                  style={{
                    display: "inline-block",
                  }}
                >
                  {studentForeignLanguages !== []
                    ? studentForeignLanguages
                        .map((foreignlanguage) => foreignlanguage.name)
                        .join(", ")
                    : ""}
                </b>
              </div>
            </div>

            <div className="rounded row p-2 ml-2 mr-2 pen-icon-parent">
              <div className="col-md-3 mr-2">
                <div className="row justify-content-end">Pasiuni</div>
              </div>
              <div className="col" style={{ whiteSpace: "pre-line" }}>
                <b
                  style={{
                    wordBreak: "break-all",
                    wordWrap: "break-word",
                  }}
                >
                  {student.passions}
                </b>
              </div>
            </div>
          </div>
          <hr className="underline" />
          <span className="header">EDUCAȚIE</span>
          {studentEducations.map((education, index) => (
            <span key={index}>
              <div className="container rounded pen-icon-parent p-2">
                <div className="row">
                  <div className="col-4">
                    {getFormattedDateNoTime(new Date(education.startDate))} -&nbsp;
                    {getFormattedDateNoTime(new Date(education.endDate))}
                  </div>
                  <div
                    className="col-8 right-col"
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <b
                      style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        display: "inline-block",
                      }}
                    >
                      {education["institution"]}
                      <br />
                      {education["specialization"]}
                    </b>
                  </div>
                </div>
              </div>
            </span>
          ))}
          <hr className="underline" />
          <span className="header">EXPERIENȚĂ</span>

          {studentExperiences.map((experience, index) => (
            <span key={index}>
              <div className="container rounded pen-icon-parent p-2">
                <div className="row">
                  <div className="col-4">
                    {getFormattedDateNoTime(new Date(experience.startDate))} -&nbsp;
                    {getFormattedDateNoTime(new Date(experience.endDate))}
                  </div>
                  <div
                    className="col-8 right-col"
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <b
                      style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        display: "inline-block",
                      }}
                    >
                      {experience["position"]} -&nbsp;
                      {experience["company"]}
                    </b>
                    <br />
                    {experience.description}
                  </div>
                </div>
              </div>
            </span>
          ))}
          <hr className="underline" />
          <span className="header">PROIECTE</span>

          {studentProjects.map((project, index) => (
            <span key={index}>
              <div className="container rounded pen-icon-parent p-2">
                <div className="row">
                  <div className="col-4">
                    {getFormattedDateNoTime(new Date(project.startDate))} -&nbsp;
                    {getFormattedDateNoTime(new Date(project.endDate))}
                  </div>
                  <div
                    className="col-8 right-col"
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <b
                      style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        display: "inline-block",
                      }}
                    >
                      {project["title"]}
                    </b>

                    <br />
                    {project.description}
                  </div>
                </div>
              </div>
            </span>
          ))}
          <p></p>
        </div>
      </Paper>
    </div>
  );
};

export default StudentProfile;
