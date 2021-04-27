import React, { useState, useEffect } from "react";
import Loading from "../Universal/Loading";

const StudentProfile = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [studentAptitudes, setStudentAptitudes] = useState([]);
  const [studentForeignLanguages, setStudentForeignLanguages] = useState([]);
  const [studentEducations, setStudentEducations] = useState([]);
  const [studentExperiences, setStudentExperiences] = useState([]);
  const [studentProjects, setStudentProjects] = useState([]);
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

    setStudent(studentData);
    setStudentAptitudes(studentAptitudesData);
    setStudentEducations(studentEducationsData);
    setStudentExperiences(studentExperiencesData);
    setStudentForeignLanguages(studentForeignLanguagesData);
    setStudentProjects(studentProjectsData);
    setLoading(false);
  };
  return loading ? (
    <Loading />
  ) : (
    <div>
      <div
        class="border border border-5 shadow p-3 mb-5 bg-body rounded"
        style={{
          width: 900,
          backgroundColor: "lightblue",
          margin: "auto",
          padding: 50,
        }}
      >
        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: "850",
          }}
        >
          <div class="row">
            <div
              class="col-xs"
              style={{
                display: "inline-block",
                whiteSpace: "pre-line",
              }}
            >
              <h3
                style={{
                  display: "inline-block",
                  color: "#0c56a5",
                }}
              >
                {student["lastName"]}&nbsp;
                {student["firstName"]}
              </h3>
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: 10 }}>
          (+40) 0732210896
          <br />
          Adresa de mail: predacatalin99@gmail.com
          <br />
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
        >
          <div class="row">
            <div
              class="col-xs"
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
                {student["faculty"]}
                <br />
                {student["specialization"]}, anul&nbsp;{student["year"]}
              </b>
            </div>
          </div>
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: "850",
          }}
        >
          <div class="row">
            <div class="col-xs">Medie anuala:&nbsp;&nbsp;</div>
            <div
              class="col-xs"
              style={{
                display: "inline-block",
                whiteSpace: "pre-line",
              }}
            >
              <b>{student["annualAverage"]}</b>
            </div>
          </div>
        </div>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            DESCRIERE PERSONALA
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: 850,
          }}
        >
          <div style={{}} class="row">
            <div class="col-xs" style={{ whiteSpace: "pre-line" }}>
              <b
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {student["personalDescription"]}
              </b>
            </div>
          </div>
        </div>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            APTITUDINI
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: "850",
          }}
        >
          <div class="row">
            <div
              class="col-xs"
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
        </div>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            EDUCATIE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <p></p>
        {studentEducations.map((education) => (
          <>
            <div
              class="container rounded"
              style={{
                padding: 10,
                paddingRight: 25,
                paddingLeft: 25,
                width: "850",
              }}
            >
              <div class="row">
                <div class="col-xs">
                  {education["startDate"]} -&nbsp;
                  {education["endDate"]}
                  &nbsp;&nbsp;
                </div>
                <div
                  class="col-xs"
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
                    {education["institution"]}
                    <br />
                    Specializarea: {education["specialization"]}
                  </b>
                </div>
              </div>
            </div>
          </>
        ))}
        <p></p>

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            EXPERIENTA
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <p></p>
        {studentExperiences.map((experience) => (
          <>
            <div
              class="container rounded"
              style={{
                padding: 10,
                paddingRight: 25,
                paddingLeft: 25,
                width: "850",
              }}
            >
              <div class="row">
                <div class="col-xs">
                  {experience["startDate"]} -&nbsp;
                  {experience["endDate"]} &nbsp;&nbsp;
                </div>
                <div
                  class="col-xs"
                  style={{
                    width: 600,
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
                    <br />
                    {experience.description}
                  </b>
                </div>
              </div>
            </div>
          </>
        ))}
        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            PROIECTE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <p></p>
        {studentProjects.map((project) => (
          <>
            <div
              class="container rounded"
              style={{
                padding: 10,
                paddingRight: 25,
                paddingLeft: 25,
                width: 850,
              }}
            >
              <div class="row">
                <div class="col-xs">
                  {project["startDate"]} -&nbsp;
                  {project["endDate"]} &nbsp;&nbsp;
                </div>
                <div
                  class="col-xs"
                  style={{
                    width: 600,
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
                    <br />
                    {project["description"]}
                  </b>
                </div>
              </div>
            </div>
          </>
        ))}
        <p></p>

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            LIMBI STRAINE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: "850",
          }}
        >
          <div class="row">
            <div
              class="col-xs"
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
                      .map((foreignLanguage) => foreignLanguage.name)
                      .join(", ")
                  : ""}
              </b>
            </div>
          </div>
        </div>

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            PASIUNI
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <div
          class="container rounded"
          style={{
            padding: 10,
            paddingRight: 25,
            paddingLeft: 25,
            width: "850",
          }}
        >
          <div class="row">
            <div
              class="col-xs"
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
                {student["passions"]}
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
