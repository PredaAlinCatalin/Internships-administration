import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { fetchCompanies, selectCompanyById, updateCompany } from "../companiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CreateIcon from "@material-ui/icons/Create";

const DescriptionForm = ({ companyId }) => {
  const [input, setInput] = useState({
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const company = useSelector((state) =>
    state.companies.items.find((c) => c.id !== undefined && c.id == companyId)
  );
  const status = useSelector((state) => state.companies.status);
  const error = useSelector((state) => state.companies.error);
  const dispatch = useDispatch();

  useEffect(() => {
    async function populateWithData() {
      if (status === "idle") {
        dispatch(fetchCompanies());
      }
      if (status === "succeeded")
        setInput({
          description: company.description,
        });
      setLoading(false);
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      description: company.description,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedCompany = {
      ...company,
      description: input.description,
    };

    try {
      const resultAction = await dispatch(updateCompany(modifiedCompany));
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
        className="container rounded input-div row p-2 ml-2 mr-2 pen-icon-parent"
        onClick={(event) => {
          setIsOpen(true);
        }}
        style={{ minHeight: 40 }}
      >
        <div style={{}} className="row">
          <div className="col" style={{ whiteSpace: "pre-line" }}>
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
        <div className="hide">
          <CreateIcon className="pen-icon" />
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
