import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { checkDateIsPast } from "../Utility/Utility";
import { Link } from "react-router-dom";
import { Avatar, Paper } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import TabMenu from "../Universal/TabMenu";
import { Box, Tooltip } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
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

class InternshipHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentInternships: [],
      internships: [],
      companies: [],
      cities: [],
      loading: true,
      reviews: [],
      userId: "",
      userRole: "",
    };
  }

  componentDidMount() {
    this.populateInternshipHistoryData();
  }

  async populateInternshipHistoryData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== null && user.role === "Student")
      this.setState({ userId: user.id, userRole: user.role });

    var studentInternshipsData = [];

    const internshipsResponse = await fetch("api/internships");
    var internshipsData = [];
    if (internshipsResponse.ok) {
      internshipsData = await internshipsResponse.json();
      const studentInternshipsResponse = await fetch(
        "api/studentInternships/student/" + user.id
      );
      console.log(studentInternshipsResponse);
      if (studentInternshipsResponse.ok) {
        studentInternshipsData = await studentInternshipsResponse.json();
        studentInternshipsData = studentInternshipsData.filter(
          (si) =>
            si.status === "accepted" &&
            checkDateIsPast(this.getInternship(internshipsData, si.internshipId).deadline)
        );
      }

      const reviewsResponse = await fetch(
        "api/studentInternshipreviews/student/" + user.id
      );
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        this.setState({ reviews: reviewsData });
      }
    }

    console.log(studentInternshipsData);

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

  getReview = (internshipId) => {
    return this.state.reviews.find(
      (r) => r.internshipId === internshipId && r.studentId == this.state.userId
    );
  };

  renderInternshipHistoryHeader = (studentInternship) => {
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
                      this.getInternship(
                        this.state.internships,
                        studentInternship.internshipId
                      ).companyId
                    ).logoPath
                  }
                  variant="rounded"
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  onMouseOut={(e) => (e.target.style.cursor = "normal")}
                  onClick={() =>
                    this.handleSelectCompany(
                      this.getInternship(
                        this.state.internships,
                        studentInternship.internshipId
                      ).companyId
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
                    {
                      this.getInternship(
                        this.state.internships,
                        studentInternship.internshipId
                      ).name
                    }
                  </b>
                </Link>
                <br />
                <Link
                  to={
                    "company/" +
                    this.getInternship(
                      this.state.internships,
                      studentInternship.internshipId
                    ).companyId
                  }
                >
                  <b
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {
                      this.getCompany(
                        this.getInternship(
                          this.state.internships,
                          studentInternship.internshipId
                        ).companyId
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
                  {this.getInternship(
                    this.state.internships,
                    studentInternship.internshipId
                  ).paid
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
                      this.getInternship(
                        this.state.internships,
                        studentInternship.internshipId
                      ).cityId
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

        <td className="col-2">
          {this.getReview(studentInternship.internshipId) !== undefined ? (
            <Tooltip title="Vezi review">
              <Box
                component="fieldset"
                // mb={3}
                borderColor="transparent"
                onClick={() =>
                  this.props.history.push(
                    "/internshipReviews/" + studentInternship.internshipId
                  )
                }
                onMouseOver={(event) => (event.target.style.cursor = "pointer")}
                onMouseOut={(event) => (event.target.style.cursor = "normal")}
              >
                <Rating
                  name="half-rating-read"
                  value={this.getReview(studentInternship.internshipId).grade}
                  precision={0.5}
                  readOnly
                />
              </Box>
            </Tooltip>
          ) : (
            ""
          )}
        </td>

        <td className="col-4">{studentInternship.companyFeedback}</td>
      </>
    );
  };

  renderInternshipHistory = () => {
    return (
      <>
        <TabMenu />
        <br />

        {this.state.studentInternships.length > 0 ? (
          <div>
            <Paper className="p-3 ml-3 mr-3">
              <h5 className="text-center">Istoricul stagiilor</h5>
              <div className="container p-3 pb-2">
                <div className="table-responsive"></div>
                <table aria-labelledby="tabelLabel" className="table table-hover">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-4">Stagiu</th>
                      <th className="col-2">Data aplicării</th>
                      <th className="col-2">Review-ul tău</th>
                      <th className="col-4">Feedback companie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.studentInternships !== []
                      ? this.state.studentInternships.map((studentInternship) => (
                          <tr className="d-flex">
                            {this.renderInternshipHistoryHeader(studentInternship)}
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
            Nu ai finalizat încă niciun stagiu de practică
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
      this.renderInternshipHistory()
    );

    return <div>{contents}</div>;
  }
}

export default withRouter(InternshipHistory);
