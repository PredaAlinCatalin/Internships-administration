import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { StudentInternshipStatus } from "../Constants";
import { checkDateIsPast } from "../Utility/Utility";
import { Link } from "react-router-dom";
import { Avatar, Paper } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";

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

class InternshipHistory extends Component {
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
    this.populateInternshipHistoryData();
  }

  async populateInternshipHistoryData() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    var studentInternshipsData = [];

    const internshipsResponse = await fetch("api/internships");
    var internshipsData = [];
    if (internshipsResponse.ok) {
      internshipsData = await internshipsResponse.json();
      const studentInternshipsResponse = await fetch(
        "api/studentInternships/student/" + user.id
      );
      if (studentInternshipsResponse.ok) {
        studentInternshipsData = await studentInternshipsResponse.json();
        studentInternshipsData = studentInternshipsData.filter(
          (si) =>
            si.status === "accepted" &&
            !checkDateIsPast(
              this.getInternship(internshipsData, si.idInternship).deadline
            )
        );
      }
    }

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

  getInternship = (internships, id) => {
    for (let i = 0; i < internships.length; i++) {
      if (internships[i].id === id) {
        return internships[i];
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

  renderInternshipHistoryHeader = (studentInternship) => {
    return (
      <>
        <td className="col-7">
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
                      this.getInternship(studentInternship.idInternship).idCompany
                    ).logoPath
                  }
                  variant="rounded"
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  onMouseOut={(e) => (e.target.style.cursor = "normal")}
                  onClick={() =>
                    this.handleSelectCompany(
                      this.getInternship(studentInternship.idInternship).idCompany
                    )
                  }
                ></Avatar>
              </div>
              <div className="column">
                <Link to={"internship/" + studentInternship.idInternship}>
                  <b
                    style={{
                      // fontFamily: theme.typography.fontFamily,
                      color: "black",
                    }}
                  >
                    {this.getInternship(studentInternship.idInternship).name}
                  </b>
                </Link>
                <br />
                <Link
                  to={
                    "company/" +
                    this.getInternship(studentInternship.idInternship).idCompany
                  }
                >
                  <b
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {
                      this.getCompany(
                        this.getInternship(studentInternship.idInternship).idCompany
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
                  {this.getInternship(studentInternship.idInternship).paid
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
                      this.getInternship(studentInternship.idInternship).idCity
                    ).name
                  }
                  <Icon.GeoAltFill />
                </span>
              </div>
            </div>
          </div>
        </td>

        <td className="col-3">{studentInternship.applicationDate}</td>
      </>
    );
  };

  renderInternshipHistory = () => {
    return (
      <>
        <h5>Istoricul stagiilor tale:</h5>
        <br />

        <Paper>
          <div className="container pb-2">
            <div className="table-responsive"></div>
            <table aria-labelledby="tabelLabel" className="table table-hover">
              <thead>
                <tr className="d-flex">
                  <th className="col-7">Stagiu</th>
                  <th className="col-3">Data aplicarii</th>
                  <th className="col-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.studentInternships !== []
                  ? this.state.studentInternships.map((studentInternship) => (
                      <tr className="d-flex">
                        {studentInternship.status === StudentInternshipStatus.accepted &&
                        !checkDateIsPast(
                          this.getInternship(studentInternship.idInternship).deadline
                        )
                          ? this.renderInternshipHistory(studentInternship)
                          : null}
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </Paper>
      </>
    );
  };

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderInternshipHistory()
    );

    return <div>{contents}</div>;
  }
}

export default withRouter(InternshipHistory);
