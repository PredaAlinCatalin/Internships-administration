import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import "./coverButton.css";
import IconButton from "@material-ui/core/IconButton";
import LogoForm from "./LogoForm";
import { fetchCompanies, selectCompanyById, updateCompany } from "../companiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const CoverPathForm = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [companyCoverPath, setCompanyCoverPath] = useState("");
  const [coverFormData, setCoverFormData] = useState(null);
  const company = useSelector((state) =>
    state.companies.items.find((c) => c.id !== undefined && c.id == companyId)
  );
  const status = useSelector((state) => state.companies.status);
  const error = useSelector((state) => state.companies.error);
  const dispatch = useDispatch();

  useEffect(() => {
    const populateWithData = async () => {
      if (status === "idle") {
        dispatch(fetchCompanies());
      }
      if (status === "succeeded") setCompanyCoverPath(company.coverPath);

      setLoading(false);
    };
    populateWithData();
  }, [status, dispatch]);

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

    setCoverFormData(formData);

    let preview = document.getElementById("thumbnail");

    const handleFiles = (file) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        img.style.width = '200px';
        img.style.height = '50px';
        preview.appendChild(img); 

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
    console.log(companyCoverPath);
    let path = "";
    await fetch("api/companies/savecover/" + companyId, {
      method: "POST",
      body: coverFormData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          path = result;
          setCompanyCoverPath(result);
          console.log("REZULTAT", result);
        },
        (error) => {
          alert("Failed upload image");
        }
      );

    var modifiedCompany = { ...company };
    modifiedCompany.coverPath = path;

    try {
      const resultAction = await dispatch(updateCompany(modifiedCompany));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }

    // console.log("COVERPATH", companyCoverPath);
    // var aux = "api/companies/" + companyId;
    // await fetch(aux, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },

    //   body: JSON.stringify(modifiedCompany),
    // }).then((response) => {
    //   if (response.ok) {
    //     console.log("OK");
    //     setCompany(modifiedCompany);
    //     setIsOpen(false);
    //   }
    // });
  };

  return !loading && status === "succeeded" ? (
    <div className="ml-2">
      <div className="cover-container">
        <img alt="cover" src={"covers/" + company.coverPath} width="860" height="200" />
        <IconButton className="cover-btn" onClick={() => setIsOpen(true)}>
          <PhotoCameraIcon />
        </IconButton>
        <LogoForm companyId={companyId} />
      </div>

      {/* <img
        width="800"
        height="200"
        alt="cover"
        src={"covers/" + company.coverPath}
        onMouseOver={(event) => (event.target.style.cursor = "pointer")}
        onMouseOut={(event) => (event.target.style.cursor = "normal")}
        onClick={() => setIsOpen(true)}
      /> */}

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cover companie</Modal.Title>
        </Modal.Header>
        <Form id="CoverForm">
          <Modal.Body>
            <div id="thumbnail">
              Cover companie:
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

export default CoverPathForm;
