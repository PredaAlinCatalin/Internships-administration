import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { getAptitudesOptions } from "../../Utility/Utility";
import Select from "react-select";
import Aptitude from "../../Universal/SelectElement";

const AptitudesForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
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

  useEffect(() => {
    const populateWithData = async () => {
      let studentResponse = await fetch("api/students/" + studentId);
      let studentData = "";
      if (studentResponse.ok) {
        studentData = await studentResponse.json();
        setStudent(studentData);
      }

      const studentAptitudesResponse = await fetch("api/aptitudes/student/" + studentId);
      let studentAptitudesData = [];
      if (studentAptitudesResponse.ok)
        studentAptitudesData = await studentAptitudesResponse.json();

      const aptitudesResponse = await fetch("api/aptitudes");
      let aptitudesData = [];
      let aptitudesOptions = [];
      let aptitudesSelectedOption = "";
      if (aptitudesResponse.ok) {
        aptitudesData = await aptitudesResponse.json();
        aptitudesOptions = getAptitudesOptions(aptitudesData);
      }

      setInput({
        ...input,
        studentAptitudes: studentAptitudesData,
        aptitudes: aptitudesData,
        studentAptitudesAux: studentAptitudesData,
        aptitudesOptions: aptitudesOptions,
      });

      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setInput({
      ...input,
      studentAptitudesAux: input.studentAptitudes,
      aptitudeIdsToDelete: [],
    });
    setIsOpen(false);
  };

  const handleChange = (changeEvent) => {
    let searchedAptitude = JSON.parse(
      JSON.stringify(input.aptitudes.find((obj) => obj.name === changeEvent.value))
    );

    if (
      input.studentAptitudesAux.find((obj) => obj.name === searchedAptitude.name) ===
      undefined
    ) {
      let modifiedStudentAptitudesAux = JSON.parse(
        JSON.stringify(input.studentAptitudesAux)
      );
      modifiedStudentAptitudesAux.push(searchedAptitude);

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
        input.studentAptitudesAux.filter((aptitude) => {
          return aptitude.id !== aptitudeId;
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
        input.studentAptitudes.find((obj) => obj.id === input.aptitudeIdsToDelete[i]) !==
        undefined
      ) {
        let aux =
          "api/studentaptitudes/student/" +
          studentId +
          "/aptitude/" +
          input.aptitudeIdsToDelete[i];
        await fetch(aux, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    for (let i = 0; i < input.aptitudeIdsToInsert.length; i++) {
      if (
        input.studentAptitudes.find((obj) => obj.id === input.aptitudeIdsToInsert[i]) ===
        undefined
      ) {
        const studentAptitude = {
          studentId: studentId,
          aptitudeId: input.aptitudeIdsToInsert[i],
        };

        let aux = "api/studentaptitudes";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentAptitude),
        });
      }
    }

    setInput({
      ...input,
      studentAptitudes: input.studentAptitudesAux,
    });
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
              {input.studentAptitudes !== []
                ? input.studentAptitudes.map((aptitude) => aptitude.name).join(", ")
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
              ? input.studentAptitudesAux.map((aptitude) => (
                  <Aptitude
                    key={aptitude.id}
                    id={aptitude.id}
                    name={aptitude.name}
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
