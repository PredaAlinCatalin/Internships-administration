import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import { fetchStudents, selectStudentById, updateStudent } from "../studentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CreateIcon from "@material-ui/icons/Create";

const NameForm = ({ studentId }) => {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const student = useSelector((state) =>
    state.students.items.find((s) => s.id !== undefined && s.id == studentId)
  );
  const status = useSelector((state) => state.students.status);
  const error = useSelector((state) => state.students.error);
  const dispatch = useDispatch();

  useEffect(() => {
    async function populateWithData() {
      if (status === "idle") {
        dispatch(fetchStudents());
      }
    }
    populateWithData();
    if (status === "succeeded")
      setInput({
        firstName: student.firstName,
        lastName: student.lastName,
      });
    setLoading(false);
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      firstName: student.firstName,
      lastName: student.lastName,
    });
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      firstName: input.firstName,
      lastName: input.lastName,
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

  return !loading && status === "succeeded" ? (
    <>
      <div
        className="rounded col input-div pen-icon-parent p-2"
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <h5>
          Nume: {student.lastName} {student.firstName}
        </h5>

        <div className="hide">
          <CreateIcon className="pen-icon" />
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
