import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import { fetchStudent, selectStudent, updateStudent } from "../studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const FacultyForm = ({ studentId }) => {
  const [input, setInput] = useState({
    faculty: "",
    specialization: "",
    year: ""
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const student = useSelector(selectStudent);
  const status = useSelector((state) => state.student.status);
  const error = useSelector((state) => state.student.error);
  const dispatch = useDispatch();

  useEffect(() => {
    async function populateWithData() {
      if (status === "idle") {
        dispatch(fetchStudent(studentId));
      }
      if (status === "succeeded")
        setInput({
          faculty: student.faculty,
    specialization: student.specialization,
    year: student.year
        });
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      faculty: student.faculty,
    specialization: student.specialization,
    year: student.year
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      faculty: input.faculty,
    specialization: input.specialization,
    year: input.year
    };

    try {
      const resultAction = await dispatch(updateStudent(modifiedStudent));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  return status === "succeeded" ? (
    <>
      <div
        className="rounded col input-div"
        style={{
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: "850",
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div className="row">
          <div className="col-xs">Facultate:&nbsp;&nbsp;</div>
          <div
            className="col-xs"
            style={{
              display: "inline-block",
              whiteSpace: "pre-line",
            }}
          >
            <b
              style={{
                display: "inline-block",
              }}
            >
              {student.faculty}
              <br />
              {student.specialization}
              {student.year !== 0 ? ", anul" : ""}&nbsp;
              {student.year !== 0 ? student.year : ""}
            </b>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Facultate</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <TextField
              label="Numele facultății"
              style={{ margin: 15 }}
              placeholder="Numele facultății"
              fullWidth
              margin="normal"
              value={input.faculty}
              onChange={(event) => setInput({ ...input, faculty: event.target.value })}
              required={true}
            />

            <TextField
              label="Specializarea"
              style={{ margin: 15 }}
              placeholder="Specializarea"
              fullWidth
              margin="normal"
              value={input.specialization}
              onChange={(event) =>
                setInput({ ...input, specialization: event.target.value })
              }
              required={true}
            />

            <TextField
              type="number"
              label="Anul de studiu"
              style={{ margin: 15 }}
              placeholder="Anul de studiu"
              fullWidth
              margin="normal"
              value={input.year}
              onChange={(event) => setInput({ ...input, year: event.target.value })}
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

export default FacultyForm;
