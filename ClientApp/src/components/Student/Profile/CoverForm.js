import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import { Link } from "react-router-dom";
import PhotoForm from "./PhotoForm";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

const CoverForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    path: "",
    data: "",
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
          data: "",
          path: studentData.coverPath,
        });
      }
      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      path: student.coverPath,
    });
  };

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let modifiedStudent = null;
    await fetch("api/students/savecover/" + student.id, {
      method: "POST",
      body: input.data,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setInput({ ...input, path: result });
          setStudent({ ...student, coverPath: result });
          modifiedStudent = { ...student, coverPath: result };
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    var aux = "api/students/" + student.id;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedStudent),
    }).then((res) => {
      if (res.ok) {
        setIsOpen(false);
      }
    });
  };

  const handleChange = (event) => {
    event.preventDefault();
    let coverFileName = event.target.files[0].name;
    const formData = new FormData();
    formData.append("myFile", event.target.files[0], event.target.files[0].name);

    console.log(formData);

    setInput({ ...input, data: formData });

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("cover");
        img.file = file;
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

  return !loading ? (
    <>
      <div className="cover-container">
        <img alt="cover" src={"covers/" + student.coverPath} />
        <IconButton className="cover-btn" onClick={() => setIsOpen(true)}>
          <PhotoCameraIcon />
        </IconButton>
      </div>

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

export default CoverForm;
