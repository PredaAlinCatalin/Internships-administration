import React, { useState, useEffect } from "react";
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

import { useIsStudent, useIsCompany } from "../Authentication/Authentication";
import { useHistory } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Internship = ({ internshipId }) => {
  const [loading, setLoading] = useState(true);
  const [internship, setInternship] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [aptitudes, setAptitudes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [internshipGrade, setInternshipGrade] = useState(0);
  const [internshipGrading, setInternshipGrading] = useState(0);
  const [nrGrades, setNrGrades] = useState(0);
  const [nrStudents, setNrStudents] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const isStudent = useIsStudent();
  const isCompany = useIsCompany();
  const history = useHistory();

  useEffect(() => {
    async function populateInternshipData() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user !== null) setUserId(user.id);

      let internshipResponse = await fetch("api/internships/" + internshipId);
      let internshipData = "";
      if (internshipResponse.ok) {
        internshipData = await internshipResponse.json();
        let descriptionCopy = internshipData.description;
        descriptionCopy = descriptionCopy.replaceAll("<br/>", "\n");
        internshipData.description = descriptionCopy;
        console.log(internshipData);
        setInternship(internshipData);
      }

      let companyResponse = await fetch("api/companies/" + internshipData.companyId);
      let companyData = "";
      if (companyResponse.ok) {
        companyData = await companyResponse.json();
        setCompany(companyData);
      }

      let cityResponse = await fetch("api/cities/" + internshipData.cityId);
      let cityData = "";
      if (cityResponse.ok) {
        cityData = await cityResponse.json();
        setCity(cityData);
      }

      const categoriesResponse = await fetch("api/categories/internship/" + internshipId);
      let categoriesData = [];
      if (categoriesResponse.ok) categoriesData = await categoriesResponse.json();

      const aptitudesResponse = await fetch("api/aptitudes/internship/" + internshipId);
      let aptitudesData = [];
      if (aptitudesResponse.ok) aptitudesData = await aptitudesResponse.json();

      if (isStudent) {
        const studentInternshipResponse = await fetch(
          "api/studentInternships/student/" + user.id + "/internship/" + internshipId
        );
        if (studentInternshipResponse.ok) {
          let studentInternshipData = await studentInternshipResponse.json();

          setIsApplied(true);

          if (checkDateIsPast(internshipData.deadline)) {
            console.log(internshipData.deadline);
            console.log(studentInternshipData.status);
            if (studentInternshipData.status === StudentInternshipStatus.accepted) {
              setIsAccepted(true);
            }
          }
        }
      }

      await fetch("api/studentInternshipReviews/internship/" + internshipId)
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();

            let sumOfGrades = 0;

            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                sumOfGrades = sumOfGrades + data[i].grade;
              }
              setInternshipGrading(sumOfGrades / data.length);
              setNrGrades(data.length);
            }
          }
        })
        .catch((error) => console.log(error));
      if (isStudent) {
        let aux =
          "api/savedStudentInternships/student/" +
          user.id +
          "/internship/" +
          internshipId;
        await fetch(aux).then(async (res) => {
          if (res.ok) {
            setIsSaved(true);
          }
        });
      }

      setCategories(categoriesData);
      setAptitudes(aptitudesData);
      setLoading(false);
    }

    populateInternshipData();
  }, []);

  const handleStudentInternshipCreate = async () => {
    let currentDate = getFormattedDate(new Date());

    let newStudentInternship = {
      studentId: userId,
      internshipId: internship.id,
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

    if (studentInternshipResponse.ok) {
      setIsApplied(true);
      setOpen(true);
    }
  };

  const handleStudentInternshipDelete = async () => {
    const answer = window.confirm("Confirmă stergerea");

    if (answer) {
      const studentInternshipResponse = await fetch(
        "api/studentInternships/student/" + userId + "/internship/" + internship.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (studentInternshipResponse.ok) setIsApplied(false);
    }
  };

  const handleNotLoggedIn = () => {
    //history.push(ApplicationPaths.Login);
  };

  const handleInternshipGradeChange = (changeEvent) => {
    setInternshipGrade(changeEvent.target.value);
  };

  const handleInternshipGradeForm = async (studentInternship, formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let modifiedStudentInternship = {
      studentId: userId,
      internshipId: studentInternship.internshipId,
      applicationDate: studentInternship.applicationDate,
      status: studentInternship.status,
      internshipGrade: internshipGrade,
    };

    let aux = "api/studentInternships/student/" + userId + "/internship/" + internship.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedStudentInternship),
    });

    let studentInternshipsByInternshipResponse = await fetch(
      "api/studentInternships/internship/" + internshipId
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

      setInternshipGrading(sumOfGrades / nrGradesCopy);
      setNrGrades(nrGradesCopy);
    }
  };

  const handleClickedAddress = (address) => {
    window.open("https://www.google.ro/maps/place/" + address);
  };

  const handleClickedWebsite = (website) => {
    window.open(website);
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSavedStudentInternshipCreate = async (event) => {
    event.stopPropagation();
    const body = {
      internshipId: internship.id,
      studentId: userId,
    };

    console.log(body);

    await fetch("api/savedStudentInternships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) setIsSaved(true);
      console.log("saved");
    });
  };

  const handleSavedStudentInternshipDelete = async (event) => {
    event.stopPropagation();
    await fetch(
      "api/savedStudentInternships/student/" + userId + "/internship/" + internship.id,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) setIsSaved(false);
      console.log("Deleted");
    });
  };

  const renderInternshipHeader = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="column">
            <Avatar
              style={{ width: 100, height: 100, marginRight: 10 }}
              aria-label="recipe"
              alt="logo"
              src={"logos/" + company.logoPath}
              variant="rounded"
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
              onClick={() => history.push("/company/" + internship.companyId)}
            ></Avatar>
          </div>
          <div className="column">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <Link to={"/internship/" + internship.id}>
                    <b
                      style={{
                        // fontFamily: theme.typography.fontFamily,
                        color: "black",
                      }}
                    >
                      {internship.name}
                    </b>
                  </Link>
                  <br />
                  <Link to={"/company/" + internship.companyId}>
                    <b
                      style={{
                        fontSize: 14,
                      }}
                    >
                      {company.name}
                    </b>
                  </Link>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    {internship.paid ? "Platit" : "Neplatit"}
                  </span>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    {city.name}
                    <Icon.GeoAltFill />
                  </span>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row ml-0">
                <div className="column">
                  <Box
                    component="fieldset"
                    mb={3}
                    borderColor="transparent"
                    onClick={() => history.push("/internshipReviews/" + internship.id)}
                    onMouseOver={(event) => (event.target.style.cursor = "pointer")}
                    onMouseOut={(event) => (event.target.style.cursor = "normal")}
                  >
                    <Rating name="read-only" value={internshipGrading} readOnly />
                  </Box>
                </div>
                <div className="column">
                  <Link to={"/internshipReviews/" + internship.id}>
                    {nrGrades} {nrGrades == 1 ? "review" : "review-uri"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return !loading ? (
    <Paper>
      <div class="container p-4 mb-5">
        <div class="row">
          <div class="col-lg-9">
            {renderInternshipHeader()}

            <br />

            <div className="container">
              <div className="row">
                <div className="column mr-3">
                  {isStudent && isAccepted && (
                    <b className="text-success">Aplicat si acceptat</b>
                  )}

                  {isStudent && isApplied && !isAccepted && (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleStudentInternshipDelete}
                        startIcon={<DeleteIcon />}
                      >
                        Șterge aplicarea
                      </Button>
                    </div>
                  )}

                  {isStudent && !isApplied && (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        onClick={handleStudentInternshipCreate}
                      >
                        Candidează
                      </Button>
                      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                          Ai aplicat cu succes la stagiu!
                        </Alert>
                      </Snackbar>
                    </div>
                  )}

                  {!isStudent && !isCompany && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => history.push("/login")}
                    >
                      Loghează-te pentru a aplica
                    </Button>
                  )}
                </div>

                <div className="column">
                  {isStudent && !isSaved && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSavedStudentInternshipCreate}
                      startIcon={<BookmarkBorderIcon />}
                    >
                      Salvează
                    </Button>
                  )}

                  {isStudent && isSaved && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSavedStudentInternshipDelete}
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
              {getFormattedDateNoTime(new Date(internship.startDate))} -{" "}
              {getFormattedDateNoTime(new Date(internship.endDate))}
            </div>
            <p></p>
            <table>
              <tbody>
                <tr>
                  <td className="leftBorders">
                    <b>Aptitudini:</b>
                    <p> </p>
                    <ul>
                      {aptitudes !== []
                        ? aptitudes.map((aptitude) => <li>{aptitude.name}</li>)
                        : ""}
                    </ul>
                  </td>
                  <td className="rightBorders">
                    <b>Categorii:</b>
                    <p> </p>
                    <ul>
                      {categories !== []
                        ? categories.map((category) => <li>{category.name}</li>)
                        : ""}
                    </ul>
                  </td>

                  <td className="rightBorders">
                    <b className="b-text">Detalii:</b>
                    <p></p>
                    <ul>
                      <li>{internship.maxNumberStudents} locuri</li>
                      <li>{nrStudents} participanți</li>
                      <li>{company.industry}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div>
              <b>Descriere: </b>
              <p className="description" style={{ fontSize: 15 }}>
                {internship.description}
              </p>
            </div>
            <p> </p>
          </div>
          <br />
          <div class="col-sm-3">
            <h5>{company["name"]}</h5>
            {company["description"]}
            <br />
            <br />
            <img
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
              onClick={() => handleClickedAddress(company.address)}
              width="32"
              alt="Google Maps icon"
              src="googlemaps.png"
            />

            <span
              className="website"
              onClick={() => handleClickedWebsite(company.website)}
            >
              Website
            </span>
          </div>
        </div>
      </div>
    </Paper>
  ) : (
    <Loading />
  );
};

export default withRouter(Internship);
