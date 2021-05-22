import React, { useState, useEffect } from "react";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { withRouter, Link } from "react-router-dom";
import NameForm from "./Profile/NameForm";
import FacultyForm from "./Profile/FacultyForm";
import PhotoForm from "./Profile/PhotoForm";
import PhoneForm from "./Profile/PhoneForm";
import AnnualAverageForm from "./Profile/AnnualAverageForm";
import PersonalDescriptionForm from "./Profile/PersonalDescriptionForm";
import AptitudesForm from "./Profile/AptitudesForm";
import EducationForm from "./Profile/EducationForm";
import ExperienceForm from "./Profile/ExperienceForm";
import ProjectForm from "./Profile/Project";
import ForeignLanguagesForm from "./Profile/ForeignLanguagesForm";
import PassionsForm from "./Profile/PassionsForm";
import { Paper } from "@material-ui/core";
import Loading from "../Universal/Loading";

const Profile = () => {
  const [student, setStudent] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function populateProfileData() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      setUserId(user.id);
      setUserRole(user.role);

      let studentResponse = await fetch("api/students/" + user.id);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
        setLoading(false);
      }
    }

    populateProfileData();
  }, []);

  return !loading ? (
    <div>
      <Paper className="m-3 p-3" elevation={3} style={{ width: 900 }}>
        <NameForm studentId={userId} />

        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <PhotoForm studentId={userId} />
            </div>

            <div className="col-md-8">
              <PhoneForm studentId={userId} />

              <br />
              <div style={{ paddingLeft: 10 }}>
                <Icon.EnvelopeFill /> {student.email}
              </div>
              <br />
              <FacultyForm studentId={userId} />

              <AnnualAverageForm studentId={userId} />
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
        <PersonalDescriptionForm studentId={userId} />

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
        <AptitudesForm studentId={userId} />

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

        <EducationForm studentId={userId} />

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

        <ExperienceForm studentId={userId} />

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

        <ProjectForm studentId={userId} />

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
        <ForeignLanguagesForm studentId={userId} />

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

        <PassionsForm studentId={userId} />
      </Paper>
      <br />
    </div>
  ) : (
    <Loading />
  );
};

export default withRouter(Profile);
