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
import ProjectForm from "./Profile/ProjectForm";
import ForeignLanguagesForm from "./Profile/ForeignLanguagesForm";
import PassionsForm from "./Profile/PassionsForm";
import { Paper } from "@material-ui/core";
import Loading from "../Universal/Loading";
import CoverForm from "./Profile/CoverForm";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";

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
      <Paper className="m-3 p-3" elevation={3} style={{ maxWidth: 800 }}>
        <div className="container">
          <div className="row">
            <div className="col">
              {/* <CoverForm studentId={userId} /> */}
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mr-4">
              <PhotoForm studentId={userId} />
            </div>

            <div className="col-md-8">
              <NameForm studentId={userId} />
              <PhoneForm studentId={userId} />

              <div className="p-2">
                <Icon.EnvelopeFill /> {student.email}
              </div>
              <FacultyForm studentId={userId} />

              <AnnualAverageForm studentId={userId} />
            </div>
          </div>
        </div>

        <hr className="break-line" />
        <div>
          <PersonalDescriptionForm studentId={userId} />
        </div>
        <hr className="break-line" />

        <div className="d-flex flex-column">
          <div>
            <AptitudesForm studentId={userId} />
          </div>

          <div>
            <ForeignLanguagesForm studentId={userId} />
          </div>

          <div>
            <PassionsForm studentId={userId} />
          </div>
        </div>

        <br />
        <div style={{ paddingLeft: 8 }}>
          <hr className="underline" />
        </div>

        <EducationForm studentId={userId} />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <hr className="underline" />
        </div>

        <ExperienceForm studentId={userId} />

        <br />
        <div style={{ paddingLeft: 8 }}>
          <hr className="underline" />
        </div>

        <ProjectForm studentId={userId} />
      </Paper>
      <br />
    </div>
  ) : (
    <Loading />
  );
};

export default withRouter(Profile);
