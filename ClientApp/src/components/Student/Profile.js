import React, { Component } from "react";
import Modal from "../Modal";
import "./Profile.css";
import Aptitude from "../Universal/SelectElement";
import ForeignLanguage from "../Universal/SelectElement";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import { withRouter, Link } from "react-router-dom";

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
      aptitudesIsOpen: false, // aptitudes form variables
      studentAptitudesAux: [],
      idAptitudesToDelete: [],
      idAptitudesToInsert: [],
      aptitudes: [],
      aptitudesOptions: [],
      aptitudesSelectedOption: null,
      foreignLanguagesIsOpen: false, //foreign languages form variables
      studentForeignLanguagesAux: [],
      idForeignLanguagesToDelete: [],
      idForeignLanguagesToInsert: [],
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
    // const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    // this.setState({
    //     isAuthenticated,
    //     userName: user && user.name,
    //     userId: user && user.sub
    // });
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ userId: user.id });

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

    const aptitudesResponse = await fetch("api/aptitudes");
    let aptitudesData = [];
    let aptitudesOptions = [];
    let aptitudesSelectedOption = "";
    if (aptitudesResponse.ok) {
      aptitudesData = await aptitudesResponse.json();
      aptitudesOptions = this.getAptitudesOptions(aptitudesData);
    }

    const foreignLanguagesResponse = await fetch("api/foreignLanguages");
    let foreignLanguagesData = [];
    let foreignLanguagesOptions = [];
    let foreignLanguagesSelectedOption = "";
    if (foreignLanguagesResponse.ok) {
      foreignLanguagesData = await foreignLanguagesResponse.json();
      foreignLanguagesOptions = this.getAptitudesOptions(foreignLanguagesData);
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
      aptitudes: aptitudesData,
      studentAptitudesAux: studentAptitudesData,
      aptitudesOptions: aptitudesOptions,
      foreignLanguages: foreignLanguagesData,
      studentForeignLanguagesAux: studentForeignLanguagesData,
      foreignLanguagesOptions: foreignLanguagesOptions,
      studentPassions: studentData.passions,
      studentPhotoPath: studentData.photoPath,
      studentPhoneNumber: studentData.phoneNumber,
      studentEmail: studentData.email,
    });
  }

  // NAME FUNCTIONALITY ----------------------------------------------------------------------------
  handleStudentFirstNameChange = (changeEvent) => {
    this.setState({
      studentFirstName: changeEvent.target.value,
    });
  };

  handleStudentLastNameChange = (changeEvent) => {
    this.setState({
      studentLastName: changeEvent.target.value,
    });
  };

  handleStudentNameForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    modifiedStudent.firstName = this.state.studentFirstName;
    modifiedStudent.lastName = this.state.studentLastName;
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
    this.setState({ nameIsOpen: false });
  };

  // FACULTY FUNCTIONALITY ----------------------------------------------------------------------------
  handleStudentFacultyChange = (changeEvent) => {
    this.setState({
      studentFaculty: changeEvent.target.value,
    });
  };

  handleStudentSpecializationChange = (changeEvent) => {
    this.setState({
      studentSpecialization: changeEvent.target.value,
    });
  };

  handleStudentYearChange = (changeEvent) => {
    this.setState({
      studentYear: changeEvent.target.value,
    });
  };

  handleStudentFacultyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    modifiedStudent.faculty = this.state.studentFaculty;
    modifiedStudent.specialization = this.state.studentSpecialization;
    modifiedStudent.year = this.state.studentYear;
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
    this.setState({ facultyIsOpen: false });
  };

  // ANNUAL AVERAGE FUNCTIONALITY ----------------------------------------------------------------------------
  handleStudentAnnualAverageChange = (changeEvent) => {
    this.setState({
      studentAnnualAverage: changeEvent.target.value,
    });
  };

  handleStudentAnnualAverageForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    modifiedStudent.annualAverage = this.state.studentAnnualAverage;
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
    this.setState({ annualAverageIsOpen: false });
  };

  handleStudentPhoneNumberChange = (changeEvent) => {
    this.setState({
      studentPhoneNumber: changeEvent.target.value,
    });
  };

  handleStudentPhoneNumberForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    modifiedStudent.phoneNumber = this.state.studentPhoneNumber;
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
    this.setState({ phoneNumberIsOpen: false });
  };

  // PERSONAL DESCRIPTION FUNCTIONALITY ----------------------------------------------------------------------------
  handleStudentPersonalDescriptionChange = (changeEvent) => {
    this.setState({
      studentPersonalDescription: changeEvent.target.value,
    });
  };

  handleStudentPersonalDescriptionForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudent = this.state.student;
    let descriptionCopy = this.state.studentPersonalDescription;
    descriptionCopy = descriptionCopy.replaceAll("\n", "<br/>");
    modifiedStudent.personalDescription = descriptionCopy;
    let aux = "api/students/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedStudent),
    });
    modifiedStudent.personalDescription = this.state.studentPersonalDescription;
    this.setState({
      student: modifiedStudent,
      personalDescriptionIsOpen: false,
    });
  };

  // APTITUDES FUNCTIONALITY ----------------------------------------------------------------------------
  getAptitudesOptions = (aptitudes) => {
    let aptitudesOptions = [];
    for (let i = 0; i < aptitudes.length; i++) {
      aptitudesOptions.push({
        value: aptitudes[i].name,
        label: aptitudes[i].name,
      });
    }
    return aptitudesOptions;
  };

  handleAptitudesOptionChange = (changeEvent) => {
    let searchedAptitude = JSON.parse(
      JSON.stringify(this.state.aptitudes.find((obj) => obj.name === changeEvent.value))
    );

    if (
      this.state.studentAptitudesAux.find((obj) => obj.name === searchedAptitude.name) ===
      undefined
    ) {
      let modifiedStudentAptitudesAux = JSON.parse(
        JSON.stringify(this.state.studentAptitudesAux)
      );
      modifiedStudentAptitudesAux.push(searchedAptitude);

      let idAptitudesToDelete = JSON.parse(
        JSON.stringify(
          this.state.idAptitudesToDelete.filter((obj) => obj !== searchedAptitude.id)
        )
      );

      let idAptitudesToInsert = JSON.parse(
        JSON.stringify(this.state.idAptitudesToInsert)
      );
      idAptitudesToInsert.push(searchedAptitude.id);

      this.setState({
        aptitudesSelectedOption: changeEvent,
        studentAptitudesAux: modifiedStudentAptitudesAux,
        idAptitudesToInsert: idAptitudesToInsert,
        idAptitudesToDelete: idAptitudesToDelete,
      });
    }
  };

  handleStudentAptitudeDelete = async (idAptitude) => {
    const filteredIdAptitudesToInsert = JSON.parse(
      JSON.stringify(this.state.idAptitudesToInsert.filter((obj) => obj !== idAptitude))
    );

    const filteredAptitudes = JSON.parse(
      JSON.stringify(
        this.state.studentAptitudesAux.filter((aptitude) => {
          return aptitude.id !== idAptitude;
        })
      )
    );

    let idAptitudesToDelete = JSON.parse(JSON.stringify(this.state.idAptitudesToDelete));
    idAptitudesToDelete.push(idAptitude);

    this.setState({
      studentAptitudesAux: filteredAptitudes,
      idAptitudesToDelete: idAptitudesToDelete,
      idAptitudesToInsert: filteredIdAptitudesToInsert,
    });
  };

  handleStudentAptitudesForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    console.log(this.state.idAptitudesToInsert);
    console.log(this.state.idAptitudesToDelete);

    for (let i = 0; i < this.state.idAptitudesToDelete.length; i++) {
      if (
        this.state.studentAptitudes.find(
          (obj) => obj.id === this.state.idAptitudesToDelete[i]
        ) !== undefined
      ) {
        let aux =
          "api/studentaptitudes/student/" +
          this.state.userId +
          "/aptitude/" +
          this.state.idAptitudesToDelete[i];
        await fetch(aux, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    for (let i = 0; i < this.state.idAptitudesToInsert.length; i++) {
      if (
        this.state.studentAptitudes.find(
          (obj) => obj.id === this.state.idAptitudesToInsert[i]
        ) === undefined
      ) {
        const studentAptitude = {
          idStudent: this.state.userId,
          idAptitude: this.state.idAptitudesToInsert[i],
        };

        let aux = "api/studentaptitudes";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentAptitude),
        });
      }
    }

    this.setState({
      studentAptitudes: this.state.studentAptitudesAux,
      aptitudesIsOpen: false,
    });
  };

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

      let idForeignLanguagesToDelete = JSON.parse(
        JSON.stringify(
          this.state.idForeignLanguagesToDelete.filter(
            (obj) => obj !== searchedForeignLanguage.id
          )
        )
      );

      let idForeignLanguagesToInsert = JSON.parse(
        JSON.stringify(this.state.idForeignLanguagesToInsert)
      );
      idForeignLanguagesToInsert.push(searchedForeignLanguage.id);

      this.setState({
        foreignLanguagesSelectedOption: changeEvent,
        studentForeignLanguagesAux: modifiedStudentForeignLanguagesAux,
        idForeignLanguagesToInsert: idForeignLanguagesToInsert,
        idForeignLanguagesToDelete: idForeignLanguagesToDelete,
      });
    }
  };

  handleStudentForeignLanguageDelete = async (idForeignLanguage) => {
    const filteredIdForeignLanguagesToInsert = JSON.parse(
      JSON.stringify(
        this.state.idForeignLanguagesToInsert.filter((obj) => obj !== idForeignLanguage)
      )
    );

    const filteredForeignLanguages = JSON.parse(
      JSON.stringify(
        this.state.studentForeignLanguagesAux.filter((foreignLanguage) => {
          return foreignLanguage.id !== idForeignLanguage;
        })
      )
    );

    let idForeignLanguagesToDelete = JSON.parse(
      JSON.stringify(this.state.idForeignLanguagesToDelete)
    );
    idForeignLanguagesToDelete.push(idForeignLanguage);

    this.setState({
      studentForeignLanguagesAux: filteredForeignLanguages,
      idForeignLanguagesToDelete: idForeignLanguagesToDelete,
      idForeignLanguagesToInsert: filteredIdForeignLanguagesToInsert,
    });
  };

  handleStudentForeignLanguagesForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    for (let i = 0; i < this.state.idForeignLanguagesToDelete.length; i++) {
      if (
        this.state.studentForeignLanguages.find(
          (obj) => obj.id === this.state.idForeignLanguagesToDelete[i]
        ) !== undefined
      ) {
        let aux =
          "api/studentforeignLanguages/student/" +
          this.state.userId +
          "/foreignLanguage/" +
          this.state.idForeignLanguagesToDelete[i];
        await fetch(aux, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    for (let i = 0; i < this.state.idForeignLanguagesToInsert.length; i++) {
      if (
        this.state.studentForeignLanguages.find(
          (obj) => obj.id === this.state.idForeignLanguagesToInsert[i]
        ) === undefined
      ) {
        const studentForeignLanguage = {
          idStudent: this.state.userId,
          idForeignLanguage: this.state.idForeignLanguagesToInsert[i],
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

  // EDUCATION FUNCTIONALITY ----------------------------------------------------------------------------
  handleEducationStartDateChange = (changeEvent) => {
    this.setState({
      educationStartDate: changeEvent.target.value,
    });
  };

  handleEducationEndDateChange = (changeEvent) => {
    this.setState({
      educationEndDate: changeEvent.target.value,
    });
  };

  handleEducationInstitutionChange = (changeEvent) => {
    this.setState({
      educationInstitution: changeEvent.target.value,
    });
  };

  handleEducationSpecializationChange = (changeEvent) => {
    this.setState({
      educationSpecialization: changeEvent.target.value,
    });
  };

  handleEducationCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let newEducation = {
      startDate: this.state.educationStartDate,
      endDate: this.state.educationEndDate,
      institution: this.state.educationInstitution,
      specialization: this.state.educationSpecialization,
      idStudent: this.state.userId,
    };

    let aux = "api/educations";
    const educationResponse = await fetch(aux, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newEducation),
    });
    let educationData = "";
    if (educationResponse.ok) educationData = await educationResponse.json();

    let newStudentEducations = JSON.parse(JSON.stringify(this.state.studentEducations));
    newStudentEducations.push(educationData);

    this.setState({
      studentEducations: newStudentEducations,
      educationsCreateIsOpen: false,
    });
  };

  handleEducationModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedEducation = {
      id: this.state.educationId,
      startDate: this.state.educationStartDate,
      endDate: this.state.educationEndDate,
      institution: this.state.educationInstitution,
      specialization: this.state.educationSpecialization,
      idStudent: this.state.userId,
    };

    let modifiedStudentEducations = JSON.parse(
      JSON.stringify(this.state.studentEducations)
    );

    for (let i = 0; i < modifiedStudentEducations.length; i++) {
      if (modifiedStudentEducations[i].id === this.state.educationId) {
        modifiedStudentEducations[i] = modifiedEducation;
        break;
      }
    }

    this.setState({
      studentEducations: modifiedStudentEducations,
    });
    let aux = "api/educations/" + modifiedEducation.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedEducation),
    });
    this.setState({
      educationsModifyIsOpen: false,
    });
  };

  handleEducationDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentEducations = JSON.parse(
      JSON.stringify(this.state.studentEducations)
    );

    modifiedStudentEducations = modifiedStudentEducations.filter(
      (studentEducation) => studentEducation.id !== this.state.educationId
    );
    this.setState({
      studentEducations: modifiedStudentEducations,
      educationsModifyIsOpen: false,
    });

    let aux = "api/educations/" + this.state.educationId;
    await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // EXPERIENCE FUNCTIONALITY ----------------------------------------------------------------------------
  handleExperienceStartDateChange = (changeEvent) => {
    this.setState({
      experienceStartDate: changeEvent.target.value,
    });
  };

  handleExperienceEndDateChange = (changeEvent) => {
    this.setState({
      experienceEndDate: changeEvent.target.value,
    });
  };

  handleExperiencePositionChange = (changeEvent) => {
    this.setState({
      experiencePosition: changeEvent.target.value,
    });
  };

  handleExperienceCompanyChange = (changeEvent) => {
    this.setState({
      experienceCompany: changeEvent.target.value,
    });
  };

  handleExperienceDescriptionChange = (changeEvent) => {
    this.setState({
      experienceDescription: changeEvent.target.value,
    });
  };

  handleExperienceCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let newExperience = {
      startDate: this.state.experienceStartDate,
      endDate: this.state.experienceEndDate,
      position: this.state.experiencePosition,
      company: this.state.experienceCompany,
      description: this.state.experienceDescription,
      idStudent: this.state.userId,
    };

    let aux = "api/experiences";
    const experienceResponse = await fetch(aux, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newExperience),
    });
    let experienceData = "";
    if (experienceResponse.ok) experienceData = await experienceResponse.json();

    let newStudentExperiences = JSON.parse(JSON.stringify(this.state.studentExperiences));
    newStudentExperiences.push(experienceData);

    this.setState({
      studentExperiences: newStudentExperiences,
      experiencesCreateIsOpen: false,
    });
  };

  handleExperienceModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedExperience = {
      id: this.state.experienceId,
      startDate: this.state.experienceStartDate,
      endDate: this.state.experienceEndDate,
      position: this.state.experiencePosition,
      company: this.state.experienceCompany,
      description: this.state.experienceDescription,
      idStudent: this.state.userId,
    };

    let modifiedStudentExperiences = JSON.parse(
      JSON.stringify(this.state.studentExperiences)
    );

    for (let i = 0; i < modifiedStudentExperiences.length; i++) {
      if (modifiedStudentExperiences[i].id === this.state.experienceId) {
        modifiedStudentExperiences[i] = modifiedExperience;
        break;
      }
    }

    this.setState({
      studentExperiences: modifiedStudentExperiences,
    });
    let aux = "api/experiences/" + modifiedExperience.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedExperience),
    });
    this.setState({
      experiencesModifyIsOpen: false,
    });
  };

  handleExperienceDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentExperiences = JSON.parse(
      JSON.stringify(this.state.studentExperiences)
    );

    modifiedStudentExperiences = modifiedStudentExperiences.filter(
      (studentExperience) => studentExperience.id !== this.state.experienceId
    );
    this.setState({
      studentExperiences: modifiedStudentExperiences,
      experiencesModifyIsOpen: false,
    });

    let aux = "api/experiences/" + this.state.experienceId;
    await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
      idStudent: this.state.userId,
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
      idStudent: this.state.userId,
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

  changeBackgroundOver = (changeEvent) => {
    if (changeEvent.target.className === "col-xs")
      changeEvent.target.parentElement.parentElement.style.background =
        "rgba(128,128,128,0.75)";
    else if (changeEvent.target.className === "row")
      changeEvent.target.parentElement.style.background = "rgba(128,128,128,0.75)";
    else if (changeEvent.target.tagName === "B" || changeEvent.target.tagName === "H3")
      changeEvent.target.parentElement.parentElement.parentElement.style.background =
        "rgba(128,128,128,0.75)";
    else changeEvent.target.style.background = "rgba(128,128,128,0.75)";
    changeEvent.target.style.cursor = "pointer";
  };

  changeBackgroundOut = (changeEvent) => {
    if (changeEvent.target.className === "col-xs")
      changeEvent.target.parentElement.parentElement.style.background = "none";
    else if (changeEvent.target.className === "row")
      changeEvent.target.parentElement.style.background = "none";
    else if (changeEvent.target.tagName === "B" || changeEvent.target.tagName === "H3")
      changeEvent.target.parentElement.parentElement.parentElement.style.background =
        "none";
    else changeEvent.target.style.background = "none";
    changeEvent.target.style.cursor = "none";
  };

  handleStudentPhotoChange = (event) => {
    event.preventDefault();
    this.photoFileName = event.target.files[0].name;
    const formData = new FormData();
    formData.append("myFile", event.target.files[0], event.target.files[0].name);

    console.log(formData);

    this.setState({ photoFormData: formData });

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("photo");
        img.file = file;
        preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

        const reader = new FileReader();
        reader.onload = (function (aImg) {
          return function (e) {
            aImg.src = e.target.result;
          };
        })(img);
        reader.readAsDataURL(file);
      }
    };
    handleFiles(event.target.files[0]);
  };

  handleStudentPhotoFormSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    await fetch("api/students/savefile/" + this.state.student.id, {
      method: "POST",
      body: this.state.photoFormData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            studentPhotoPath: result,
          });
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    var modifiedStudent = this.state.student;
    modifiedStudent.photoPath = this.state.studentPhotoPath;
    this.setState({
      student: modifiedStudent,
    });
    var aux = "api/students/" + this.state.userId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(this.state.student),
    });

    this.setState({ photoIsOpen: false });
  };

  renderProfileData() {
    return (
      <div>
        <div
          className="border border border-5 shadow p-3 mb-5 bg-body rounded"
          style={{
            width: 900,
            backgroundColor: "white",
            margin: "auto",
            padding: 50,
          }}
        >
          <div
            className="container rounded"
            style={{
              padding: 10,
              paddingRight: 25,
              paddingLeft: 25,
              width: "850",
            }}
            onMouseOver={this.changeBackgroundOver}
            onMouseOut={this.changeBackgroundOut}
            onClick={(event) => {
              this.setState({ nameIsOpen: true });
              this.changeBackgroundOut(event);
            }}
          >
            <div className="row">
              <div
                className="col-xs"
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
                  Nume: {this.state.student["lastName"]}
                  &nbsp;
                  {this.state.student["firstName"]}
                </h3>
              </div>
            </div>
          </div>

          <Modal
            open={this.state.nameIsOpen}
            onClose={() =>
              this.setState({
                nameIsOpen: false,
                studentLastName: this.state.student.lastName,
                studentFirstName: this.state.student.firstName,
              })
            }
          >
            <h5>Nume si prenume</h5>
            <form onSubmit={this.handleStudentNameForm}>
              <div>
                Nume:
                <input
                  type="text"
                  name="studentName"
                  className="form-control"
                  value={this.state.studentLastName}
                  onChange={this.handleStudentLastNameChange}
                />
              </div>

              <div>
                Prenume:
                <input
                  type="text"
                  name="studentName"
                  className="form-control"
                  value={this.state.studentFirstName}
                  onChange={this.handleStudentFirstNameChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>

          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <Link to="#">
                  <img
                    width="200"
                    height="200"
                    alt="photo"
                    src={"photos/" + this.state.student.photoPath}
                    onClick={(event) =>
                      this.setState({
                        photoIsOpen: true,
                      })
                    }
                  />
                </Link>

                <Modal
                  open={this.state.photoIsOpen}
                  onClose={() =>
                    this.setState({
                      photoIsOpen: false,
                    })
                  }
                >
                  <form onSubmit={this.handleStudentPhotoFormSubmit}>
                    <div id="thumbnail">
                      Imagine profil:
                      <input type="file" onChange={this.handleStudentPhotoChange} />
                    </div>

                    <div>
                      <button className="btn btn-primary mt-2" type="submit">
                        Salveaza
                      </button>
                    </div>
                  </form>
                </Modal>
              </div>
              <div className="col-md-8">
                <div
                  className="container rounded"
                  style={{
                    marginTop: 10,
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    width: "850",
                  }}
                  onMouseOver={this.changeBackgroundOver}
                  onMouseOut={this.changeBackgroundOut}
                  onClick={(event) => {
                    this.setState({
                      phoneNumberIsOpen: true,
                    });
                    this.changeBackgroundOut(event);
                  }}
                >
                  <div className="row">
                    <div
                      className="col-xs"
                      style={{
                        display: "inline-block",
                        whiteSpace: "pre-line",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          color: "#0c56a5",
                        }}
                      >
                        <Icon.TelephoneFill />
                        {this.state.student.phoneNumber}
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </div>

                <Modal
                  open={this.state.phoneNumberIsOpen}
                  onClose={() =>
                    this.setState({
                      phoneNumberIsOpen: false,
                      studentPhoneNumber: this.state.student.phoneNumber,
                    })
                  }
                >
                  <h5>Număr de telefon</h5>
                  <form onSubmit={this.handleStudentPhoneNumberForm}>
                    <div>
                      Număr de telefon:
                      <input
                        type="text"
                        name="studentPhoneNumber"
                        className="form-control"
                        value={this.state.studentPhoneNumber}
                        onChange={this.handleStudentPhoneNumberChange}
                      />
                    </div>

                    <div>
                      <button className="btn btn-primary mt-2" type="submit">
                        Salveaza
                      </button>
                    </div>
                  </form>
                </Modal>

                <br />
                <div style={{ paddingLeft: 10 }}>
                  <Icon.EnvelopeFill /> {this.state.studentEmail}
                </div>
                <br />

                <div
                  className="container rounded"
                  style={{
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    width: "850",
                  }}
                  onMouseOver={this.changeBackgroundOver}
                  onMouseOut={this.changeBackgroundOut}
                  onClick={(event) => {
                    this.setState({
                      facultyIsOpen: true,
                    });
                    this.changeBackgroundOut(event);
                  }}
                >
                  <div className="row">
                    <div className="col-xs">Facultate:&nbsp;&nbsp;</div>
                    <div
                      className="col-xs"
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
                        {this.state.student["faculty"]}
                        <br />
                        {this.state.student["specialization"]}, anul&nbsp;
                        {this.state.student["year"]}
                      </b>
                    </div>
                  </div>
                </div>

                <Modal
                  open={this.state.facultyIsOpen}
                  onClose={() =>
                    this.setState({
                      facultyIsOpen: false,
                      studentFaculty: this.state.student.faculty,
                      studentSpecialization: this.state.student.specialization,
                      studentYear: this.state.student.year,
                    })
                  }
                >
                  <h5>Facultate</h5>
                  <form onSubmit={this.handleStudentFacultyForm}>
                    <div>
                      Facultate:
                      <input
                        type="text"
                        name="studentFaculty"
                        className="form-control"
                        value={this.state.studentFaculty}
                        onChange={this.handleStudentFacultyChange}
                      />
                    </div>
                    <p></p>
                    <div>
                      Specializare:
                      <input
                        type="text"
                        name="studentFaculty"
                        className="form-control"
                        value={this.state.studentSpecialization}
                        onChange={this.handleStudentSpecializationChange}
                      />
                    </div>
                    <p></p>
                    <div>
                      An de studiu:
                      <input
                        type="text"
                        name="studentFaculty"
                        className="form-control"
                        value={this.state.studentYear}
                        onChange={this.handleStudentYearChange}
                      />
                    </div>

                    <div>
                      <button className="btn btn-primary mt-2" type="submit">
                        Salveaza
                      </button>
                    </div>
                  </form>
                </Modal>
                <div
                  className="container rounded"
                  style={{
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    width: "850",
                  }}
                  onMouseOver={this.changeBackgroundOver}
                  onMouseOut={this.changeBackgroundOut}
                  onClick={(event) => {
                    this.setState({
                      annualAverageIsOpen: true,
                    });
                    this.changeBackgroundOut(event);
                  }}
                >
                  <div className="row">
                    <div className="col-xs">Medie anuala:&nbsp;&nbsp;</div>
                    <div
                      className="col-xs"
                      style={{
                        display: "inline-block",
                        whiteSpace: "pre-line",
                      }}
                    >
                      <b>{this.state.student["annualAverage"]}</b>
                    </div>
                  </div>
                </div>
                <Modal
                  open={this.state.annualAverageIsOpen}
                  onClose={() =>
                    this.setState({
                      annualAverageIsOpen: false,
                      studentAnnualAverage: this.state.student.annualAverage,
                    })
                  }
                >
                  <h5>Medie anuala</h5>
                  <form onSubmit={this.handleStudentAnnualAverageForm}>
                    <div>
                      Medie anuala:
                      <input
                        type="text"
                        name="studentAnnualAverage"
                        className="form-control"
                        value={this.state.studentAnnualAverage}
                        onChange={this.handleStudentAnnualAverageChange}
                      />
                    </div>

                    <div>
                      <button className="btn btn-primary mt-2" type="submit">
                        Salveaza
                      </button>
                    </div>
                  </form>
                </Modal>
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
            className="container rounded"
            style={{
              padding: 10,
              paddingRight: 25,
              paddingLeft: 25,
              width: 850,
            }}
            onMouseOver={this.changeBackgroundOver}
            onMouseOut={this.changeBackgroundOut}
            onClick={(event) => {
              this.setState({
                personalDescriptionIsOpen: true,
              });
              this.changeBackgroundOut(event);
            }}
          >
            <div style={{}} className="row">
              <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
                <b
                  style={{
                    wordBreak: "break-all",
                    wordWrap: "break-word",
                  }}
                >
                  {this.state.student["personalDescription"]}
                </b>
              </div>
            </div>
          </div>
          <br />
          <Modal
            open={this.state.personalDescriptionIsOpen}
            onClose={() =>
              this.setState({
                personalDescriptionIsOpen: false,
                studentPersonalDescription: this.state.student.personalDescription,
              })
            }
          >
            <h5>Descriere personala</h5>
            <form onSubmit={this.handleStudentPersonalDescriptionForm}>
              <div>
                Descriere personala:
                <textarea
                  type="text"
                  className="form-control"
                  name="studentPersonalDescription"
                  value={this.state.studentPersonalDescription}
                  onChange={this.handleStudentPersonalDescriptionChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
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
            className="container rounded"
            style={{
              padding: 10,
              paddingRight: 25,
              paddingLeft: 25,
              width: "850",
            }}
            onMouseOver={this.changeBackgroundOver}
            onMouseOut={this.changeBackgroundOut}
            onClick={(event) => {
              this.setState({
                aptitudesIsOpen: true,
              });
              this.changeBackgroundOut(event);
            }}
          >
            <div className="row">
              <div
                className="col-xs"
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
                  {this.state.studentAptitudes !== []
                    ? this.state.studentAptitudes
                        .map((aptitude) => aptitude.name)
                        .join(", ")
                    : ""}
                </b>
              </div>
            </div>
          </div>
          <Modal
            open={this.state.aptitudesIsOpen}
            onClose={() =>
              this.setState({
                aptitudesIsOpen: false,
                studentAptitudesAux: this.state.studentAptitudes,
                idAptitudesToDelete: [],
              })
            }
          >
            <h5>Aptitudini</h5>
            <form onSubmit={this.handleStudentAptitudesForm}>
              {this.state.studentAptitudesAux !== []
                ? this.state.studentAptitudesAux.map((aptitude) => (
                    <Aptitude
                      key={aptitude.id}
                      id={aptitude.id}
                      name={aptitude.name}
                      onDelete={this.handleStudentAptitudeDelete}
                    />
                  ))
                : ""}

              <Select
                placeholder="Selecteaza aptitudine"
                value={this.state.aptitudesSelectedOption}
                options={this.state.aptitudesOptions}
                onChange={this.handleAptitudesOptionChange}
              />

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
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
          <div style={{ paddingLeft: 8 }}>
            <button
              className="btn btn-primary btn"
              onClick={() => {
                this.setState({
                  educationsCreateIsOpen: true,
                  educationId: "",
                  educationStartDate: "",
                  educationEndDate: "",
                  educationInstitution: "",
                  educationSpecialization: "",
                });
              }}
            >
              +
            </button>
          </div>
          <Modal
            open={this.state.educationsCreateIsOpen}
            onClose={() =>
              this.setState({
                educationsCreateIsOpen: false,
              })
            }
          >
            <h5>Educatie</h5>
            <form onSubmit={this.handleEducationCreateForm}>
              <div>
                Data inceput:
                <input
                  type="date"
                  name="education"
                  className="form-control"
                  value={this.state.educationStartDate}
                  onChange={this.handleEducationStartDateChange}
                />
              </div>

              <div>
                Data sfarsit:
                <input
                  type="date"
                  name="education"
                  className="form-control"
                  value={this.state.educationEndDate}
                  onChange={this.handleEducationEndDateChange}
                />
              </div>

              <div>
                Institutie:
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  value={this.state.educationInstitution}
                  onChange={this.handleEducationInstitutionChange}
                />
              </div>

              <div>
                Specializare:
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  value={this.state.educationSpecialization}
                  onChange={this.handleEducationSpecializationChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
          <p></p>
          {this.state.studentEducations.map((education, index) => (
            <span key={index}>
              <div
                className="container rounded"
                style={{
                  padding: 10,
                  paddingRight: 25,
                  paddingLeft: 25,
                  width: "850",
                }}
                onMouseOver={this.changeBackgroundOver}
                onMouseOut={this.changeBackgroundOut}
                onClick={(event) => {
                  this.setState({
                    educationsModifyIsOpen: true,
                    educationId: education.id,
                    educationStartDate: education.startDate,
                    educationEndDate: education.endDate,
                    educationInstitution: education.institution,
                    educationSpecialization: education.specialization,
                  });
                  this.changeBackgroundOut(event);
                }}
              >
                <div className="row">
                  <div className="col-xs">
                    {education["startDate"]} -&nbsp;
                    {education["endDate"]}
                    &nbsp;&nbsp;
                  </div>
                  <div
                    className="col-xs"
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

              <Modal
                open={this.state.educationsModifyIsOpen}
                onClose={() =>
                  this.setState({
                    educationsModifyIsOpen: false,
                  })
                }
              >
                <h5>Educatie</h5>
                <form onSubmit={this.handleEducationModifyForm}>
                  <div>
                    Data inceput:
                    <input
                      type="date"
                      name="education"
                      className="form-control"
                      value={this.state.educationStartDate}
                      onChange={this.handleEducationStartDateChange}
                    />
                  </div>

                  <div>
                    Data sfarsit:
                    <input
                      type="date"
                      name="education"
                      className="form-control"
                      value={this.state.educationEndDate}
                      onChange={this.handleEducationEndDateChange}
                    />
                  </div>

                  <div>
                    Institutie:
                    <input
                      type="text"
                      name="education"
                      className="form-control"
                      value={this.state.educationInstitution}
                      onChange={this.handleEducationInstitutionChange}
                    />
                  </div>

                  <div>
                    Specializare:
                    <input
                      type="text"
                      name="education"
                      className="form-control"
                      value={this.state.educationSpecialization}
                      onChange={this.handleEducationSpecializationChange}
                    />
                  </div>

                  <div>
                    <button className="btn btn-primary mt-2" type="submit">
                      Salveaza
                    </button>
                  </div>
                </form>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handleEducationDelete}
                  >
                    Sterge
                  </button>
                </div>
              </Modal>
            </span>
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
          <div style={{ paddingLeft: 8 }}>
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                this.setState({
                  experiencesCreateIsOpen: true,
                  experienceId: "",
                  experienceStartDate: "",
                  experienceEndDate: "",
                  experiencePosition: "",
                  experienceCompany: "",
                  experienceDescription: "",
                });
              }}
            >
              +
            </button>
          </div>
          <Modal
            open={this.state.experiencesCreateIsOpen}
            onClose={() =>
              this.setState({
                experiencesCreateIsOpen: false,
              })
            }
          >
            <h5>Experienta</h5>
            <form onSubmit={this.handleExperienceCreateForm}>
              <div>
                Data inceput:
                <input
                  type="date"
                  name="experience"
                  className="form-control"
                  value={this.state.experienceStartDate}
                  onChange={this.handleExperienceStartDateChange}
                />
              </div>

              <div>
                Data sfarsit:
                <input
                  type="date"
                  name="experience"
                  className="form-control"
                  value={this.state.experienceEndDate}
                  onChange={this.handleExperienceEndDateChange}
                />
              </div>

              <div>
                Pozitie:
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={this.state.experiencePosition}
                  onChange={this.handleExperiencePositionChange}
                />
              </div>

              <div>
                Companie:
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={this.state.experienceCompany}
                  onChange={this.handleExperienceCompanyChange}
                />
              </div>

              <div>
                Descriere:
                <textarea
                  type="text"
                  className="form-control"
                  name="experience"
                  value={this.state.experienceDescription}
                  onChange={this.handleExperienceDescriptionChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
          <p></p>
          {this.state.studentExperiences.map((experience, index) => (
            <span key={index}>
              <div
                className="container rounded"
                style={{
                  padding: 10,
                  paddingRight: 25,
                  paddingLeft: 25,
                  width: "850",
                }}
                onMouseOver={this.changeBackgroundOver}
                onMouseOut={this.changeBackgroundOut}
                onClick={(event) => {
                  this.setState({
                    experiencesModifyIsOpen: true,
                    experienceId: experience.id,
                    experienceStartDate: experience.startDate,
                    experienceEndDate: experience.endDate,
                    experiencePosition: experience.position,
                    experienceCompany: experience.company,
                    experienceDescription: experience.description,
                  });
                  this.changeBackgroundOut(event);
                }}
              >
                <div className="row">
                  <div className="col-xs">
                    {experience["startDate"]} -&nbsp;
                    {experience["endDate"]} &nbsp;&nbsp;
                  </div>
                  <div
                    className="col-xs"
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

              <Modal
                open={this.state.experiencesModifyIsOpen}
                onClose={() =>
                  this.setState({
                    experiencesModifyIsOpen: false,
                  })
                }
              >
                <h5>Experienta</h5>

                <form onSubmit={this.handleExperienceModifyForm}>
                  <div>
                    Data inceput:
                    <input
                      type="date"
                      name="experience"
                      className="form-control"
                      value={this.state.experienceStartDate}
                      onChange={this.handleExperienceStartDateChange}
                    />
                  </div>

                  <div>
                    Data sfarsit:
                    <input
                      type="date"
                      name="experience"
                      className="form-control"
                      value={this.state.experienceEndDate}
                      onChange={this.handleExperienceEndDateChange}
                    />
                  </div>

                  <div>
                    Pozitie:
                    <input
                      type="text"
                      name="experience"
                      className="form-control"
                      value={this.state.experiencePosition}
                      onChange={this.handleExperiencePositionChange}
                    />
                  </div>

                  <div>
                    Companie:
                    <input
                      type="text"
                      name="experience"
                      className="form-control"
                      value={this.state.experienceCompany}
                      onChange={this.handleExperienceCompanyChange}
                    />
                  </div>

                  <div>
                    Descriere:
                    <textarea
                      type="text"
                      className="form-control"
                      name="experience"
                      value={this.state.experienceDescription}
                      onChange={this.handleExperienceDescriptionChange}
                    />
                  </div>

                  <div>
                    <button className="btn btn-primary mt-2" type="submit">
                      Salveaza
                    </button>
                  </div>
                </form>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handleExperienceDelete}
                  >
                    Sterge
                  </button>
                </div>
              </Modal>
            </span>
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
          <div style={{ paddingLeft: 8 }}>
            <button
              className="btn btn-primary mt-2"
              onClick={(event) => {
                this.setState({
                  projectsCreateIsOpen: true,
                  projectId: "",
                  projectStartDate: "",
                  projectEndDate: "",
                  projectTitle: "",
                  projectDescription: "",
                });
              }}
            >
              +
            </button>
          </div>
          <Modal
            open={this.state.projectsCreateIsOpen}
            onClose={() =>
              this.setState({
                projectsCreateIsOpen: false,
              })
            }
          >
            <h5>Proiect</h5>
            <form onSubmit={this.handleProjectCreateForm}>
              <div>
                Data inceput:
                <input
                  type="date"
                  name="project"
                  className="form-control"
                  value={this.state.projectStartDate}
                  onChange={this.handleProjectStartDateChange}
                />
              </div>

              <div>
                Data sfarsit:
                <input
                  type="date"
                  name="project"
                  className="form-control"
                  value={this.state.projectEndDate}
                  onChange={this.handleProjectEndDateChange}
                />
              </div>

              <div>
                Institutie:
                <input
                  type="text"
                  name="project"
                  className="form-control"
                  value={this.state.projectTitle}
                  onChange={this.handleProjectTitleChange}
                />
              </div>

              <div>
                Specializare:
                <input
                  type="text"
                  name="project"
                  className="form-control"
                  value={this.state.projectDescription}
                  onChange={this.handleProjectDescriptionChange}
                />
              </div>

              <div>
                Descriere:
                <textarea
                  type="text"
                  name="project"
                  className="form-control"
                  value={this.state.projectDescription}
                  onChange={this.handleProjectDescriptionChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
          <p></p>
          {this.state.studentProjects.map((project, index) => (
            <span key={index}>
              <div
                className="container rounded"
                style={{
                  padding: 10,
                  paddingRight: 25,
                  paddingLeft: 25,
                  width: 850,
                }}
                onMouseOver={this.changeBackgroundOver}
                onMouseOut={this.changeBackgroundOut}
                onClick={(event) => {
                  this.setState({
                    projectsModifyIsOpen: true,
                    projectId: project.id,
                    projectStartDate: project.startDate,
                    projectEndDate: project.endDate,
                    projectTitle: project.title,
                    projectDescription: project.description,
                  });
                  this.changeBackgroundOut(event);
                }}
              >
                <div className="row">
                  <div className="col-xs">
                    {project["startDate"]} -&nbsp;
                    {project["endDate"]} &nbsp;&nbsp;
                  </div>
                  <div
                    className="col-xs"
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

              <Modal
                open={this.state.projectsModifyIsOpen}
                onClose={() =>
                  this.setState({
                    projectsModifyIsOpen: false,
                  })
                }
              >
                <h5>Proiect</h5>
                <form onSubmit={this.handleProjectModifyForm}>
                  <div>
                    Data inceput:
                    <input
                      type="date"
                      name="project"
                      className="form-control"
                      value={this.state.projectStartDate}
                      onChange={this.handleProjectStartDateChange}
                    />
                  </div>

                  <div>
                    Data sfarsit:
                    <input
                      type="date"
                      name="project"
                      className="form-control"
                      value={this.state.projectEndDate}
                      onChange={this.handleProjectEndDateChange}
                    />
                  </div>

                  <div>
                    Titlu:
                    <input
                      type="text"
                      name="project"
                      className="form-control"
                      value={this.state.projectTitle}
                      onChange={this.handleProjectTitleChange}
                    />
                  </div>

                  <div>
                    Descriere:
                    <textarea
                      type="text"
                      name="project"
                      className="form-control"
                      value={this.state.projectDescription}
                      onChange={this.handleProjectDescriptionChange}
                    />
                  </div>

                  <div>
                    <button className="btn btn-primary mt-2" type="submit">
                      Salveaza
                    </button>
                  </div>
                </form>

                <div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handleProjectDelete}
                  >
                    Sterge
                  </button>
                </div>
              </Modal>
            </span>
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
            className="container rounded"
            style={{
              padding: 10,
              paddingRight: 25,
              paddingLeft: 25,
              width: "850",
            }}
            onMouseOver={this.changeBackgroundOver}
            onMouseOut={this.changeBackgroundOut}
            onClick={(event) => {
              this.setState({
                foreignLanguagesIsOpen: true,
              });
              this.changeBackgroundOut(event);
            }}
          >
            <div className="row">
              <div
                className="col-xs"
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
                  {this.state.studentForeignLanguages !== []
                    ? this.state.studentForeignLanguages
                        .map((foreignLanguage) => foreignLanguage.name)
                        .join(", ")
                    : ""}
                </b>
              </div>
            </div>
          </div>
          <Modal
            open={this.state.foreignLanguagesIsOpen}
            onClose={() =>
              this.setState({
                foreignLanguagesIsOpen: false,
                studentForeignLanguagesAux: this.state.studentForeignLanguages,
                idForeignLanguagesToDelete: [],
              })
            }
          >
            <h5>Limbi straine</h5>
            <form onSubmit={this.handleStudentForeignLanguagesForm}>
              {this.state.studentForeignLanguagesAux !== []
                ? this.state.studentForeignLanguagesAux.map((foreignLanguage) => (
                    <ForeignLanguage
                      key={foreignLanguage.id}
                      id={foreignLanguage.id}
                      name={foreignLanguage.name}
                      onDelete={this.handleStudentForeignLanguageDelete}
                    />
                  ))
                : ""}

              <Select
                placeholder="Selecteaza limba straina"
                value={this.state.foreignLanguagesSelectedOption}
                options={this.state.foreignLanguagesOptions}
                onChange={this.handleForeignLanguagesOptionChange}
              />

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
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
            className="container rounded"
            style={{
              padding: 10,
              paddingRight: 25,
              paddingLeft: 25,
              width: "850",
            }}
            onMouseOver={this.changeBackgroundOver}
            onMouseOut={this.changeBackgroundOut}
            onClick={(event) => {
              this.setState({
                passionsIsOpen: true,
              });
              this.changeBackgroundOut(event);
            }}
          >
            <div className="row">
              <div
                className="col-xs"
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
                  {this.state.student["passions"]}
                </b>
              </div>
            </div>
          </div>
          <Modal
            open={this.state.passionsIsOpen}
            onClose={() =>
              this.setState({
                passionsIsOpen: false,
                studentPassions: this.state.student.passions,
              })
            }
          >
            <h5>Pasiuni</h5>
            <form onSubmit={this.handleStudentPassionsForm}>
              <div>
                Pasiuni:
                <input
                  type="text"
                  name="studentPassions"
                  className="form-control"
                  value={this.state.studentPassions}
                  onChange={this.handleStudentPassionsChange}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-2" type="submit">
                  Salveaza
                </button>
              </div>
            </form>
          </Modal>
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
