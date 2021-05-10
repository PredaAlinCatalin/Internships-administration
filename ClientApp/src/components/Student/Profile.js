import React, { Component } from "react";
import Modal from "../Modal";
import "./Profile.css";
import Aptitude from "../Universal/SelectElement";
import ForeignLanguage from "../Universal/SelectElement";
import Select from "react-select";
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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: "",
      studentAptitudes: [],
      studentEducations: [],
      studentExperiences: [],
      studentForeignLanguages: [],
      studentProjects: [],
      loading: true,
      nameIsOpen: false,
      studentLastName: "",
      studentFirstName: "",
      studentFaculty: "",
      studentSpecialization: "",
      studentYear: 0,
      facultyIsOpen: false,
      studentAnnualAverage: 0,
      annualAverageIsOpen: false,
      studentPersonalDescription: "",
      personalDescriptionIsOpen: false,
      foreignLanguagesIsOpen: false, //foreign languages form variables
      studentForeignLanguagesAux: [],
      foreignLanguagesIdToDelete: [],
      foreignLanguagesIdToInsert: [],
      foreignLanguages: [],
      foreignLanguagesOptions: [],
      foreignLanguagesSelectedOption: null,
      educationsModifyIsOpen: false, //education form variables
      educationsCreateIsOpen: false,
      educationId: "",
      educationStartDate: "",
      educationEndDate: "",
      educationInstution: "",
      educationSpecialization: "",
      experiencesModifyIsOpen: false, //experience form variables
      experiencesCreateIsOpen: false,
      experienceId: "",
      experienceStartDate: "",
      experienceEndDate: "",
      experiencePosition: "",
      experienceCompany: "",
      experienceDescription: "",
      projectsModifyIsOpen: false, //projects form variables
      projectsCreateIsOpen: false,
      projectId: "",
      projectStartDate: "",
      projectEndDate: "",
      projectTitle: "",
      projectDescription: "",
      passionsIsOpen: false,
      studentPassions: "",
      isAuthenticated: false,
      userName: null,
      userId: null,
      userRole: null,
      photoIsOpen: false,
      studentPhotoPath: "",
      photoFormData: "",
      studentPhoneNumber: "",
      phoneNumberIsOpen: false,
      studentEmail: "",
    };
    this.renderProfileData = this.renderProfileData.bind(this);
  }

  // INITIALIZATION FUNCTIONALITY ----------------------------------------------------------------------------
  componentDidMount() {
    this.populateProfileData();
  }

  async populateProfileData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ userId: user.id });
    this.setState({ userRole: user.role });

    let studentResponse = await fetch("api/students/" + user.id);
    let studentData = "";
    if (studentResponse.ok) studentData = await studentResponse.json();

    const studentAptitudesResponse = await fetch("api/aptitudes/student/" + user.id);
    let studentAptitudesData = [];
    if (studentAptitudesResponse.ok)
      studentAptitudesData = await studentAptitudesResponse.json();

    const studentEducationsResponse = await fetch("api/educations/student/" + user.id);
    let studentEducationsData = [];
    if (studentEducationsResponse.ok)
      studentEducationsData = await studentEducationsResponse.json();

    const studentExperiencesResponse = await fetch("api/experiences/student/" + user.id);
    let studentExperiencesData = [];
    if (studentExperiencesResponse.ok)
      studentExperiencesData = await studentExperiencesResponse.json();

    const studentForeignLanguagesResponse = await fetch(
      "api/foreignLanguages/student/" + user.id
    );
    let studentForeignLanguagesData = [];
    if (studentForeignLanguagesResponse.ok)
      studentForeignLanguagesData = await studentForeignLanguagesResponse.json();

    const studentProjectsResponse = await fetch("api/projects/student/" + user.id);
    let studentProjectsData = [];
    if (studentProjectsResponse.ok)
      studentProjectsData = await studentProjectsResponse.json();

    const foreignLanguagesResponse = await fetch("api/foreignLanguages");
    let foreignLanguagesData = [];
    let foreignLanguagesOptions = [];
    let foreignLanguagesSelectedOption = "";
    if (foreignLanguagesResponse.ok) {
      foreignLanguagesData = await foreignLanguagesResponse.json();
      foreignLanguagesOptions = this.getForeignLanguagesOptions(foreignLanguagesData);
    }

    let modifiedStudent = studentData;
    console.log(modifiedStudent);
    if (studentData !== "" && studentData.personalDescription !== null) {
      modifiedStudent.personalDescription = modifiedStudent.personalDescription.replaceAll(
        "<br/>",
        "\n"
      );
    }

    this.setState({
      student: modifiedStudent,
      studentAptitudes: studentAptitudesData,
      studentEducations: studentEducationsData,
      studentExperiences: studentExperiencesData,
      studentForeignLanguages: studentForeignLanguagesData,
      studentProjects: studentProjectsData,
      loading: false,
      studentLastName: studentData.lastName,
      studentFirstName: studentData.firstName,
      studentFaculty: studentData.faculty,
      studentSpecialization: studentData.specialization,
      studentYear: studentData.year,
      studentAnnualAverage: studentData.annualAverage,
      studentPersonalDescription: modifiedStudent.personalDescription,
      foreignLanguages: foreignLanguagesData,
      studentForeignLanguagesAux: studentForeignLanguagesData,
      foreignLanguagesOptions: foreignLanguagesOptions,
      studentPassions: studentData.passions,
      studentPhotoPath: studentData.photoPath,
      studentPhoneNumber: studentData.phoneNumber,
      studentEmail: studentData.email,
    });
  }

  // FOREIGN LANGUAGES FUNCTIONALITY ----------------------------------------------------------------------------
  getForeignLanguagesOptions = (foreignLanguages) => {
    let foreignLanguagesOptions = [];
    for (let i = 0; i < foreignLanguages.length; i++) {
      foreignLanguagesOptions.push({
        value: foreignLanguages[i].name,
        label: foreignLanguages[i].name,
      });
    }
    return foreignLanguagesOptions;
  };

  handleForeignLanguagesOptionChange = (changeEvent) => {
    let searchedForeignLanguage = JSON.parse(
      JSON.stringify(
        this.state.foreignLanguages.find((obj) => obj.name === changeEvent.value)
      )
    );

    if (
      this.state.studentForeignLanguagesAux.find(
        (obj) => obj.name === searchedForeignLanguage.name
      ) === undefined
    ) {
      let modifiedStudentForeignLanguagesAux = JSON.parse(
        JSON.stringify(this.state.studentForeignLanguagesAux)
      );
      modifiedStudentForeignLanguagesAux.push(searchedForeignLanguage);

      let foreignLanguagesIdToDelete = JSON.parse(
        JSON.stringify(
          this.state.foreignLanguagesIdToDelete.filter(
            (obj) => obj !== searchedForeignLanguage.id
          )
        )
      );

      let foreignLanguagesIdToInsert = JSON.parse(
        JSON.stringify(this.state.foreignLanguagesIdToInsert)
      );
      foreignLanguagesIdToInsert.push(searchedForeignLanguage.id);

      this.setState({
        foreignLanguagesSelectedOption: changeEvent,
        studentForeignLanguagesAux: modifiedStudentForeignLanguagesAux,
        foreignLanguagesIdToInsert: foreignLanguagesIdToInsert,
        foreignLanguagesIdToDelete: foreignLanguagesIdToDelete,
      });
    }
  };

  handleStudentForeignLanguageDelete = async (idForeignLanguage) => {
    const filteredForeignLanguagesIdToInsert = JSON.parse(
      JSON.stringify(
        this.state.foreignLanguagesIdToInsert.filter((obj) => obj !== idForeignLanguage)
      )
    );

    const filteredForeignLanguages = JSON.parse(
      JSON.stringify(
        this.state.studentForeignLanguagesAux.filter((foreignLanguage) => {
          return foreignLanguage.id !== idForeignLanguage;
        })
      )
    );

    let foreignLanguagesIdToDelete = JSON.parse(
      JSON.stringify(this.state.foreignLanguagesIdToDelete)
    );
    foreignLanguagesIdToDelete.push(idForeignLanguage);

    this.setState({
      studentForeignLanguagesAux: filteredForeignLanguages,
      foreignLanguagesIdToDelete: foreignLanguagesIdToDelete,
      foreignLanguagesIdToInsert: filteredForeignLanguagesIdToInsert,
    });
  };

  handleStudentForeignLanguagesForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    for (let i = 0; i < this.state.foreignLanguagesIdToDelete.length; i++) {
      if (
        this.state.studentForeignLanguages.find(
          (obj) => obj.id === this.state.foreignLanguagesIdToDelete[i]
        ) !== undefined
      ) {
        let aux =
          "api/studentforeignLanguages/student/" +
          this.state.userId +
          "/foreignLanguage/" +
          this.state.foreignLanguagesIdToDelete[i];
        await fetch(aux, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    for (let i = 0; i < this.state.foreignLanguagesIdToInsert.length; i++) {
      if (
        this.state.studentForeignLanguages.find(
          (obj) => obj.id === this.state.foreignLanguagesIdToInsert[i]
        ) === undefined
      ) {
        const studentForeignLanguage = {
          studentId: this.state.userId,
          idForeignLanguage: this.state.foreignLanguagesIdToInsert[i],
        };

        let aux = "api/studentforeignLanguages";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentForeignLanguage),
        });
      }
    }

    this.setState({
      studentForeignLanguages: this.state.studentForeignLanguagesAux,
      foreignLanguagesIsOpen: false,
    });
  };

  // PROJECTS FUNCTIONALITY ----------------------------------------------------------------------------
  handleProjectStartDateChange = (changeEvent) => {
    this.setState({
      projectStartDate: changeEvent.target.value,
    });
  };

  handleProjectEndDateChange = (changeEvent) => {
    this.setState({
      projectEndDate: changeEvent.target.value,
    });
  };

  handleProjectTitleChange = (changeEvent) => {
    this.setState({
      projectTitle: changeEvent.target.value,
    });
  };

  handleProjectDescriptionChange = (changeEvent) => {
    this.setState({
      projectDescription: changeEvent.target.value,
    });
  };

  handleProjectCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let newProject = {
      startDate: this.state.projectStartDate,
      endDate: this.state.projectEndDate,
      title: this.state.projectTitle,
      description: this.state.projectDescription,
      studentId: this.state.userId,
    };

    let aux = "api/projects";
    const projectResponse = await fetch(aux, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newProject),
    });
    let projectData = "";
    if (projectResponse.ok) projectData = await projectResponse.json();

    let newStudentProjects = JSON.parse(JSON.stringify(this.state.studentProjects));
    newStudentProjects.push(projectData);

    this.setState({
      studentProjects: newStudentProjects,
      projectsCreateIsOpen: false,
    });
  };

  handleProjectModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedProject = {
      id: this.state.projectId,
      startDate: this.state.projectStartDate,
      endDate: this.state.projectEndDate,
      title: this.state.projectTitle,
      description: this.state.projectDescription,
      studentId: this.state.userId,
    };

    let modifiedStudentProjects = JSON.parse(JSON.stringify(this.state.studentProjects));

    for (let i = 0; i < modifiedStudentProjects.length; i++) {
      if (modifiedStudentProjects[i].id === this.state.projectId) {
        modifiedStudentProjects[i] = modifiedProject;
        break;
      }
    }

    this.setState({
      studentProjects: modifiedStudentProjects,
    });
    let aux = "api/projects/" + modifiedProject.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedProject),
    });
    this.setState({
      projectsModifyIsOpen: false,
    });
  };

  handleProjectDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentProjects = JSON.parse(JSON.stringify(this.state.studentProjects));

    modifiedStudentProjects = modifiedStudentProjects.filter(
      (studentProject) => studentProject.id !== this.state.projectId
    );
    this.setState({
      studentProjects: modifiedStudentProjects,
      projectsModifyIsOpen: false,
    });

    let aux = "api/projects/" + this.state.projectId;
    await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // PASSIONS FUNCTIONALITY ----------------------------------------------------------------------------
  handleStudentPassionsChange = (changeEvent) => {
    this.setState({
      studentPassions: changeEvent.target.value,
    });
  };

  handleStudentPassionsForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    modifiedStudent.passions = this.state.studentPassions;
    this.setState({
      student: modifiedStudent,
    });
    let aux = "api/students/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.student),
    });
    this.setState({ passionsIsOpen: false });
  };

  renderProfileData() {
    return (
      <div>
        <div
          className="container border border border-5 shadow p-3 mb-5 bg-body rounded"
          style={{
            width: 900,
            backgroundColor: "white",
            margin: "auto",
            padding: 50,
          }}
        >
          <NameForm studentId={this.state.userId} />

          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <PhotoForm studentId={this.state.userId} />
              </div>

              <div className="col-md-8">
                <PhoneForm studentId={this.state.userId} />

                <br />
                <div style={{ paddingLeft: 10 }}>
                  <Icon.EnvelopeFill /> {this.state.studentEmail}
                </div>
                <br />
                <FacultyForm studentId={this.state.userId} />

                <AnnualAverageForm studentId={this.state.userId} />
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
          <PersonalDescriptionForm studentId={this.state.userId} />

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
          <AptitudesForm studentId={this.state.userId} />

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

          <EducationForm studentId={this.state.userId} />

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

          <ExperienceForm studentId={this.state.userId} />

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

          <ProjectForm studentId={this.state.userId} />

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
          <ForeignLanguagesForm studentId={this.state.userId} />

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

          <PassionsForm studentId={this.state.userId} />
        </div>
      </div>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderProfileData()
    );

    return <div>{contents}</div>;
  }
}

export default withRouter(Profile);
