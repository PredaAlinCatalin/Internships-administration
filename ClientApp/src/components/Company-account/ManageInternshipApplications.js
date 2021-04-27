import React, { Component } from "react";
import Select from "react-select";
import { withRouter } from "react-router-dom";
import { StudentInternshipStatus } from "../Constants";
import "./ManageInternshipApplications.css";
import Api from "../API/Api";
import * as Icon from "react-bootstrap-icons";
import Loading from "../Universal/Loading";

class ManageStudentInternships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentInternships: [],
      students: [],
      loading: true,
      emptyList: false,
    };
  }

  componentDidMount() {
    this.populateManageStudentInternshipsData();
  }

  populateManageStudentInternshipsData = async () => {
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

    this.setState({ loading: false });
  };

  handleSelectStudent = (id) => {
    this.props.history.push("/studentProfile/" + id);
  };

  getStudent = (id) => {
    for (var i = 0; i < this.state.students.length; i++)
      if (this.state.students[i].id === id) return this.state.students[i];
  };

  handleStatusAccepted = async (studentInternship) => {
    if (studentInternship.status !== StudentInternshipStatus.accepted) {
      var modifiedStudentInternship = JSON.parse(JSON.stringify(studentInternship));
      modifiedStudentInternship.status = StudentInternshipStatus.accepted;
      console.log(modifiedStudentInternship);
      await fetch(
        "api/studentInternships/student/" +
          studentInternship.idStudent +
          "/internship/" +
          studentInternship.idInternship,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedStudentInternship),
        }
      );
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
    }
  };

  handleStatusRefused = async (studentInternship) => {
    if (studentInternship.status !== StudentInternshipStatus.refused) {
      var modifiedStudentInternship = JSON.parse(JSON.stringify(studentInternship));
      modifiedStudentInternship.status = StudentInternshipStatus.refused;
      await fetch(
        "api/studentInternships/student/" +
          studentInternship.idStudent +
          "/internship/" +
          studentInternship.idInternship,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedStudentInternship),
        }
      );

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
    }
  };

  renderManageStudentInternshipsData = () => {
    return (
      <>
        {!this.state.emptyList ? (
          <div>
            <p>Internship applications:</p>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nume si prenume</th>
                  <th>Data aplicarii</th>
                  <th>Status</th>
                  <th>Actiune</th>
                </tr>
              </thead>
              <tbody>
                {this.state.studentInternships !== [] ? (
                  <>
                    {this.state.studentInternships.map((studentInternship, index) => (
                      <tr id={index}>
                        <td>
                          <button
                            className="btn btn-primary mt-2"
                            onClick={() =>
                              this.handleSelectStudent(studentInternship.idStudent)
                            }
                          >
                            {this.getStudent(studentInternship.idStudent).lastName}{" "}
                            {this.getStudent(studentInternship.idStudent).firstName}
                            &nbsp;
                          </button>
                        </td>

                        <td>{studentInternship.applicationDate}</td>

                        <td>
                          {/*<Select
                                                        placeholder="Selecteaza status"
                                                        value={
                                                            {
                                                                value: studentInternship.status,
                                                                label: studentInternship.status
                                                            }
                                                        }
                                                        options={this.state.statusOptions}
                                                        onChange={(e) => this.handleStatusChange(studentInternship, e)}
                                                    /> */}

                          {studentInternship.status}
                        </td>

                        <td>
                          <button
                            className="btn btn-success action"
                            onClick={() => this.handleStatusAccepted(studentInternship)}
                          >
                            {" "}
                            Accept{" "}
                          </button>

                          <button
                            className="btn btn-danger action"
                            onClick={() => this.handleStatusRefused(studentInternship)}
                          >
                            {" "}
                            Refuse{" "}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted">
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
