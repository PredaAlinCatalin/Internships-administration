import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import { Link } from "react-router-dom";
import { fetchStudents, selectStudentById, updateStudent } from "../studentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const PhotoForm = ({ studentId }) => {
  const [input, setInput] = useState({
    path: "",
    data: "",
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
    const populateWithData = async () => {
      if (status === "idle") {
        dispatch(fetchStudents());
      }

      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      path: student.photoPath,
    });
  };

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudent = null;
    await fetch("api/students/savephoto/" + student.id, {
      method: "POST",
      body: input.data,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setInput({ ...input, path: result });
          modifiedStudent = { ...student, photoPath: result };
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    try {
      const resultAction = await dispatch(updateStudent(modifiedStudent));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    let photoFileName = event.target.files[0].name;
    const formData = new FormData();
    formData.append("myFile", event.target.files[0], event.target.files[0].name);

    console.log(formData);

    setInput({ ...input, data: formData });

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("photo");
        img.file = file;
        img.style.width = '100px';
        img.style.height = '100px';
        preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

        const reader = new FileReader();
        reader.onload = (function (aImg) {
          return function (e) {
            aImg.src = e.target.result;
          };
        })(img);
        reader.readAsDataURL(file);
      }
    };
    handleFiles(event.target.files[0]);
  };

  return !loading && status === "succeeded" ? (
    <>
      <img
        width="200"
        height="200"
        alt="photo"
        src={"photos/" + student.photoPath}
        onMouseOver={(event) => (event.target.style.cursor = "pointer")}
        onMouseOut={(event) => (event.target.style.cursor = "normal")}
        onClick={() => {
          setIsOpen(true);
        }}
      />

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Imagine de profil</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <div id="thumbnail">
              <input type="file" onChange={handleChange} />
            </div>
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

export default PhotoForm;
