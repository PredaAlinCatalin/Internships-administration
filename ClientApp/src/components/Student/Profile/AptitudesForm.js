import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { getAptitudesOptions } from "../../Utility/Utility";
import Select from "react-select";
import Aptitude from "../../Universal/SelectElement";
import axios from "axios";
import {
  fetchStudentAptitudes,
  selectAllStudentAptitudes,
  addStudentAptitude,
  deleteStudentAptitude,
} from "./studentAptitudesSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const AptitudesForm = ({ studentId }) => {
  const [input, setInput] = useState({
    studentAptitudesAux: [],
    aptitudeIdsToDelete: [],
    aptitudeIdsToInsert: [],
    aptitudes: [],
    aptitudesOptions: [],
    aptitudesSelectedOption: null,
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const studentAptitudes = useSelector(selectAllStudentAptitudes);
  const status = useSelector((state) => state.studentAptitudes.status);
  const error = useSelector((state) => state.studentAptitudes.error);
  const dispatch = useDispatch();

  useEffect(() => {
    const populateWithData = async () => {
      if (status === "idle") dispatch(fetchStudentAptitudes(studentId));

      const aptitudesResponse = await fetch("api/aptitudes");
      let aptitudesData = [];
      let aptitudesOptions = [];
      let aptitudesSelectedOption = "";
      if (aptitudesResponse.ok) {
        aptitudesData = await aptitudesResponse.json();
        aptitudesOptions = getAptitudesOptions(aptitudesData);
        setInput({
          ...input,
          aptitudes: aptitudesData,
          aptitudesOptions: aptitudesOptions,
        });
        console.log(aptitudesData);
      }

      if (status === "succeeded") {
        console.log(studentAptitudes);
        setInput({
          ...input,
          studentAptitudesAux: [...studentAptitudes],
        });
        setLoading(false);
      }
    };
    populateWithData();
  }, [status, dispatch]);

  const handleClose = () => {
    setInput({
      ...input,
      studentAptitudesAux: [...studentAptitudes],
      aptitudeIdsToDelete: [],
      aptitudeIdsToInsert: [],
    });
    setIsOpen(false);
  };

  const handleChange = (changeEvent) => {
    let searchedAptitude = JSON.parse(
      JSON.stringify(input.aptitudes.find((obj) => obj.name === changeEvent.value))
    );

    let searchedStudentAptitude = input.studentAptitudesAux.find(
      (obj) => obj.aptitudeId === searchedAptitude.id
    );

    if (searchedStudentAptitude === undefined) {
      console.log("Its undefined")
      let newStudentAptitude = {
        aptitudeId: searchedAptitude.id,
        studentId: studentId,
      };

      let modifiedStudentAptitudesAux = JSON.parse(
        JSON.stringify(input.studentAptitudesAux)
      );

      modifiedStudentAptitudesAux.push(newStudentAptitude);

      let aptitudeIdsToDelete = JSON.parse(
        JSON.stringify(
          input.aptitudeIdsToDelete.filter((obj) => obj !== searchedAptitude.id)
        )
      );

      let aptitudeIdsToInsert = JSON.parse(JSON.stringify(input.aptitudeIdsToInsert));
      aptitudeIdsToInsert.push(searchedAptitude.id);

      setInput({
        ...input,
        aptitudesSelectedOption: changeEvent,
        studentAptitudesAux: modifiedStudentAptitudesAux,
        aptitudeIdsToInsert: aptitudeIdsToInsert,
        aptitudeIdsToDelete: aptitudeIdsToDelete,
      });
    }
  };

  const handleDelete = async (aptitudeId) => {
    const filteredAptitudeIdsToInsert = JSON.parse(
      JSON.stringify(input.aptitudeIdsToInsert.filter((obj) => obj !== aptitudeId))
    );

    const filteredAptitudes = JSON.parse(
      JSON.stringify(
        input.studentAptitudesAux.filter((studentAptitude) => {
          return studentAptitude.aptitudeId !== aptitudeId;
        })
      )
    );

    let aptitudeIdsToDelete = JSON.parse(JSON.stringify(input.aptitudeIdsToDelete));
    aptitudeIdsToDelete.push(aptitudeId);

    setInput({
      ...input,
      studentAptitudesAux: filteredAptitudes,
      aptitudeIdsToDelete: aptitudeIdsToDelete,
      aptitudeIdsToInsert: filteredAptitudeIdsToInsert,
    });
  };

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    console.log(input.aptitudeIdsToInsert);
    console.log(input.aptitudeIdsToDelete);

    for (let i = 0; i < input.aptitudeIdsToDelete.length; i++) {
      if (
        studentAptitudes.find((obj) => obj.aptitudeId === input.aptitudeIdsToDelete[i]) !==
        undefined
      ) {
        let item = {
          studentId: studentId,
          aptitudeId: input.aptitudeIdsToDelete[i],
        };
        dispatch(deleteStudentAptitude(item));
      }
    }

    for (let i = 0; i < input.aptitudeIdsToInsert.length; i++) {
      if (
        studentAptitudes.find((obj) => obj.aptitudeId === input.aptitudeIdsToInsert[i]) ===
        undefined
      ) {
        const studentAptitude = {
          studentId: studentId,
          aptitudeId: input.aptitudeIdsToInsert[i],
        };

        dispatch(addStudentAptitude(studentAptitude));
      }
    }

    setIsOpen(false);
  };

  return !loading ? (
    <>
      <div
        className="container input-div"
        style={{
          padding: 10,
          paddingRight: 25,
          paddingLeft: 25,
          width: "850",
        }}
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <div className="row">
          <div
            className="col-xs"
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
              {studentAptitudes !== []
                ? studentAptitudes
                    .map(
                      (studentAptitude) =>
                        input.aptitudes.find((a) => a.id === studentAptitude.aptitudeId)
                          .name
                    )
                    .join(", ")
                : ""}
            </b>
          </div>
        </div>
      </div>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aptitudini</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            {input.studentAptitudesAux !== []
              ? input.studentAptitudesAux.map((studentAptitude) => (
                  <Aptitude
                    key={studentAptitude.aptitudeId}
                    id={studentAptitude.aptitudeId}
                    name={
                      input.aptitudes.find((a) => a.id === studentAptitude.aptitudeId)
                        .name
                    }
                    onDelete={handleDelete}
                  />
                ))
              : ""}
            <br /> <br />
            <Select
              placeholder="Selecteaza aptitudine"
              value={input.aptitudesSelectedOption}
              options={input.aptitudesOptions}
              onChange={handleChange}
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

export default AptitudesForm;
