import { TextField, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "reactstrap";
import "./Profile.css";
import * as Icon from "react-bootstrap-icons";
import { getForeignLanguagesOptions } from "../../Utility/Utility";
import Select from "react-select";
import ForeignLanguage from "../../Universal/SelectElement";
import CreateIcon from "@material-ui/icons/Create";

const ForeignLanguagesForm = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState({
    studentForeignLanguages: [],
    studentForeignLanguagesAux: [],
    foreignlanguageIdsToDelete: [],
    foreignlanguageIdsToInsert: [],
    foreignlanguages: [],
    foreignlanguagesOptions: [],
    foreignlanguagesSelectedOption: null,
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

      const studentForeignLanguagesResponse = await fetch(
        "api/foreignlanguages/student/" + studentId
      );
      let studentForeignLanguagesData = [];
      if (studentForeignLanguagesResponse.ok)
        studentForeignLanguagesData = await studentForeignLanguagesResponse.json();

      const foreignlanguagesResponse = await fetch("api/foreignlanguages");
      let foreignlanguagesData = [];
      let foreignlanguagesOptions = [];
      let foreignlanguagesSelectedOption = "";
      if (foreignlanguagesResponse.ok) {
        foreignlanguagesData = await foreignlanguagesResponse.json();
        foreignlanguagesOptions = getForeignLanguagesOptions(foreignlanguagesData);
      }

      setInput({
        ...input,
        studentForeignLanguages: studentForeignLanguagesData,
        foreignlanguages: foreignlanguagesData,
        studentForeignLanguagesAux: studentForeignLanguagesData,
        foreignlanguagesOptions: foreignlanguagesOptions,
      });

      setLoading(false);
    };
    populateWithData();
  }, []);

  const handleClose = () => {
    setInput({
      ...input,
      studentForeignLanguagesAux: input.studentForeignLanguages,
      foreignlanguageIdsToDelete: [],
    });
    setIsOpen(false);
  };

  const handleChange = (changeEvent) => {
    let searchedForeignLanguage = JSON.parse(
      JSON.stringify(input.foreignlanguages.find((obj) => obj.name === changeEvent.value))
    );

    if (
      input.studentForeignLanguagesAux.find(
        (obj) => obj.name === searchedForeignLanguage.name
      ) === undefined
    ) {
      let modifiedStudentForeignLanguagesAux = JSON.parse(
        JSON.stringify(input.studentForeignLanguagesAux)
      );
      modifiedStudentForeignLanguagesAux.push(searchedForeignLanguage);

      let foreignlanguageIdsToDelete = JSON.parse(
        JSON.stringify(
          input.foreignlanguageIdsToDelete.filter(
            (obj) => obj !== searchedForeignLanguage.id
          )
        )
      );

      let foreignlanguageIdsToInsert = JSON.parse(
        JSON.stringify(input.foreignlanguageIdsToInsert)
      );
      foreignlanguageIdsToInsert.push(searchedForeignLanguage.id);

      setInput({
        ...input,
        foreignlanguagesSelectedOption: changeEvent,
        studentForeignLanguagesAux: modifiedStudentForeignLanguagesAux,
        foreignlanguageIdsToInsert: foreignlanguageIdsToInsert,
        foreignlanguageIdsToDelete: foreignlanguageIdsToDelete,
      });
    }
  };

  const handleDelete = async (foreignlanguageId) => {
    const filteredForeignLanguageIdsToInsert = JSON.parse(
      JSON.stringify(
        input.foreignlanguageIdsToInsert.filter((obj) => obj !== foreignlanguageId)
      )
    );

    const filteredForeignLanguages = JSON.parse(
      JSON.stringify(
        input.studentForeignLanguagesAux.filter((foreignlanguage) => {
          return foreignlanguage.id !== foreignlanguageId;
        })
      )
    );

    let foreignlanguageIdsToDelete = JSON.parse(
      JSON.stringify(input.foreignlanguageIdsToDelete)
    );
    foreignlanguageIdsToDelete.push(foreignlanguageId);

    setInput({
      ...input,
      studentForeignLanguagesAux: filteredForeignLanguages,
      foreignlanguageIdsToDelete: foreignlanguageIdsToDelete,
      foreignlanguageIdsToInsert: filteredForeignLanguageIdsToInsert,
    });
  };

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    console.log(input.foreignlanguageIdsToInsert);
    console.log(input.foreignlanguageIdsToDelete);

    for (let i = 0; i < input.foreignlanguageIdsToDelete.length; i++) {
      if (
        input.studentForeignLanguages.find(
          (obj) => obj.id === input.foreignlanguageIdsToDelete[i]
        ) !== undefined
      ) {
        let aux =
          "api/studentforeignlanguages/student/" +
          studentId +
          "/foreignlanguage/" +
          input.foreignlanguageIdsToDelete[i];
        await fetch(aux, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    for (let i = 0; i < input.foreignlanguageIdsToInsert.length; i++) {
      if (
        input.studentForeignLanguages.find(
          (obj) => obj.id === input.foreignlanguageIdsToInsert[i]
        ) === undefined
      ) {
        const studentForeignLanguage = {
          studentId: studentId,
          foreignlanguageId: input.foreignlanguageIdsToInsert[i],
        };

        let aux = "api/studentforeignlanguages";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentForeignLanguage),
        });
      }
    }

    setInput({
      ...input,
      studentForeignLanguages: input.studentForeignLanguagesAux,
    });
    setIsOpen(false);
  };

  return !loading ? (
    <>
      <div
        className="rounded input-div row p-2 ml-2 mr-2 pen-icon-parent"
        onClick={(event) => {
          setIsOpen(true);
        }}
      >
        <div className="col-md-3 mr-2">
          <div className="row justify-content-end">Limbi străine</div>
        </div>
        <div
          className="col-md-7"
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
            {input.studentForeignLanguages !== []
              ? input.studentForeignLanguages
                  .map((foreignlanguage) => foreignlanguage.name)
                  .join(", ")
              : ""}
          </b>
        </div>
        <div className="hide">
          <CreateIcon className="pen-icon" />
        </div>
      </div>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Limbi străine</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            {input.studentForeignLanguagesAux !== []
              ? input.studentForeignLanguagesAux.map((foreignlanguage) => (
                  <ForeignLanguage
                    key={foreignlanguage.id}
                    id={foreignlanguage.id}
                    name={foreignlanguage.name}
                    onDelete={handleDelete}
                  />
                ))
              : ""}
            <br /> <br />
            <Select
              placeholder="Selectează limba"
              value={input.foreignlanguagesSelectedOption}
              options={input.foreignlanguagesOptions}
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

export default ForeignLanguagesForm;
