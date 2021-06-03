import React, { useEffect, useState } from "react";
import InternshipReview from "./InternshipReview";
import { Link } from "react-router-dom";
import { Button, Box, TextField, CardActionArea } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Form, Modal } from "react-bootstrap";
import Loading from "../Universal/Loading";
import { useHistory } from "react-router-dom";
import { useIsStudent } from "../Authentication/Authentication";
import { checkDateIsPast } from "../Utility/Utility";
import { StudentInternshipStatus } from "../Constants";

const InternshipReviews = ({ internshipId }) => {
  const [user, setUser] = useState({
    id: "",
    role: "",
  });
  const [internship, setInternship] = useState(null);
  const [students, setStudents] = useState([]);
  const [emptyList, setEmptyList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("");
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({
    grade: 0,
    title: "",
    comment: "",
  });
  const [reviews, setReviews] = useState([]);
  const [hasGraded, setHasGraded] = useState(false);
  const [canGrade, setCanGrade] = useState(false);
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const isStudent = useIsStudent();
  const [isApplied, setIsApplied] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [internshipGrading, setInternshipGrading] = useState(0);
  const [nrGrades, setNrGrades] = useState(0);
  const [nrStudents, setNrStudents] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    let userStorage = JSON.parse(sessionStorage.getItem("user"));
    if (userStorage !== null) setUser(userStorage);
    async function populateWithData() {
      await fetch("api/internships/" + internshipId)
        .then(async (res) => {
          if (res.ok) {
            let internshipData = await res.json();
            setInternship(internshipData);

            fetch("api/companies/" + internshipData.companyId).then(async (response) => {
              if (response.ok) {
                let dataCompany = await response.json();
                setCompany(dataCompany);
              }
            });

            if (isStudent) {
              if (checkDateIsPast(internshipData.endDate)) setHasEnded(true);

              const studentInternshipResponse = await fetch(
                "api/studentInternships/student/" +
                  userStorage.id +
                  "/internship/" +
                  internshipId
              );
              if (studentInternshipResponse.ok) {
                let studentInternshipData = await studentInternshipResponse.json();
                if (
                  checkDateIsPast(internshipData.endDate) &&
                  studentInternshipData.status === StudentInternshipStatus.accepted
                ) {
                  setCanGrade(true);
                }
                setIsApplied(true);

                if (checkDateIsPast(internshipData.deadline)) {
                  if (studentInternshipData.status === StudentInternshipStatus.accepted) {
                    setIsAccepted(true);
                  }
                }
              }
            }
          }
        })
        .catch((error) => console.log(error));

      await fetch("api/studentInternshipReviews/internship/" + internshipId)
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();
            setReviews(data);
            console.log(data);
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

      await fetch("api/students")
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();
            setStudents(data);
            console.log(data);
          }
        })
        .catch((error) => console.log(error));

      if (userStorage !== null && userStorage.role === "Student") {
        await fetch(
          "api/studentinternshipreviews/student/" +
            userStorage.id +
            "/internship/" +
            internshipId
        )
          .then(async (res) => {
            if (res.ok) {
              let data = await res.json();
              setReview({
                grade: data.grade,
                title: data.title,
                comment: data.comment,
              });
              setHasGraded(true);
            }
          })
          .catch((error) => console.error(error));
      }

      setLoading(false);
      setSuccess(false);
    }
    populateWithData();
  }, [success]);

  const handleSubmitReview = async () => {
    let body = {
      studentId: user.id,
      internshipId: internshipId,
      grade: review.grade,
      title: review.title,
      comment: review.comment,
    };

    if (hasGraded) {
      await fetch(
        "api/studentInternshipReviews/student/" + user.id + "/internship/" + internshipId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      ).then((res) => {
        if (res.ok) {
          setOpen(false);
          setSuccess(true);
        }
      });
    } else {
      await fetch("api/studentInternshipReviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.ok) {
          setOpen(false);
          setSuccess(true);
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStudent = (id) => {
    return students.find((s) => s.id == id);
  };

  const getReview = (studentId, internshipId) => {
    console.log(reviews);
    console.log(studentId, internshipId);
    console.log(
      reviews.find((r) => r.studentId == studentId && r.internshipId == internshipId)
    );
    return reviews.find(
      (r) => r.studentId == studentId && r.internshipId == internshipId
    );
  };

  return !loading ? (
    <div>
      <br />
      <div className="text-center">
        <h5>
          Review-urile stagiului{" "}
          <Link to={"/internship/" + internship.id}>{internship.name}</Link> de la
          compania <Link to={"/company/" + company.id}>{company.name}</Link>
          <div className="container">
            <div className="row justify-content-center">
              <div className="column">
                <Box
                  component="fieldset"
                  mb={3}
                  borderColor="transparent"
                  onClick={() => history.push("/internshipReviews/" + internship.id)}
                  onMouseOver={(event) => (event.target.style.cursor = "pointer")}
                  onMouseOut={(event) => (event.target.style.cursor = "normal")}
                >
                  <Rating
                    name="half-rating-read"
                    value={internshipGrading}
                    precision={0.5}
                    readOnly
                  />
                </Box>
              </div>
              <div className="column">
                ({nrGrades}{" "}
                {reviews.length == 1 ? <span>review</span> : <span>review-uri</span>})
              </div>
            </div>
          </div>
        </h5>
      </div>

      <div className="text-center">
        {user.id === "" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/login")}
          >
            Loghează-te pentru a face review
          </Button>
        )}
      </div>

      <div className="text-center">
        {!hasGraded && canGrade && (
          <div>
            <b>Adaugă un review: </b>
            <Box
              component="fieldset"
              mb={3}
              borderColor="transparent"
              onClick={() => setOpen(true)}
            >
              <Rating
                name="simple-controlled"
                value={review.grade}
                onChange={(event, newValue) => setReview({ ...review, grade: newValue })}
              />
            </Box>
          </div>
        )}
      </div>

      {!hasGraded && isStudent && isApplied && !hasEnded && (
        <div className="text-center">
          <b>
            Incă nu poți face review la acest stagiu deoarece este în curs de desfășurare{" "}
          </b>
        </div>
      )}

      <div className="text-center">
        {!hasGraded && isStudent && isApplied && hasEnded && !isAccepted && (
          <div>
            <b>Nu poți face review deoarece nu ai fost acceptat la acest stagiu </b>
          </div>
        )}
      </div>

      {hasGraded && isStudent && (
        <div>
          <h5>Review-ul tău:</h5>
          <CardActionArea
            onClick={() => {
              setOpen(true);
              setSuccess(false);
            }}
          >
            <InternshipReview
              student={getStudent(user.id)}
              review={getReview(user.id, internship.id)}
            />
          </CardActionArea>
        </div>
      )}

      <div className="text-center">
        {!isStudent && user.id !== "" && (
          <div>
            <div>
              <b>Îți trebuie un cont de student pentru a face review</b>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push("/login")}
            >
              {" "}
              Loghează-te
            </Button>
          </div>
        )}
      </div>

      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            component="fieldset"
            mb={3}
            borderColor="transparent"
            onClick={() => setOpen(true)}
          >
            <Rating
              name="simple-controlled"
              value={review.grade}
              onChange={(event, newValue) => setReview({ ...review, grade: newValue })}
            />
          </Box>

          <TextField
            id="standard-full-width"
            label="Titlu"
            style={{ margin: 15 }}
            placeholder="Titlu"
            fullWidth
            margin="normal"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            value={review.title}
            onChange={(event) => setReview({ ...review, title: event.target.value })}
            required={true}
          />

          <Form.Group className="col-md-12">
            <Form.Label>Descriere</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={review.comment}
              onChange={(event) => setReview({ ...review, comment: event.target.value })}
              required={true}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Închide
            </Button>
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={handleSubmitReview}>
              Salvează
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <hr className="dividingLine"></hr>

      <div classname="text-center">
        {hasGraded && reviews.length === 1 && (
          <div className="text-center text-muted">
            Nu mai există alte review-uri ale acestui stagiu
          </div>
        )}
      </div>

      {(reviews.length > 1 || (reviews.length === 1 && !hasGraded)) && (
        <div>
          <div className="text-center">
            <h5>Alte review-uri:</h5>
          </div>
          {reviews.map(
            (rev) =>
              rev.studentId !== user.id && (
                <InternshipReview
                  internship={internship}
                  student={getStudent(rev.studentId)}
                  review={rev}
                />
              )
          )}
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center text-muted">Niciun review al acestui stagiu</div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default InternshipReviews;
