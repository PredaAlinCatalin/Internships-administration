import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { StudentInternshipStatus } from "../Constants";
import { checkDateIsPast } from "../Utility/Utility";
import { Link } from "react-router-dom";
import { Avatar, Paper } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import TabMenu from "../Universal/TabMenu";
import { getFormattedDateNoTime } from "../Utility/Utility";
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

class InternshipApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentInternships: [],
      internships: [],
      companies: [],
      cities: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.populateStudentInternshipsData();
  }

  async populateStudentInternshipsData() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    const studentInternshipsResponse = await fetch(
      "api/studentInternships/student/" + user.id
    );
    var studentInternshipsData = [];
    if (studentInternshipsResponse.ok)
      studentInternshipsData = await studentInternshipsResponse.json();

    const internshipsResponse = await fetch("api/internships");
    var internshipsData = [];
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    const companiesResponse = await fetch("api/companies");
    var companiesData = [];
    if (companiesResponse.ok) companiesData = await companiesResponse.json();

    const citiesResponse = await fetch("api/cities");
    var citiesData = [];
    if (citiesResponse.ok) citiesData = await citiesResponse.json();

    this.setState({
      studentInternships: studentInternshipsData,
      internships: internshipsData,
      companies: companiesData,
      cities: citiesData,
      loading: false,
    });
  }

  handleSelectCompany(id) {
    this.props.history.push("/company/" + id);
  }

  handleSelectInternship = (id) => {
    this.props.history.push("/internship/" + id);
  };

  getInternship = (id) => {
    for (let i = 0; i < this.state.internships.length; i++) {
      if (this.state.internships[i].id === id) {
        return this.state.internships[i];
      }
    }
  };

  getCompany = (id) => {
    for (let i = 0; i < this.state.companies.length; i++)
      if (this.state.companies[i].id === id) return this.state.companies[i];
  };

  getCity = (id) => {
    for (let i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  renderInternshipApplicationsHeader = (studentInternship, status) => {
    return (
      <>
        <td className="col-4">
          <div className="container">
            <div className="row">
              <div className="column">
                <Avatar
                  style={{ width: 65, height: 65, marginRight: 10 }}
                  aria-label="recipe"
                  alt="logo"
                  src={
                    "logos/" +
                    this.getCompany(
                      this.getInternship(studentInternship.internshipId).companyId
                    ).logoPath
                  }
                  variant="rounded"
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  onMouseOut={(e) => (e.target.style.cursor = "normal")}
                  onClick={() =>
                    this.handleSelectCompany(
                      this.getInternship(studentInternship.internshipId).companyId
                    )
                  }
                ></Avatar>
              </div>
              <div className="column">
                <Link to={"internship/" + studentInternship.internshipId}>
                  <b
                    style={{
                      // fontFamily: theme.typography.fontFamily,
                      color: "black",
                    }}
                  >
                    {this.getInternship(studentInternship.internshipId).name}
                  </b>
                </Link>
                <br />
                <Link
                  to={
                    "company/" +
                    this.getInternship(studentInternship.internshipId).companyId
                  }
                >
                  <b
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {
                      this.getCompany(
                        this.getInternship(studentInternship.internshipId).companyId
                      ).name
                    }
                  </b>
                </Link>
                <span
                  style={{
                    paddingLeft: 6,
                    fontSize: 14,
                  }}
                >
                  {this.getInternship(studentInternship.internshipId).paid
                    ? "Platit"
                    : "Neplatit"}
                </span>
                <span
                  style={{
                    paddingLeft: 6,
                    fontSize: 14,
                  }}
                >
                  {
                    this.getCity(
                      this.getInternship(studentInternship.internshipId).cityId
                    ).name
                  }
                  <Icon.GeoAltFill />
                </span>
              </div>
            </div>
          </div>
        </td>

        <td className="col-2">
          {getFormattedDateNoTime(studentInternship.applicationDate)}
        </td>

        <td className="col-2">{status}</td>

        <td className="col-4">{studentInternship.companyFeedback}</td>
      </>
    );
  };

  renderStudentInternshipsData = () => {
    return (
      <>
        <TabMenu />
        <br />

        {this.state.studentInternships.length > 0 ? (
          <div>
            <Paper className="p-3 ml-3 mr-3">
              <h5 className="text-center">Aplicări la stagii</h5>
              <div className="container p-3 pb-2">
                <div className="table-responsive"></div>
                <table aria-labelledby="tabelLabel" className="table table-hover">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-4">Stagiu</th>
                      <th className="col-2">Data aplicării</th>
                      <th className="col-2">Status</th>
                      <th className="col-4">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.studentInternships !== []
                      ? this.state.studentInternships.map((studentInternship) => (
                          <tr className="d-flex">
                            {studentInternship.status ===
                              StudentInternshipStatus.accepted &&
                            checkDateIsPast(
                              this.getInternship(studentInternship.internshipId).deadline
                            )
                              ? this.renderInternshipApplicationsHeader(
                                  studentInternship,
                                  "accepted"
                                )
                              : null}
                          </tr>
                        ))
                      : ""}
                    {this.state.studentInternships !== []
                      ? this.state.studentInternships.map((studentInternship) => (
                          <tr className="d-flex">
                            {studentInternship.status ===
                              StudentInternshipStatus.pending ||
                            !checkDateIsPast(
                              this.getInternship(studentInternship.internshipId).deadline
                            )
                              ? this.renderInternshipApplicationsHeader(
                                  studentInternship,
                                  "pending"
                                )
                              : null}
                          </tr>
                        ))
                      : ""}

                    {this.state.studentInternships !== []
                      ? this.state.studentInternships.map((studentInternship) => (
                          <tr className="d-flex">
                            {studentInternship.status ===
                              StudentInternshipStatus.refused &&
                            checkDateIsPast(
                              this.getInternship(studentInternship.internshipId).deadline
                            )
                              ? this.renderInternshipApplicationsHeader(
                                  studentInternship,
                                  "refused"
                                )
                              : null}
                          </tr>
                        ))
                      : ""}
                  </tbody>
                </table>
              </div>
            </Paper>
          </div>
        ) : (
          <div className="text-center text-muted">
            Nu ai aplicat încă la niciun stagiu
          </div>
        )}
      </>
    );
  };

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderStudentInternshipsData()
    );

    return <div>{contents}</div>;
  }
}

export default withRouter(InternshipApplications);
