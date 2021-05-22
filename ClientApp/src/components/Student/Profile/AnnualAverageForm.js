import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { fetchStudent, selectStudent, updateStudent } from "../studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const AnnualAverageForm = ({ studentId }) => {
  const [input, setInput] = useState({
    annualAverage: "",
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
          annualAverage: student.annualAverage,
        });
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      annualAverage: student.annualAverage,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      annualAverage: input.annualAverage,
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
            Medie anuală: <b>{student.annualAverage}</b>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Medie anuală</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <TextField
              type="number"
              label="Medie anuală"
              style={{ margin: 15 }}
              placeholder="Medie anuală"
              fullWidth
              margin="normal"
              value={input.annualAverage}
              onChange={(event) =>
                setInput({ ...input, annualAverage: event.target.value })
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

export default AnnualAverageForm;
