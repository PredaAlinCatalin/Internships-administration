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

const AddressForm = ({ companyId }) => {
  const [input, setInput] = useState({
    address: "",
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
          address: company.address,
        });
      setLoading(false);
    }
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setIsOpen(false);
    setInput({
      address: company.address,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let modifiedCompany = {
      ...company,
      address: input.address,
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
        <div className="row">
          <div className="col" style={{ whiteSpace: "pre-line" }}>
            <b
              style={{
                wordBreak: "break-all",
                wordWrap: "break-word",
              }}
            >
              {company.address}
            </b>
          </div>
        </div>
        <div className="hide">
          <CreateIcon className="pen-icon" />
        </div>
      </div>

      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adresa companiei</Modal.Title>
        </Modal.Header>
        <Form id="AddressForm">
          <Modal.Body>
            <TextField
              label="Adres??"
              style={{ margin: 15 }}
              placeholder="Adres??"
              fullWidth
              margin="normal"
              value={input.address}
              onChange={(event) => setInput({ ...input, address: event.target.value })}
              required={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                ??nchide
              </Button>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Salveaz??
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

export default AddressForm;
