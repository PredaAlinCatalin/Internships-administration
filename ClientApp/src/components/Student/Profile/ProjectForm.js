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

const ProjectForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    projectId: "",
    projectStartDate: new Date("2019-06-01"),
    projectEndDate: new Date("2021-06-01"),
    projectTitle: "",
    projectDescription: "",
    studentProjects: "",
  });
  const [loading, setLoading] = useState(true);
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [modifyIsOpen, setModifyIsOpen] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
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

      const studentProjectsResponse = await fetch("api/projects/student/" + studentId);
      let studentProjectsData = [];
      if (studentProjectsResponse.ok)
        studentProjectsData = await studentProjectsResponse.json();

      setInput({
        ...input,
        studentProjects: studentProjectsData,
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
    setErrorTitle("");
    setValidated(false);
  };

  // PROJECT FUNCTIONALITY ----------------------------------------------------------------------------
  const handleProjectStartDateChange = (changeEvent) => {
    setInput({
      ...input,
      projectStartDate: changeEvent,
    });
    setErrorStartDate("");
  };

  const handleProjectEndDateChange = (changeEvent) => {
    setInput({
      ...input,
      projectEndDate: changeEvent,
    });
    setErrorEndDate("");
  };

  const handleProjectTitleChange = (changeEvent) => {
    setInput({
      ...input,
      projectTitle: changeEvent.target.value,
    });
    setErrorTitle("");
  };

  const handleProjectDescriptionChange = (changeEvent) => {
    setInput({
      ...input,
      projectDescription: changeEvent.target.value,
    });
    setValidated(false);
  };

  const handleProjectCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    // const form = formSubmitEvent.currentTarget;
    // if (form.checkValidity() === false) {
    //   formSubmitEvent.preventDefault();
    //   formSubmitEvent.stopPropagation();
    // }

    // setValidated(true);
    let newProject = {
      startDate: input.projectStartDate,
      endDate: input.projectEndDate,
      title: input.projectTitle,
      description: input.projectDescription,
      studentId: studentId,
    };

    await axios
      .post("api/projects", newProject)
      .then((response) => {
        let projectData = response.data;
        let newStudentProjects = JSON.parse(JSON.stringify(input.studentProjects));
        newStudentProjects.push(projectData);

        setInput({
          ...input,
          studentProjects: newStudentProjects,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorTitle("");
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

          if (allErrors.Title !== undefined) setErrorTitle(allErrors.Title.join(", "));

          if (allErrors.Description !== undefined)
            setErrorDescription(allErrors.Description.join(", "));
          setValidated(true);
        }
      });
  };

  const handleProjectModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedProject = {
      id: input.projectId,
      startDate: input.projectStartDate,
      endDate: input.projectEndDate,
      title: input.projectTitle,
      description: input.projectDescription,
      studentId: studentId,
    };

    // let modifiedStudentProjects = JSON.parse(JSON.stringify(input.studentProjects));

    // for (let i = 0; i < modifiedStudentProjects.length; i++) {
    //   if (modifiedStudentProjects[i].id === input.projectId) {
    //     modifiedStudentProjects[i] = modifiedProject;
    //     break;
    //   }
    // }

    // let aux = "api/projects/" + modifiedProject.id;
    // const response = await fetch(aux, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },

    //   body: JSON.stringify(modifiedProject),
    // });
    // if (response.ok) {
    //   setInput({
    //     ...input,
    //     studentProjects: modifiedStudentProjects,
    //   });
    //   setModifyIsOpen(false);
    // }

    await axios
      .put("api/projects/" + modifiedProject.id, modifiedProject)
      .then((response) => {
        console.log(response);

        let modifiedStudentProjects = JSON.parse(JSON.stringify(input.studentProjects));

        for (let i = 0; i < modifiedStudentProjects.length; i++) {
          if (modifiedStudentProjects[i].id === input.projectId) {
            modifiedStudentProjects[i] = modifiedProject;
            break;
          }
        }

        setInput({
          ...input,
          studentProjects: modifiedStudentProjects,
        });

        setErrorStartDate("");
        setErrorEndDate("");
        setErrorTitle("");
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

          if (allErrors.Title !== undefined) setErrorTitle(allErrors.Title.join(", "));

          if (allErrors.Description !== undefined)
            setErrorDescription(allErrors.Description.join(", "));
          setValidated(true);
        }
      });
  };

  const handleProjectDelete = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudentProjects = JSON.parse(JSON.stringify(input.studentProjects));

    modifiedStudentProjects = modifiedStudentProjects.filter(
      (studentProject) => studentProject.id !== input.projectId
    );

    let aux = "api/projects/" + input.projectId;
    const response = await fetch(aux, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setInput({
        ...input,
        studentProjects: modifiedStudentProjects,
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
              projectId: "",
              projectStartDate: new Date("2019-06-01"),
              projectEndDate: new Date("2021-06-01"),
              projectTitle: "",
              projectDescription: "",
            });
            setCreateIsOpen(true);
          }}
          size="small"
          style={{ marginLeft: -50, marginTop: -57 }}
        >
          <AddIcon />
        </Fab>
        <span className="header">PROIECTE</span>
      </div>
      <Modal show={createIsOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Proiect</Modal.Title>
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
                  value={input.projectStartDate}
                  onChange={handleProjectStartDateChange}
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
                  value={input.projectEndDate}
                  onChange={handleProjectEndDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <TextField
              error={errorTitle !== ""}
              helperText={errorTitle}
              label="Poziție"
              style={{ margin: 15 }}
              placeholder="Poziție"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={input.projectTitle}
              onChange={handleProjectTitleChange}
              required={true}
            />

            <Form.Group className="col-md-12" controlId="description">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={input.projectDescription}
                onChange={handleProjectDescriptionChange}
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
                onClick={handleProjectCreateForm}
              >
                Salvează
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {input.studentProjects.map((project, index) => (
        <span key={index}>
          <div
            className="container rounded input-div pen-icon-parent p-2"
            onClick={(event) => {
              setInput({
                ...input,
                projectId: project.id,
                projectStartDate: project.startDate,
                projectEndDate: project.endDate,
                projectTitle: project.title,
                projectDescription: project.description,
              });
              setModifyIsOpen(true);
            }}
          >
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
            <div className="hide">
              <CreateIcon className="pen-icon" />
            </div>
          </div>

          <Modal show={modifyIsOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Proiect</Modal.Title>
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
                      value={input.projectStartDate}
                      onChange={handleProjectStartDateChange}
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
                      value={input.projectEndDate}
                      onChange={handleProjectEndDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <TextField
                  error={errorTitle !== ""}
                  helperText={errorTitle}
                  label="Titlu"
                  style={{ margin: 15 }}
                  placeholder="Titlu"
                  fullWidth
                  margin="normal"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  value={input.projectTitle}
                  onChange={handleProjectTitleChange}
                  required={true}
                />

                <Form.Group className="col-md-12">
                  <Form.Label>Descriere</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={input.projectDescription}
                    onChange={handleProjectDescriptionChange}
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
                    onClick={handleProjectDelete}
                  >
                    Sterge
                  </Button>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleProjectModifyForm}
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

export default ProjectForm;
