import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";

const NameForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const populateWithData = async () => {
      let studentResponse = await fetch("api/students/" + studentId);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
        setInput({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
        });
      }
      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      firstName: student.firstName,
      lastName: student.lastName,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStudent({ ...student, firstName: input.firstName, lastName: input.lastName });

    let modifiedStudent = {
      ...student,
      firstName: input.firstName,
      lastName: input.lastName,
    };

    let aux = "api/students/" + studentId;
    const response = await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedStudent),
    });
    if (response.ok) {
      console.log(response);
      setIsOpen(false);
    }
  };

  return !loading ? (
    <>
      <div
        className="rounded col input-div"
        style={{
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: "850",
        }}
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <div className="row">
          <div className="col">
            <h3>
              Nume: {student.lastName} {student.firstName}
            </h3>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nume și prenume</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <TextField
              label="Nume"
              style={{ margin: 15 }}
              placeholder="Nume"
              fullWidth
              margin="normal"
              value={input.lastName}
              onChange={(event) => setInput({ ...input, lastName: event.target.value })}
              required={true}
            />

            <TextField
              label="Prenume"
              style={{ margin: 15 }}
              placeholder="Prenume"
              fullWidth
              margin="normal"
              value={input.firstName}
              onChange={(event) => setInput({ ...input, firstName: event.target.value })}
              required={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Închide
              </Button>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
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

export default NameForm;
