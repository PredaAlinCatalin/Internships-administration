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
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

const ExperienceForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    experienceId: "",
    experienceStartDate: new Date("2019-06-01"),
    experienceEndDate: new Date("2021-06-01"),
    experiencePosition: "",
    experienceCompany: "",
    experienceDescription: "",
    studentExperiences: "",
  });
  const [loading, setLoading] = useState(true);
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [modifyIsOpen, setModifyIsOpen] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState("");
  const [errorPosition, setErrorPosition] = useState("");
  const [errorCompany, setErrorCompany] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    const populateWithData = async () => {
      let studentResponse = await fetch("api/students/" + studentId);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
      }

      const studentExperiencesResponse = await fetch(
        "api/experiences/student/" + studentId
      );
      let studentExperiencesData = [];
      if (studentExperiencesResponse.ok)
        studentExperiencesData = await studentExperiencesResponse.json();

      setInput({
        ...input,
        studentExperiences: studentExperiencesData,
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
    setErrorPosition("");
    setErrorCompany("");
    setValidated(false);
  };

  // EXPERIENCE FUNCTIONALITY ----------------------------------------------------------------------------
  const handleExperienceStartDateChange = (changeEvent) => {
    setInput({
      ...input,
      experienceStartDate: changeEvent,
    });
    setErrorStartDate("");
  };

  const handleExperienceEndDateChange = (changeEvent) => {
    setInput({
      ...input,
      experienceEndDate: changeEvent,
    });
    setErrorEndDate("");
  };

  const handleExperiencePositionChange = (changeEvent) => {
    setInput({
      ...input,
      experiencePosition: changeEvent.target.value,
    });
    setErrorPosition("");
  };

  const handleExperienceCompanyChange = (changeEvent) => {
    setInput({
      ...input,
      experienceCompany: changeEvent.target.value,
    });
    setErrorCompany("");
  };

  const handleExperienceDescriptionChange = (changeEvent) => {
    setInput({
      ...input,
      experienceDescription: changeEvent.target.value,
    });
    setValidated(false);
  };

  const handleExperienceCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    // const form = formSubmitEvent.currentTarget;
    // if (form.checkValidity() === false) {
    //   formSubmitEvent.preventDefault();
    //   formSubmitEvent.stopPropagation();
    // }

    // setValidated(true);
    let newExperience = {
      startDate: input.experienceStartDate,
      endDate: input.experienceEndDate,
      position: input.experiencePosition,
      company: input.experienceCompany,
      description: input.experienceDescription,
      studentId: studentId,
    };

    await axios
      .post("api/experiences", newExperience)
      .then((response) => {
        let experienceData = response.data;
        let newStudentExperiences = JSON.parse(JSON.stringify(input.studentExperiences));
        newStudentExperiences.push(experienceData);

        setInput({
          ...input,
          studentExperiences: newStudentExperiences,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorCompany("");
        setErrorPosition("");
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

          if (allErrors.Position !== undefined)
            setErrorPosition(allErrors.Position.join(", "));

          if (allErrors.Company !== undefined)
            setErrorCompany(allErrors.Company.join(", "));

          if (allErrors.Description !== undefined)
            setErrorDescription(allErrors.Description.join(", "));
          setValidated(true);
        }
      });
  };

  const handleExperienceModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedExperience = {
      id: input.experienceId,
      startDate: input.experienceStartDate,
      endDate: input.experienceEndDate,
      position: input.experiencePosition,
      company: input.experienceCompany,
      description: input.experienceDescription,
      studentId: studentId,
    };

    // let modifiedStudentExperiences = JSON.parse(JSON.stringify(input.studentExperiences));

    // for (let i = 0; i < modifiedStudentExperiences.length; i++) {
    //   if (modifiedStudentExperiences[i].id === input.experienceId) {
    //     modifiedStudentExperiences[i] = modifiedExperience;
    //     break;
    //   }
    // }

    // let aux = "api/experiences/" + modifiedExperience.id;
    // const response = await fetch(aux, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },

    //   body: JSON.stringify(modifiedExperience),
    // });
    // if (response.ok) {
    //   setInput({
    //     ...input,
    //     studentExperiences: modifiedStudentExperiences,
    //   });
    //   setModifyIsOpen(false);
    // }

    await axios
      .put("api/experiences/" + modifiedExperience.id, modifiedExperience)
      .then((response) => {
        console.log(response);

        let modifiedStudentExperiences = JSON.parse(
          JSON.stringify(input.studentExperiences)
        );

        for (let i = 0; i < modifiedStudentExperiences.length; i++) {
          if (modifiedStudentExperiences[i].id === input.experienceId) {
            modifiedStudentExperiences[i] = modifiedExperience;
            break;
          }
        }

        setInput({
          ...input,
          studentExperiences: modifiedStudentExperiences,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorCompany("");
        setErrorPosition("");
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

          if (allErrors.Position !== undefined)
            setErrorPosition(allErrors.Position.join(", "));

          if (allErrors.Company !== undefined)
            setErrorCompany(allErrors.Company.join(", "));

          if (allErrors.Description !== undefined)
            setErrorDescription(allErrors.Description.join(", "));
          setValidated(true);
        }
      });
  };

  const handleExperienceDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentExperiences = JSON.parse(JSON.stringify(input.studentExperiences));

    modifiedStudentExperiences = modifiedStudentExperiences.filter(
      (studentExperience) => studentExperience.id !== input.experienceId
    );

    let aux = "api/experiences/" + input.experienceId;
    const response = await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setInput({
        ...input,
        studentExperiences: modifiedStudentExperiences,
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
              experienceId: "",
              experienceStartDate: new Date("2019-06-01"),
              experienceEndDate: new Date("2021-06-01"),
              experiencePosition: "",
              experienceCompany: "",
              experienceDescription: "",
            });
            setCreateIsOpen(true);
          }}
          size="small"
          style={{ marginLeft: -50, marginTop: -57 }}
        >
          <AddIcon />
        </Fab>
        <span className="header">EXPERIENȚĂ</span>
      </div>
      <Modal show={createIsOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Experiență</Modal.Title>
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
                  value={input.experienceStartDate}
                  onChange={handleExperienceStartDateChange}
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
                  value={input.experienceEndDate}
                  onChange={handleExperienceEndDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <TextField
              error={errorPosition !== ""}
              helperText={errorPosition}
              label="Poziție"
              style={{ margin: 15 }}
              placeholder="Poziție"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={input.experiencePosition}
              onChange={handleExperiencePositionChange}
              required={true}
            />
            <TextField
              error={errorCompany !== ""}
              helperText={errorCompany}
              label="Companie"
              style={{ margin: 15 }}
              placeholder="Companie"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={input.experienceCompany}
              onChange={handleExperienceCompanyChange}
              required={true}
            />

            <Form.Group className="col-md-12" controlId="description">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={input.experienceDescription}
                onChange={handleExperienceDescriptionChange}
                required={true}
              />
              <Form.Control.Feedback type="invalid">
                {errorDescription}
              </Form.Control.Feedback>
            </Form.Group>
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
                onClick={handleExperienceCreateForm}
              >
                Salvează
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {input.studentExperiences.map((experience, index) => (
        <span key={index}>
          <div
            className="container rounded input-div pen-icon-parent p-2"
            onClick={(event) => {
              setInput({
                ...input,
                experienceId: experience.id,
                experienceStartDate: experience.startDate,
                experienceEndDate: experience.endDate,
                experiencePosition: experience.position,
                experienceCompany: experience.company,
                experienceDescription: experience.description,
              });
              setModifyIsOpen(true);
            }}
          >
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
            <div className="hide">
              <CreateIcon className="pen-icon" />
            </div>
          </div>

          <Modal show={modifyIsOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Experiență</Modal.Title>
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
                      value={input.experienceStartDate}
                      onChange={handleExperienceStartDateChange}
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
                      value={input.experienceEndDate}
                      onChange={handleExperienceEndDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <TextField
                  error={errorPosition !== ""}
                  helperText={errorPosition}
                  label="Poziție"
                  style={{ margin: 15 }}
                  placeholder="Poziție"
                  fullWidth
                  margin="normal"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  value={input.experiencePosition}
                  onChange={handleExperiencePositionChange}
                  required={true}
                />

                <TextField
                  error={errorCompany !== ""}
                  helperText={errorCompany}
                  label="Companie"
                  style={{ margin: 15 }}
                  placeholder="Companie"
                  fullWidth
                  margin="normal"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  value={input.experienceCompany}
                  onChange={handleExperienceCompanyChange}
                  required={true}
                />

                <Form.Group className="col-md-12">
                  <Form.Label>Descriere</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={input.experienceDescription}
                    onChange={handleExperienceDescriptionChange}
                    required={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorDescription}
                  </Form.Control.Feedback>
                </Form.Group>
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
                    onClick={handleExperienceDelete}
                  >
                    Sterge
                  </Button>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleExperienceModifyForm}
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

export default ExperienceForm;
