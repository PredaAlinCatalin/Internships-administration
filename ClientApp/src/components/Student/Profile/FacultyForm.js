import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import { fetchStudents, selectStudentById, updateStudent } from "../studentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CreateIcon from "@material-ui/icons/Create";
import axios from "axios";
import { getSelectOptions } from "../../Utility/Utility";
import Select from "react-select";
const FacultyForm = ({ studentId }) => {
  const [input, setInput] = useState({
    year: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [facultiesOptions, setFacultiesOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const student = useSelector((state) =>
    state.students.items.find((s) => s.id !== undefined && s.id == studentId)
  );
  const status = useSelector((state) => state.students.status);
  const error = useSelector((state) => state.students.error);
  const dispatch = useDispatch();

  useEffect(() => {
    async function populateWithData() {
      let facultiesData = [];
      await axios
        .get("api/faculties")
        .then((response) => {
          setFaculties(response.data);
          facultiesData = response.data;
          setFacultiesOptions(getSelectOptions(response.data));
        })
        .catch((error) => console.log(error));

      if (status === "idle") {
        dispatch(fetchStudents());
      }
      if (status === "succeeded") {
        console.log(student);
        setInput({
          facultyId: student.facultyId,
          year: student.year,
        });
        let faculty = facultiesData.find((f) => f.id === student.facultyId);
        console.log(facultiesData);
        console.log(student.facultyId);
        console.log(typeof facultiesData[0].id);
        console.log(typeof student.facultyId);
        console.log(faculty);
        if (faculty !== undefined) {
          setSelectedOption({
            value: faculty.id,
            label: faculty.name,
          });
        }
        setLoading(false);
      }
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      year: student.year,
    });
    let faculty = faculties.find((f) => f.facultyId === student.facultyId);
    if (faculty !== undefined) {
      setSelectedOption({
        value: faculty.id,
        label: faculty.name,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedStudent = {
      ...student,
      year: input.year,
      facultyId: selectedOption.value,
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
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div className="row">
          <div className="col-2">Facultate:&nbsp;&nbsp;</div>
          <div className="col">
            <b>
              {selectedOption !== null ? selectedOption.label : ""}
              <br />
              {student.year != 0 ? "Anul" : ""}&nbsp;
              {student.year != 0 ? student.year : ""}
            </b>
          </div>
        </div>
        <div className="hide">
          <CreateIcon className="pen-icon" />
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Facultate</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Select
              placeholder="Selectează facultate"
              value={selectedOption}
              options={facultiesOptions}
              onChange={(event) => setSelectedOption(event)}
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
