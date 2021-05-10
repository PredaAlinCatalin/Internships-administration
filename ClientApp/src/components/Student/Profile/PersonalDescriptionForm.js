import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";

const PersonalDescriptionForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    personalDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [errorPersonalDescription, setErrorPersonalDescription] = useState("");
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    const populateWithData = async () => {
      let studentResponse = await fetch("api/students/" + studentId);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
        setInput({
          personalDescription: studentData.personalDescription,
        });
      }
      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      personalDescription: student.personalDescription,
    });
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      personalDescription: input.personalDescription,
    };

    let aux = "api/students/" + studentId;
    await axios
      .put(aux, modifiedStudent)
      .then((response) => {
        setStudent({
          ...student,
          personalDescription: input.personalDescription,
        });
        setIsOpen(false);
      })
      .catch((error) => {
        if (error.response) {
          let allErrors = error.response.data.errors;
          if (allErrors.PersonalDescription !== undefined)
            setErrorPersonalDescription(allErrors.PersonalDescription.join(", "));

          setValidated(true);
        }
      });
  };

  const handlePersonalDescriptionChange = (event) => {
    setInput({ ...input, personalDescription: event.target.value });
    setValidated(false);
  };

  return !loading ? (
    <>
      <div
        className="rounded col input-div"
        style={{
          marginTop: 10,
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: "850",
        }}
        onClick={() => setIsOpen(true)}
      >
        <div style={{}} className="row">
          <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
            <b
              style={{
                wordBreak: "break-all",
                wordWrap: "break-word",
              }}
            >
              {student.personalDescription}
            </b>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Descriere personală</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated}>
          <Modal.Body>
            <Form.Group className="col-md-12">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={input.personalDescription}
                onChange={handlePersonalDescriptionChange}
                required={true}
              />
              <Form.Control.Feedback type="invalid">
                {errorPersonalDescription}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Închide
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Salvează
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default PersonalDescriptionForm;
