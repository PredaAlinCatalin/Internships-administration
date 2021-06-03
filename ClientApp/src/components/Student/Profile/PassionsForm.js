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

const PassionsForm = ({ studentId }) => {
  const [input, setInput] = useState({
    passions: "",
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
      if (status === "succeeded")
        setInput({
          passions: student.passions,
        });
      setLoading(false);
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      passions: student.passions,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      passions: input.passions,
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
        className="rounded input-div row p-2 ml-2 mr-2 pen-icon-parent"
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <div className="col-md-3 mr-2">
          <div className="row justify-content-end">Pasiuni</div>
        </div>
        <div
          className="col-md-7"
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
            {student.passions}
          </b>
        </div>

        <div className="hide">
          <CreateIcon className="pen-icon" />
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pasiuni</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <TextField
              label="Pasiuni"
              style={{ margin: 15 }}
              placeholder="Pasiuni"
              fullWidth
              margin="normal"
              value={input.passions}
              onChange={(event) => setInput({ ...input, passions: event.target.value })}
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

export default PassionsForm;
