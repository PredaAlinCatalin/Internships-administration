import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";

const PhoneForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    phoneNumber: "",
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
          phoneNumber: studentData.phoneNumber,
        });
      }
      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      phoneNumber: student.phoneNumber,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStudent({
      ...student,
      phoneNumber: input.phoneNumber,
    });

    let modifiedStudent = {
      ...student,
      phoneNumber: input.phoneNumber,
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
          marginTop: 10,
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: "850",
        }}
        onClick={() => setIsOpen(true)}
      >
        <div className="row">
          <div
            className="col-xs"
            style={{
              display: "inline-block",
              whiteSpace: "pre-line",
            }}
          >
            <div
              style={{
                display: "inline-block",
                color: "#0c56a5",
              }}
            >
              <Icon.TelephoneFill />
              {student.phoneNumber}
              &nbsp;
            </div>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Număr de telefon</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <TextField
              label="Număr de telefon"
              style={{ margin: 15 }}
              placeholder="Număr de telefon"
              fullWidth
              margin="normal"
              value={input.phoneNumber}
              onChange={(event) =>
                setInput({ ...input, phoneNumber: event.target.value })
              }
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

export default PhoneForm;
