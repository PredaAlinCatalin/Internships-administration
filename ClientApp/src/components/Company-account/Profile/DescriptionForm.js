import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";

const DescriptionForm = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [input, setInput] = useState({
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const populateWithData = async () => {
      let companyResponse = await fetch("api/companies/" + companyId);
      let companyData = "";
      if (companyResponse.ok) {
        companyData = await companyResponse.json();
        setCompany(companyData);
        setInput({
          description: companyData.description,
        });
      }
      setLoading(false);
    };
    populateWithData();
  }, [companyId]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      description: company.description,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCompany({ ...company, description: input.description });

    let modifiedCompany = {
      ...company,
      description: input.description,
    };

    let aux = "api/companies/" + companyId;
    const response = await fetch(aux, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedCompany),
    });
    if (response.ok) {
      console.log(response);
      setIsOpen(false);
    }
  };

  return !loading ? (
    <>
      <div
        className="container rounded input-div"
        style={{
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: 850,
        }}
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <div style={{}} className="row">
          <div className="col-xs" style={{ whiteSpace: "pre-line" }}>
            <b
              style={{
                wordBreak: "break-all",
                wordWrap: "break-word",
              }}
            >
              {company.description}
            </b>
          </div>
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Descriere companie</Modal.Title>
        </Modal.Header>
        <Form id="DescriptionForm">
          <Modal.Body>
            <TextField
              label="Descriere"
              style={{ margin: 15 }}
              placeholder="Descriere"
              fullWidth
              margin="normal"
              value={input.description}
              onChange={(event) =>
                setInput({ ...input, description: event.target.value })
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

export default DescriptionForm;
