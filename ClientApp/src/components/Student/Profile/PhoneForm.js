import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { fetchStudents, selectStudentById, updateStudent } from "../studentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CreateIcon from "@material-ui/icons/Create";

const PhoneForm = ({ studentId }) => {
  const [input, setInput] = useState({
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
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
        phoneNumber: student.phoneNumber,
      });
    setLoading(false);
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      phoneNumber: student.phoneNumber,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      phoneNumber: input.phoneNumber,
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
        onClick={() => setIsOpen(true)}
      >
        <div
          style={{
            display: "inline-block",
            color: "#0c56a5",
          }}
        >
          <Icon.TelephoneFill />
          {student.phoneNumber}
        </div>

        <div className="hide">
          <CreateIcon className="pen-icon" />
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
