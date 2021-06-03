import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import "./coverButton.css";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

const LogoForm = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [companyLogoPath, setCompanyLogoPath] = useState("");
  const [logoFormData, setLogoFormData] = useState(null);

  useEffect(() => {
    const populateWithData = async () => {
      let companyResponse = await fetch("api/companies/" + companyId);
      let companyData = "";
      if (companyResponse.ok) {
        companyData = await companyResponse.json();
        setCompany(companyData);
      }
      setLoading(false);
    };
    populateWithData();
  }, [companyId]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    let photoFileName = event.target.files[0].name;
    const formData = new FormData();
    formData.append("myFile", event.target.files[0], event.target.files[0].name);

    console.log(formData);
    console.log(photoFileName);

    setLogoFormData(formData);

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("obj");
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

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    console.log(companyLogoPath);
    let path = "";
    await fetch("api/companies/savelogo/" + companyId, {
      method: "POST",
      body: logoFormData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          path = result;
          setCompanyLogoPath(result);
          console.log("REZULTAT", result);
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    var modifiedCompany = company;
    modifiedCompany.logoPath = path;
    console.log("LOGOPATH", companyLogoPath);
    var aux = "api/companies/" + companyId;
    await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedCompany),
    }).then((response) => {
      if (response.ok) {
        console.log("OK");
        setCompany(modifiedCompany);
        setIsOpen(false);
      }
    });
  };

  return !loading ? (
    <div className="photo-container">
      <img
        width="100"
        height="100"
        className="cover-img"
        alt="logo"
        src={"logos/" + company.logoPath}
        onMouseOver={(event) => (event.target.style.cursor = "pointer")}
        onMouseOut={(event) => (event.target.style.cursor = "normal")}
        onClick={() => setIsOpen(true)}
      />
      <PhotoCameraIcon className="photo-btn" />
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Logo companie</Modal.Title>
        </Modal.Header>
        <Form id="LogoForm">
          <Modal.Body>
            <div id="thumbnail">
              Logo companie:
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
    </div>
  ) : (
    <></>
  );
};

export default LogoForm;
