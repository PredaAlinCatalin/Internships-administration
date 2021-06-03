import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { getAptitudesOptions } from "../../Utility/Utility";
import Select from "react-select";
import Aptitude from "../../Universal/SelectElement";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { getFormattedDateNoTime } from "../../Utility/Utility";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import CreateIcon from "@material-ui/icons/Create";

const EducationForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    educationId: "",
    educationStartDate: new Date("2019-06-01"),
    educationEndDate: new Date("2021-06-01"),
    educationInstitution: "",
    educationSpecialization: "",
    studentEducations: "",
  });
  const [loading, setLoading] = useState(true);
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [modifyIsOpen, setModifyIsOpen] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState("");
  const [errorInstitution, setErrorInstitution] = useState("");
  const [errorSpecialization, setErrorSpecialization] = useState("");
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    const populateWithData = async () => {
      let studentResponse = await fetch("api/students/" + studentId);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
      }

      const studentEducationsResponse = await fetch(
        "api/educations/student/" + studentId
      );
      let studentEducationsData = [];
      if (studentEducationsResponse.ok)
        studentEducationsData = await studentEducationsResponse.json();

      setInput({
        ...input,
        studentEducations: studentEducationsData,
      });

      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    if (createIsOpen) setCreateIsOpen(false);
    else if (modifyIsOpen) setModifyIsOpen(false);
    setErrorStartDate("");
    setErrorEndDate("");
    setErrorInstitution("");
    setErrorSpecialization("");
    setValidated(false);
  };

  // EDUCATION FUNCTIONALITY ----------------------------------------------------------------------------
  const handleEducationStartDateChange = (changeEvent) => {
    setInput({
      ...input,
      educationStartDate: changeEvent,
    });
    setErrorStartDate("");
  };

  const handleEducationEndDateChange = (changeEvent) => {
    setInput({
      ...input,
      educationEndDate: changeEvent,
    });
    setErrorEndDate("");
  };

  const handleEducationInstitutionChange = (changeEvent) => {
    setInput({
      ...input,
      educationInstitution: changeEvent.target.value,
    });
    setErrorInstitution("");
  };

  const handleEducationSpecializationChange = (changeEvent) => {
    setInput({
      ...input,
      educationSpecialization: changeEvent.target.value,
    });
    setErrorSpecialization("");
  };

  const handleEducationCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    // const form = formSubmitEvent.currentTarget;
    // if (form.checkValidity() === false) {
    //   formSubmitEvent.preventDefault();
    //   formSubmitEvent.stopPropagation();
    // }

    // setValidated(true);
    let newEducation = {
      startDate: input.educationStartDate,
      endDate: input.educationEndDate,
      institution: input.educationInstitution,
      specialization: input.educationSpecialization,
      studentId: studentId,
    };

    await axios
      .post("api/educations", newEducation)
      .then((response) => {
        let educationData = response.data;
        let newStudentEducations = JSON.parse(JSON.stringify(input.studentEducations));
        newStudentEducations.push(educationData);

        setInput({
          ...input,
          studentEducations: newStudentEducations,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorSpecialization("");
        setErrorInstitution("");
        setValidated(false);

        setCreateIsOpen(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.errors);
          let allErrors = error.response.data.errors;
          if (allErrors.StartDate !== undefined)
            setErrorStartDate(allErrors.StartDate.join(", "));

          if (allErrors.EndDate !== undefined)
            setErrorEndDate(allErrors.EndDate.join(", "));

          if (allErrors.Institution !== undefined)
            setErrorInstitution(allErrors.Institution.join(", "));

          if (allErrors.Specialization !== undefined)
            setErrorSpecialization(allErrors.Specialization.join(", "));

          setValidated(true);
        }
      });
  };

  const handleEducationModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedEducation = {
      id: input.educationId,
      startDate: input.educationStartDate,
      endDate: input.educationEndDate,
      institution: input.educationInstitution,
      specialization: input.educationSpecialization,
      studentId: studentId,
    };

    // let modifiedStudentEducations = JSON.parse(JSON.stringify(input.studentEducations));

    // for (let i = 0; i < modifiedStudentEducations.length; i++) {
    //   if (modifiedStudentEducations[i].id === input.educationId) {
    //     modifiedStudentEducations[i] = modifiedEducation;
    //     break;
    //   }
    // }

    // let aux = "api/educations/" + modifiedEducation.id;
    // const response = await fetch(aux, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },

    //   body: JSON.stringify(modifiedEducation),
    // });
    // if (response.ok) {
    //   setInput({
    //     ...input,
    //     studentEducations: modifiedStudentEducations,
    //   });
    //   setModifyIsOpen(false);
    // }

    await axios
      .put("api/educations/" + modifiedEducation.id, modifiedEducation)
      .then((response) => {
        console.log(response);

        let modifiedStudentEducations = JSON.parse(
          JSON.stringify(input.studentEducations)
        );

        for (let i = 0; i < modifiedStudentEducations.length; i++) {
          if (modifiedStudentEducations[i].id === input.educationId) {
            modifiedStudentEducations[i] = modifiedEducation;
            break;
          }
        }

        setInput({
          ...input,
          studentEducations: modifiedStudentEducations,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorSpecialization("");
        setErrorInstitution("");
        setValidated(false);
        console.log("DA");
        setModifyIsOpen(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.errors);
          let allErrors = error.response.data.errors;
          if (allErrors.StartDate !== undefined)
            setErrorStartDate(allErrors.StartDate.join(", "));

          if (allErrors.EndDate !== undefined)
            setErrorEndDate(allErrors.EndDate.join(", "));

          if (allErrors.Institution !== undefined)
            setErrorInstitution(allErrors.Institution.join(", "));

          if (allErrors.Specialization !== undefined)
            setErrorSpecialization(allErrors.Specialization.join(", "));

          setValidated(true);
        }
      });
  };

  const handleEducationDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentEducations = JSON.parse(JSON.stringify(input.studentEducations));

    modifiedStudentEducations = modifiedStudentEducations.filter(
      (studentEducation) => studentEducation.id !== input.educationId
    );

    let aux = "api/educations/" + input.educationId;
    const response = await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setInput({
        ...input,
        studentEducations: modifiedStudentEducations,
      });
      setModifyIsOpen(false);
    }
  };

  return !loading ? (
    <>
      <div style={{ paddingLeft: 8 }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            setInput({
              ...input,
              educationId: "",
              educationStartDate: new Date("2019-06-01"),
              educationEndDate: new Date("2021-06-01"),
              educationInstitution: "",
              educationSpecialization: "",
            });
            setCreateIsOpen(true);
          }}
          size="small"
          style={{ marginLeft: -50, marginTop: -57 }}
        >
          <AddIcon />
        </Fab>
        <span className="header">EDUCAȚIE</span>
      </div>
      <Modal show={createIsOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Educație</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated}>
          <Modal.Body>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-between">
                <KeyboardDatePicker
                  error={errorStartDate !== ""}
                  helperText={errorStartDate}
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  style={{ margin: 15 }}
                  label="Dată începere"
                  value={input.educationStartDate}
                  onChange={handleEducationStartDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <KeyboardDatePicker
                  error={errorEndDate !== ""}
                  helperText={errorEndDate}
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  style={{ margin: 15 }}
                  label="Dată sfârșit"
                  value={input.educationEndDate}
                  onChange={handleEducationEndDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <TextField
              error={errorInstitution !== ""}
              helperText={errorInstitution}
              label="Instituție"
              style={{ margin: 15 }}
              placeholder="Instituție"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={input.educationInstitution}
              onChange={handleEducationInstitutionChange}
              required={true}
            />
            <TextField
              error={errorSpecialization !== ""}
              helperText={errorSpecialization}
              label="Specializare"
              style={{ margin: 15 }}
              placeholder="Specializare"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={input.educationSpecialization}
              onChange={handleEducationSpecializationChange}
              required={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Închide
              </Button>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleEducationCreateForm}
              >
                Salvează
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {input.studentEducations.map((education, index) => (
        <span key={index}>
          <div
            className="container rounded input-div pen-icon-parent p-2"
            onClick={(event) => {
              setInput({
                ...input,
                educationId: education.id,
                educationStartDate: education.startDate,
                educationEndDate: education.endDate,
                educationInstitution: education.institution,
                educationSpecialization: education.specialization,
              });
              setModifyIsOpen(true);
            }}
          >
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
            <div className="hide">
              <CreateIcon className="pen-icon" />
            </div>
          </div>

          <Modal show={modifyIsOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Educație</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated}>
              <Modal.Body>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-between">
                    <KeyboardDatePicker
                      error={errorStartDate !== ""}
                      helperText={errorStartDate}
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      style={{ margin: 15 }}
                      label="Dată începere"
                      value={input.educationStartDate}
                      onChange={handleEducationStartDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                    <KeyboardDatePicker
                      error={errorEndDate !== ""}
                      helperText={errorEndDate}
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      style={{ margin: 15 }}
                      label="Dată sfârșit"
                      value={input.educationEndDate}
                      onChange={handleEducationEndDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <TextField
                  error={errorInstitution !== ""}
                  helperText={errorInstitution}
                  label="Instituție"
                  style={{ margin: 15 }}
                  placeholder="Instituție"
                  fullWidth
                  margin="normal"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  value={input.educationInstitution}
                  onChange={handleEducationInstitutionChange}
                  required={true}
                />

                <TextField
                  error={errorSpecialization !== ""}
                  helperText={errorSpecialization}
                  label="Specializare"
                  style={{ margin: 15 }}
                  placeholder="Specializare"
                  fullWidth
                  margin="normal"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  value={input.educationSpecialization}
                  onChange={handleEducationSpecializationChange}
                  required={true}
                />
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <Button variant="contained" color="secondary" onClick={handleClose}>
                    Închide
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEducationDelete}
                  >
                    Sterge
                  </Button>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleEducationModifyForm}
                  >
                    Salvează
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </Modal>
        </span>
      ))}
    </>
  ) : (
    <></>
  );
};

export default EducationForm;
