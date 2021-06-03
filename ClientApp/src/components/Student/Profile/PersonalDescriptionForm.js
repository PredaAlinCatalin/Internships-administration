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
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import CreateIcon from "@material-ui/icons/Create";

const PersonalDescriptionForm = ({ studentId }) => {
  const [input, setInput] = useState({
    personalDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [errorPersonalDescription, setErrorPersonalDescription] = useState("");
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
        personalDescription: student.personalDescription,
      });
    setLoading(false);
  }, [status, dispatch]);

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

    try {
      const resultAction = await dispatch(updateStudent(modifiedStudent));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  const handlePersonalDescriptionChange = (event) => {
    setInput({ ...input, personalDescription: event.target.value });
    setValidated(false);
  };

  return !loading && status === "succeeded" ? (
    <>
      <div
        className="rounded input-div row justify-content-center m-2 p-3 pen-icon-parent"
        onClick={() => setIsOpen(true)}
      >
        <div style={{ whiteSpace: "pre-line" }}>
          <span
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
            }}
          >
            <FormatQuoteIcon style={{ color: "gray" }} />
            {student.personalDescription}
            <FormatQuoteIcon style={{ color: "gray" }} />
          </span>
        </div>
        <div className="hide">
          <CreateIcon className="pen-icon" />
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
