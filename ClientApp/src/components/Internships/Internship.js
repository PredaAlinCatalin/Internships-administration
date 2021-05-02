import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { StudentInternshipStatus } from "../Constants";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import "./Internship.css";
import ReactStars from "react-rating-stars-component";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import {
  getFormattedDate,
  getFormattedDateNoTime,
  checkDateIsPast,
} from "../Utility/Utility";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import SendIcon from "@material-ui/icons/Send";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Paper } from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Internship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      internship: "",
      company: "",
      city: "",
      categories: [],
      aptitudes: [],
      isAuthenticated: false,
      userId: null,
      isApplied: false,
      isAccepted: false,
      canGrade: false,
      internshipGrade: 0,
      internshipGrading: 0,
      nrGrades: 0,
      nrStudents: 0,
      open: false,
      isSaved: false,
      userId: "",
      userRole: "",
    };
  }

  componentDidMount() {
    this.populateInternshipData();
  }

  populateInternshipData = async () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== null)
      this.setState({
        userId: user.id,
        userRole: user.role,
        isAuthenticated: true,
      });

    let internshipResponse = await fetch("api/internships/" + this.props.internshipId);
    let internshipData = "";
    if (internshipResponse.ok) {
      internshipData = await internshipResponse.json();
      let descriptionCopy = internshipData.description;
      descriptionCopy = descriptionCopy.replaceAll("<br/>", "\n");
      internshipData.description = descriptionCopy;
      console.log(internshipData);
      this.setState({
        internship: internshipData,
      });
    }

    let companyResponse = await fetch("api/companies/" + internshipData.idCompany);
    let companyData = "";
    if (companyResponse.ok) {
      companyData = await companyResponse.json();
      this.setState({
        company: companyData,
      });
    }

    let cityResponse = await fetch("api/cities/" + internshipData.idCity);
    let cityData = "";
    if (cityResponse.ok) {
      cityData = await cityResponse.json();
      this.setState({
        city: cityData,
      });
    }

    const categoriesResponse = await fetch(
      "api/categories/internship/" + this.props.internshipId
    );
    let categoriesData = [];
    if (categoriesResponse.ok) categoriesData = await categoriesResponse.json();

    const aptitudesResponse = await fetch(
      "api/aptitudes/internship/" + this.props.internshipId
    );
    let aptitudesData = [];
    if (aptitudesResponse.ok) aptitudesData = await aptitudesResponse.json();

    if (user !== null) {
      const studentInternshipResponse = await fetch(
        "api/studentInternships/student/" +
          user.id +
          "/internship/" +
          this.props.internshipId
      );
      if (studentInternshipResponse.ok) {
        let studentInternshipData = await studentInternshipResponse.json();
        if (checkDateIsPast(internshipData.endDate)) {
          this.setState({
            canGrade: true,
            internshipGrade: studentInternshipData.internshipGrade,
          });
        }

        this.setState({ isApplied: true });

        if (checkDateIsPast(internshipData.deadline)) {
          console.log(internshipData.deadline);
          console.log(studentInternshipData.status);
          if (studentInternshipData.status === StudentInternshipStatus.accepted) {
            this.setState({ isAccepted: true });
          }
        }
      } else this.setState({ canGrade: false });
    }

    let studentInternshipsByInternshipResponse = await fetch(
      "api/studentInternships/internship/" + this.props.internshipId
    );
    if (studentInternshipsByInternshipResponse.ok) {
      let studentInternshipsByInternshipData = await studentInternshipsByInternshipResponse.json();

      let sumOfGrades = 0;
      let nrGradesCopy = 0;
      for (let i = 0; i < studentInternshipsByInternshipData.length; i++) {
        if (
          studentInternshipsByInternshipData[i].status ===
          StudentInternshipStatus.accepted
        ) {
        }
        if (studentInternshipsByInternshipData[i].internshipGrade > 0) {
          sumOfGrades =
            sumOfGrades + studentInternshipsByInternshipData[i].internshipGrade;
          nrGradesCopy = nrGradesCopy + 1;
        }
      }

      this.setState({
        internshipGrading: nrGradesCopy !== 0 ? sumOfGrades / nrGradesCopy : 0,
        nrGrades: nrGradesCopy,
        nrStudents: studentInternshipsByInternshipData.length,
      });
    }
    if (user !== null && user.role == "Student") {
      let aux =
        "api/savedStudentInternships/student/" +
        user.id +
        "/internship/" +
        this.state.internship.id;
      await fetch(aux)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 404) return;
          this.setState({ isSaved: true });
          console.log("SAVED");
        });
    }

    this.setState({
      categories: categoriesData,
      aptitudes: aptitudesData,
      loading: false,
    });
  };

  handleStudentInternshipCreate = async () => {
    let currentDate = getFormattedDate(new Date());

    let newStudentInternship = {
      idStudent: this.state.userId,
      idInternship: this.state.internship.id,
      applicationDate: currentDate,
      status: StudentInternshipStatus.pending,
    };

    const studentInternshipResponse = await fetch("api/studentInternships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newStudentInternship),
    });

    if (studentInternshipResponse.ok)
      this.setState({
        isApplied: true,
        open: true,
      });
  };

  handleStudentInternshipDelete = async () => {
    const answer = window.confirm("Confirmă stergerea");

    if (answer) {
      const studentInternshipResponse = await fetch(
        "api/studentInternships/student/" +
          this.state.userId +
          "/internship/" +
          this.state.internship.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (studentInternshipResponse.ok)
        this.setState({
          isApplied: false,
        });
    }
  };

  handleNotLoggedIn = () => {
    //history.push(ApplicationPaths.Login);
  };

  handleInternshipGradeChange = (changeEvent) => {
    this.setState({
      internshipGrade: changeEvent.target.value,
    });
  };

  handleInternshipGradeForm = async (studentInternship, formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudentInternship = {
      idStudent: this.state.userId,
      idInternship: this.state.studentInternship.idInternship,
      applicationDate: this.state.studentInternship.applicationDate,
      status: this.state.studentInternship.status,
      internshipGrade: this.state.internshipGrade,
    };

    let aux =
      "api/studentInternships/student/" +
      this.state.userId +
      "/internship/" +
      this.state.internship.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedStudentInternship),
    });

    let studentInternshipsByInternshipResponse = await fetch(
      "api/studentInternships/internship/" + this.props.internshipId
    );
    if (studentInternshipsByInternshipResponse.ok) {
      let studentInternshipsByInternshipData = await studentInternshipsByInternshipResponse.json();

      let sumOfGrades = 0;
      let nrGradesCopy = 0;

      for (let i = 0; i < studentInternshipsByInternshipData.length; i++) {
        if (studentInternshipsByInternshipData[i].hasGraded) {
          sumOfGrades =
            sumOfGrades + studentInternshipsByInternshipData[i].internshipGrade;
          nrGradesCopy = nrGradesCopy + 1;
        }
      }

      this.setState({
        internshipGrading: sumOfGrades / nrGradesCopy,
        nrGrades: nrGradesCopy,
      });
    }
  };

  handleClickedAddress = (address) => {
    window.open("https://www.google.ro/maps/place/" + address);
  };

  handleClickedWebsite = (website) => {
    window.open(website);
  };

  ratingChanged = (newRating) => {
    console.log(newRating);
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  handleSavedStudentInternshipCreate = async (event) => {
    event.stopPropagation();
    const body = {
      idInternship: this.state.internship.id,
      idStudent: this.state.userId,
    };

    console.log(body);

    await fetch("api/savedStudentInternships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) this.setState({ isSaved: true });
      console.log("saved");
    });
  };

  handleSavedStudentInternshipDelete = async (event) => {
    event.stopPropagation();
    await fetch(
      "api/savedStudentInternships/student/" +
        this.state.userId +
        "/internship/" +
        this.state.internship.id,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) this.setState({ isSaved: false });
      console.log("Deleted");
    });
  };

  renderInternshipHeader = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="column">
            <Avatar
              style={{ width: 100, height: 100, marginRight: 10 }}
              aria-label="recipe"
              alt="logo"
              src={"logos/" + this.state.company.logoPath}
              variant="rounded"
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
              onClick={() =>
                this.props.history.push("/company/" + this.state.internship.idCompany)
              }
            ></Avatar>
          </div>
          <div className="column">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <Link to={"/internship/" + this.state.internship.id}>
                    <b
                      style={{
                        // fontFamily: theme.typography.fontFamily,
                        color: "black",
                      }}
                    >
                      {this.state.internship.name}
                    </b>
                  </Link>
                  <br />
                  <Link to={"/company/" + this.state.internship.idCompany}>
                    <b
                      style={{
                        fontSize: 14,
                      }}
                    >
                      {this.state.company.name}
                    </b>
                  </Link>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    {this.state.internship.paid ? "Platit" : "Neplatit"}
                  </span>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    {this.state.city.name}
                    <Icon.GeoAltFill />
                  </span>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <Box
                    component="fieldset"
                    mb={3}
                    borderColor="transparent"
                    onClick={() =>
                      this.props.history.push(
                        "/internshipReviews/" + this.state.internship.id
                      )
                    }
                    onMouseOver={(event) => (event.target.style.cursor = "pointer")}
                    onMouseOut={(event) => (event.target.style.cursor = "normal")}
                  >
                    <Rating
                      name="read-only"
                      value={this.state.internshipGrading}
                      readOnly
                    />
                  </Box>
                </div>
                <div className="col-md-6">
                  <Link to={"/internshipReviews/" + this.state.internship.id}>
                    {this.state.nrGrades} review-uri
                  </Link>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  };

  isStudent = () => {
    return this.state.userRole === "Student";
  };

  renderInternshipData = () => {
    return (
      <div class="container p-4 mb-5">
        <div class="row">
          <div class="col-lg-9">
            {this.renderInternshipHeader()}

            <br />

            <div className="container">
              <div className="row">
                <div className="column mr-3">
                  {this.isStudent() && this.state.isAccepted && (
                    <b className="text-success">Aplicat si acceptat</b>
                  )}

                  {this.isStudent() && this.state.isApplied && !this.state.isAccepted && (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.handleStudentInternshipDelete}
                        startIcon={<DeleteIcon />}
                      >
                        Șterge aplicarea
                      </Button>
                    </div>
                  )}

                  {this.isStudent() && !this.state.isApplied && (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        onClick={this.handleStudentInternshipCreate}
                      >
                        Candidează
                      </Button>
                      <Snackbar
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                      >
                        <Alert onClose={this.handleClose} severity="success">
                          Ai aplicat cu succes la stagiu!
                        </Alert>
                      </Snackbar>
                    </div>
                  )}

                  {!this.state.isAuthenticated && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.props.history.push("/login")}
                    >
                      Loghează-te pentru a aplica
                    </Button>
                  )}
                </div>

                <div className="column">
                  {this.isStudent() && !this.state.isSaved && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSavedStudentInternshipCreate}
                      startIcon={<BookmarkBorderIcon />}
                    >
                      Salvează
                    </Button>
                  )}

                  {this.isStudent() && this.state.isSaved && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.handleSavedStudentInternshipDelete}
                      startIcon={<BookmarkIcon />}
                    >
                      Anulează salvarea
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <br />
            <div>
              <b>Perioada: </b>
              {getFormattedDateNoTime(new Date(this.state.internship.startDate))} -{" "}
              {getFormattedDateNoTime(new Date(this.state.internship.endDate))}
            </div>
            <p></p>
            <table>
              <tbody>
                <tr>
                  <td className="leftBorders">
                    <b>Aptitudini:</b>
                    <p> </p>
                    <ul>
                      {this.state.aptitudes !== []
                        ? this.state.aptitudes.map((aptitude) => <li>{aptitude.name}</li>)
                        : ""}
                    </ul>
                  </td>
                  <td className="rightBorders">
                    <b>Categorii:</b>
                    <p> </p>
                    <ul>
                      {this.state.categories !== []
                        ? this.state.categories.map((category) => (
                            <li>{category.name}</li>
                          ))
                        : ""}
                    </ul>
                  </td>

                  <td className="rightBorders">
                    <b className="b-text">Detalii:</b>
                    <p></p>
                    <ul>
                      <li>{this.state.internship.maxNumberStudents} locuri</li>
                      <li>{this.state.nrStudents} participanți</li>
                      <li>{this.state.company.industry}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div>
              <b>Descriere: </b>
              <p className="description" style={{ fontSize: 15 }}>
                {this.state.internship.description}
              </p>
            </div>
            <p> </p>
            {this.state.isAuthenticated ? (
              this.state.canGrade ? (
                <form onSubmit={this.handleInternshipGradeForm}>
                  <div>
                    Gradingul tau al stagiului:
                    <input
                      type="text"
                      name="internshipGrade"
                      value={this.state.internshipGrade}
                      onChange={this.handleInternshipGradeChange}
                    />
                  </div>

                  <div>
                    <button className="btn btn-primary mt-2" type="submit">
                      Salveaza
                    </button>
                  </div>
                </form>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
          <br />
          <div class="col-sm-3">
            <h5>{this.state.company["name"]}</h5>
            {this.state.company["description"]}
            <br />
            <br />
            <img
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
              onClick={() => this.handleClickedAddress(this.state.company.address)}
              width="32"
              alt="Google Maps icon"
              src="googlemaps.png"
            />

            <span
              className="website"
              onClick={() => this.handleClickedWebsite(this.state.company.website)}
            >
              Website
            </span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderInternshipData();

    return <Paper>{contents}</Paper>;
  }
}

export default withRouter(Internship);
