import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import { fetchStudent, selectStudent, updateStudent } from "../studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const NameForm = ({ studentId }) => {
  const [input, setInput] = useState({
    firstName: "",
    lastName: ""
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const student = useSelector(selectStudent);
  const status = useSelector((state) => state.student.status);
  const error = useSelector((state) => state.student.error);
  const dispatch = useDispatch();

  useEffect(() => {
    async function populateWithData() {
      if (status === "idle") {
        dispatch(fetchStudent(studentId));
      }
    }
    populateWithData();
    if (status === "succeeded")
      setInput({
        firstName: student.firstName,
        lastName: student.lastName
      });
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      firstName: student.firstName,
      lastName: student.lastName
    });
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      firstName: input.firstName,
      lastName: input.lastName
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
