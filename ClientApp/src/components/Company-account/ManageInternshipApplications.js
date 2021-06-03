import React, { Component } from "react";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import { StudentInternshipStatus } from "../Constants";
import "./ManageInternshipApplications.css";
import Api from "../API/Api";
import Loading from "../Universal/Loading";
import { Paper, TextField } from "@material-ui/core";
import { Form } from "reactstrap";
import Button from "@material-ui/core/Button";
import { Modal } from "react-bootstrap";
import TabMenuCompany from "./TabMenuCompany";
import { getFormattedDateNoTime } from "../Utility/Utility";
import axios from "axios";
import { getSelectOptions } from "../Utility/Utility";
import qs from "qs";

class ManageStudentInternships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentInternships: [],
      students: [],
      loading: true,
      emptyList: false,
      studentInternshipsAux: [],
      statusOptions: [],
      isOpen: false,
      idSelected: -1,
      faculty: "",
      currentFaculty: "",
      facultiesOptions: [],
      submitted: false,
    };
  }

  componentDidMount() {
    this.populateManageStudentInternshipsData();
  }
  getStatusOptions = () => {
    var options = [];
    options.push({
      value: StudentInternshipStatus.accepted,
      label: StudentInternshipStatus.accepted,
    });
    options.push({
      value: StudentInternshipStatus.refused,
      label: StudentInternshipStatus.refused,
    });
    return options;
  };
  populateManageStudentInternshipsData = async () => {
    this.setState({ statusOptions: this.getStatusOptions() });

    await Api.getStudentInternshipsByInternshipId(this.props.internshipId).then(
      (studentInternships) => {
        if (typeof studentInternships !== "undefined" && studentInternships.length > 0) {
          this.setState({
            studentInternships: studentInternships,
          });
        } else {
          this.setState({ emptyList: true });
        }
      }
    );

    await fetch("api/studentInternships/internship/" + this.props.internshipId)
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== 404) {
          this.setState({
            studentInternships: data,
            studentInternshipsAux: data,
          });
        }
      })
      .catch((error) => console.log("Error on getting studentInternships", error));

    await fetch("api/students")
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== 404) {
          this.setState({ students: data });
        }
      })
      .catch((error) => console.log("Error on getting students", error));

    await axios
      .get("api/faculties")
      .then((response) => {
        console.log(response.data);
        this.setState({ faculties: response.data });
        this.setState({ facultiesOptions: getSelectOptions(response.data) });
      })
      .catch((error) => console.log(error));

    this.setState({ loading: false });

    let search = this.props.location.search;
    search = search.substring(1);
    let searchJSON = qs.parse(search);
    if (search !== "") {
      this.setState({
        currentFaculty: { value: searchJSON.faculty, label: searchJSON.faculty },
      });
      this.setState({
        faculty: { value: searchJSON.faculty, label: searchJSON.faculty },
      });
    }
    this.setState({ submitted: false });
  };

  handleSelectStudent = (id) => {
    this.props.history.push("/studentProfile/" + id);
  };

  getStudent = (id) => {
    for (var i = 0; i < this.state.students.length; i++)
      if (this.state.students[i].id === id) return this.state.students[i];
  };

  handleSubmit = async (studentInternshipAux) => {
    console.log(studentInternshipAux);
    var modifiedStudentInternship = JSON.parse(JSON.stringify(studentInternshipAux));
    console.log(modifiedStudentInternship);

    modifiedStudentInternship.status = studentInternshipAux.status;
    modifiedStudentInternship.companyFeedback = studentInternshipAux.companyFeedback;
    await fetch(
      "api/studentInternships/student/" +
        studentInternshipAux.studentId +
        "/internship/" +
        studentInternshipAux.internshipId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedStudentInternship),
      }
    ).then(async (response) => {
      if (response.ok) {
        await Api.getStudentInternshipsByInternshipId(this.props.internshipId).then(
          (studentInternships) => {
            if (
              typeof studentInternships !== "undefined" &&
              studentInternships.length > 0
            ) {
              this.setState({
                studentInternships: studentInternships,
              });
            } else {
              this.setState({ emptyList: true });
            }
          }
        );
        this.setState({ isOpen: false });
      }
    });
  };

  getStudentInternshipAux(studentInternship) {
    return this.state.studentInternshipsAux.find(
      (si) =>
        si.studentId === studentInternship.studentId &&
        si.internshipId === studentInternship.internshipId
    );
  }

  handleFeedbackChange = (studentInternship, event) => {
    let modifiedStudentInternshipsAux = JSON.parse(
      JSON.stringify(this.state.studentInternshipsAux)
    );
    let index = modifiedStudentInternshipsAux.findIndex(
      (si) =>
        si.studentId === studentInternship.studentId &&
        si.internshipId === studentInternship.internshipId
    );
    modifiedStudentInternshipsAux[index].companyFeedback = event.target.value;

    this.setState({ studentInternshipsAux: modifiedStudentInternshipsAux });
  };

  handleStatusChange = (studentInternship, event) => {
    console.log(event);
    let modifiedStudentInternshipsAux = JSON.parse(
      JSON.stringify(this.state.studentInternshipsAux)
    );
    let index = modifiedStudentInternshipsAux.findIndex(
      (si) =>
        si.studentId === studentInternship.studentId &&
        si.internshipId === studentInternship.internshipId
    );
    modifiedStudentInternshipsAux[index].status = event.value;

    this.setState({ studentInternshipsAux: modifiedStudentInternshipsAux });
  };

  handleClose = () => {
    this.setState({
      isOpen: false,
      studentInternshipsAux: JSON.parse(JSON.stringify(this.state.studentInternships)),
    });
  };

  handleQuerySubmit = (event) => {
    event.preventDefault();
    if (this.state.currentFaculty.value !== undefined) {
      this.setState({ faculty: this.state.currentFaculty });
      let query = this.state.currentFaculty.value;
      let url =
        "/manageInternshipApplications/" +
        this.props.internshipId +
        "/query?faculty=" +
        query;
      this.props.history.push(url);
      this.setState({ submitted: true });
    }
  };

  handleResetFilters = () => {
    this.setState({
      faculty: "",
      currentFaculty: "",
      submitted: true,
    });
    let url = "/manageInternshipApplications/" + this.props.internshipId;
    this.props.history.push(url);
  };

  renderModal = () => {
    let studentInternship = this.state.studentInternships[this.state.idSelected];
    return this.state.idSelected !== -1 ? (
      <Modal show={this.state.isOpen} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getStudent(studentInternship.studentId).lastName}{" "}
            {this.getStudent(studentInternship.studentId).firstName}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Select
              placeholder="Selecteaza status"
              value={{
                value: this.getStudentInternshipAux(studentInternship).status,
                label: this.getStudentInternshipAux(studentInternship).status,
              }}
              options={this.state.statusOptions}
              onChange={(e) => this.handleStatusChange(studentInternship, e)}
            />
            <br />
            <TextField
              label="Feedback"
              placeholder="Feedback"
              fullWidth
              value={this.getStudentInternshipAux(studentInternship).companyFeedback}
              onChange={(event) => this.handleFeedbackChange(studentInternship, event)}
            />
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="contained" color="secondary" onClick={this.handleClose}>
                Închide
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) =>
                  this.handleSubmit(this.getStudentInternshipAux(studentInternship))
                }
              >
                Trimite
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    ) : (
      ""
    );
  };

  renderManageStudentInternshipsData = () => {
    return (
      <>
        <TabMenuCompany />
        {!this.state.emptyList ? (
          <div>
            <br />
            <h5 className="text-center">Aplicările la stagiu</h5>
            <form onSubmit={this.handleQuerySubmit}>
              <Select
                placeholder="Selectează facultate"
                value={this.state.currentFaculty}
                options={this.state.facultiesOptions}
                onChange={(e) => this.setState({ currentFaculty: e })}
                isSearchable
                required
              />

              <div className="col-lg-4 mt-lg-4 mb-lg-4">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="mr-lg-2"
                >
                  Caută
                </Button>
                {this.state.faculty !== "" ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.handleResetFilters}
                  >
                    Resetează filtre
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </form>
            <div className="m-3">
              <Paper>
                <div className="container p-3 pb-2">
                  <div className="table-responsive"></div>
                  <table className="table table-hover">
                    <thead>
                      <tr className="d-flex">
                        <th className="col-4">Nume și prenume</th>
                        <th className="col-2">Data aplicării</th>
                        <th className="col-2">Status</th>
                        <th className="col-4">Acțiune</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.studentInternships !== [] ? (
                        <>
                          {this.state.studentInternships.map(
                            (studentInternship, index) => (
                              <tr className="d-flex" id={index}>
                                <td className="col-4">
                                  <b>
                                    <Link
                                      to={
                                        "/studentProfile/" + studentInternship.studentId
                                      }
                                    >
                                      {
                                        this.getStudent(studentInternship.studentId)
                                          .lastName
                                      }{" "}
                                      {
                                        this.getStudent(studentInternship.studentId)
                                          .firstName
                                      }
                                      &nbsp;
                                    </Link>
                                  </b>
                                </td>

                                <td className="col-2">
                                  {getFormattedDateNoTime(
                                    studentInternship.applicationDate
                                  )}
                                </td>

                                <td className="col-2">{studentInternship.status}</td>

                                <td className="col-4">
                                  {this.renderModal()}
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      this.setState({ isOpen: true, idSelected: index })
                                    }
                                  >
                                    Administrează aplicarea
                                  </Button>
                                </td>
                              </tr>
                            )
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </tbody>
                  </table>
                </div>
              </Paper>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">
            <br />
            Nicio aplicare la acest stagiu
            <br />
          </div>
        )}
      </>
    );
  };

  render() {
    let contents = this.state.loading ? (
      <Loading />
    ) : (
      this.renderManageStudentInternshipsData()
    );

    return <div>{contents}</div>;
  }
}

export default withRouter(ManageStudentInternships);
