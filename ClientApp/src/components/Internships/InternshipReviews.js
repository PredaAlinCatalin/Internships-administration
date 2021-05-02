import React, { useEffect, useState } from "react";
import InternshipReview from "./InternshipReview";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Button, Box, TextField, CardActionArea } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Form, Modal } from "react-bootstrap";
import Loading from "../Universal/Loading";
import { useHistory } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import { useIsStudent } from "../Authentication/Authentication";

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
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const isStudent = useIsStudent();

  useEffect(() => {
    let userStorage = JSON.parse(sessionStorage.getItem("user"));
    setUser(userStorage);
    async function populateWithData() {
      await fetch("api/internships/" + internshipId)
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();
            setInternship(data);
            fetch("api/companies/" + data.idCompany).then(async (response) => {
              if (response.ok) {
                let dataCompany = await response.json();
                setCompany(dataCompany);
              }
            });
          }
        })
        .catch((error) => console.log(error));

      await fetch("api/studentInternshipReviews/internship/" + internshipId)
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();
            setReviews(data);
            if (data.length > 0) {
              setEmptyList(false);
            }
          }
        })
        .catch((error) => console.log(error));

      await fetch("api/students")
        .then(async (res) => {
          if (res.ok) {
            let data = await res.json();
            setStudents(data);
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
      idStudent: user.id,
      idInternship: internshipId,
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
    console.log(students.find((s) => s.id === id));
    return students.find((s) => s.id === id);
  };

  const getReview = (idStudent, idInternship) => {
    return reviews.find(
      (r) => r.idStudent === idStudent && r.idInternship === idInternship
    );
  };

  return !loading ? (
    <div>
      <br/>
      <div className="text-center">
        <h5>
          Review-urile stagiului{" "}
          <Link to={"/internship/" + internship.id}>{internship.name}</Link> de la
          compania <Link to={"/company/" + company.id}>{company.name}</Link>
        </h5>
      </div>

      {user.id === "" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.pushState("/login")}
        >
          Loghează-te pentru a face review
        </Button>
      )}
      {!hasGraded && isStudent && (
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

      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Categorii</Modal.Title>
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
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Închide
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmitReview}>
            Salvează
          </Button>
        </Modal.Footer>
      </Modal>

      <hr className="dividingLine"></hr>
      <h5>Alte review-uri:</h5>
      {!emptyList ? (
        reviews.map(
          (rev) =>
            rev.idStudent !== user.id && (
              <InternshipReview
                internship={internship}
                student={getStudent(rev.idStudent)}
                review={rev}
              />
            )
        )
      ) : (
        <div className="text-center text-muted">Niciun review al acestui stagiu</div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default InternshipReviews;
