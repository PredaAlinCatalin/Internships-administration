import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { StudentInternshipStatus } from "../Constants";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import "./Internship.css";
import ReactStars from "react-rating-stars-component";

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
        if (this.verifyDateIsPast(internshipData.endDate)) {
          this.setState({
            canGrade: true,
            internshipGrade: studentInternshipData.internshipGrade,
          });
        }

        this.setState({ isApplied: true });

        if (this.verifyDateIsPast(internshipData.deadline)) {
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

    this.setState({
      categories: categoriesData,
      aptitudes: aptitudesData,
      loading: false,
    });
  };

  getFormattedApplicationDate = (fullDate) => {
    let year = fullDate.getFullYear();
    let month = fullDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = fullDate.getDate();
    if (day < 10) day = "0" + day;
    let hours = fullDate.getHours();
    if (hours < 10) hours = "0" + hours;
    let minutes = fullDate.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = fullDate.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;

    let result =
      year + "-" + month + "-" + day + "-" + hours + ":" + minutes + ":" + seconds;
    return result;
  };

  verifyDateIsPast = (date) => {
    let currentFullDate = new Date();
    let year = currentFullDate.getFullYear();
    let month = currentFullDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = currentFullDate.getDate();
    if (day < 10) day = "0" + day;
    let currentDate = year + "-" + month + "-" + day;
    return date < currentDate;
  };

  handleStudentInternshipCreate = async () => {
    let currentDate = this.getFormattedApplicationDate(new Date());

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
      });
  };

  handleStudentInternshipDelete = async () => {
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

  renderInternshipData = () => {
    return (
      <div>
        <div class="container">
          <div class="row">
            <div class="col-lg-9">
              <div className="text-center">
                <h3 style={{ textAlign: "center" }}>
                  {" "}
                  {this.state.internship.name}{" "}
                  <div className="stars">
                    <ReactStars
                      count={5}
                      onChange={this.ratingChanged}
                      size={24}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="#ffd700"
                      edit={false}
                      value={this.state.internshipGrading}
                    />
                  </div>
                </h3>

                <Link to={"/internshipReviews/" + this.state.internship.id}>
                  ({this.state.nrGrades} review-uri)
                </Link>

                <div className="centered"></div>

                <p> </p>
                <div style={{ textAlign: "center" }}>
                  Stagiu <b>{this.state.internship.paid ? "Plătit" : "Neplătit"}</b> la{" "}
                  <Link to={"/company/" + this.state.company.id}>
                    {this.state.company.name}
                  </Link>
                  <br />
                  Perioada: <b>{this.state.internship.startDate}</b> -{" "}
                  <b>{this.state.internship.endDate}</b>
                  <br />
                  Oraș: <b>{this.state.city.name}</b>
                  <Icon.GeoAltFill />
                </div>
              </div>

              <p></p>
              <table>
                <tbody>
                  <tr>
                    <td className="leftBorders">
                      <b>Categorii:</b>
                      <p> </p>
                      <ul>
                        <span style={{ fontSize: 14 }}>
                          {this.state.categories !== []
                            ? this.state.categories.map((category) => (
                                <li>
                                  {category.name}
                                  <p> </p>
                                </li>
                              ))
                            : ""}
                        </span>
                      </ul>
                    </td>

                    <td className="centerBorders">
                      <b>Aptitudini:</b>
                      <p> </p>
                      <span style={{ fontSize: 14 }}>
                        <ul>
                          {this.state.aptitudes !== []
                            ? this.state.aptitudes.map((aptitude) => (
                                <li>
                                  {aptitude.name}
                                  <p> </p>
                                </li>
                              ))
                            : ""}
                        </ul>
                      </span>
                    </td>

                    <td className="rightBorders">
                      <b>Detalii:</b>
                      <p></p>
                      <ul>
                        <li>{this.state.internship.maxNumberStudents} locuri</li>
                        <li>{this.state.nrStudents} participanți</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <b>Descriere: </b>
                <p className="description">{this.state.internship.description}</p>
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
              <div
                class="center"
                style={{
                  display: "table",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {this.state.isAuthenticated && this.state.isAccepted && (
                  <b className="text-success">Aplicat si acceptat</b>
                )}

                {this.state.isAuthenticated &&
                  this.state.isApplied &&
                  !this.state.isAccepted && (
                    <div>
                      <b className="text-danger">Ai aplicat deja la stagiu</b>
                      <br />
                      <button
                        className="btn btn-danger mt-2"
                        onClick={this.handleStudentInternshipDelete}
                      >
                        Șterge aplicarea
                      </button>
                    </div>
                  )}

                {this.state.isAuthenticated && !this.state.isApplied && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handleStudentInternshipCreate}
                  >
                    Aplică
                  </button>
                )}

                {!this.state.isAuthenticated && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handleNotLoggedIn}
                  >
                    Loghează-te pentru a aplica
                  </button>
                )}
              </div>
            </div>

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

            <span className="website"
                onClick={() => this.handleClickedWebsite(this.state.company.website)}>
              Website
            </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderInternshipData();

    return <div>{contents}</div>;
  }
}

export default withRouter(Internship);
