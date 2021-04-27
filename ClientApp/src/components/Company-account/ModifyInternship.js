﻿import React, { useState, useEffect } from "react";
import Select from "react-select";
import Category from "./Category";
import SelectElement from "../Universal/SelectElement";
import { useHistory } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "../Universal/Input";
import { Form, Modal, Button} from "react-bootstrap";
import API from "../../api";
import Loading from "../Universal/Loading";

const ModifyInternship = ({ internshipId }) => {
  const history = useHistory();
  const [internship, setInternship] = useState(null);
  const [internshipMaxNumberStudents, setInternshipMaxNumberStudents] = useState(0);
  const [internshipName, setInternshipName] = useState("");
  const [internshipDescription, setInternshipDescription] = useState("");
  const [internshipPaid, setInternshipPaid] = useState(false);
  const [internshipStartDate, setInternshipStartDate] = useState("");
  const [internshipEndDate, setInternshipEndDate] = useState("");
  const [internshipDeadline, setInternshipDeadline] = useState("");
  const [internshipCategories, setInternshipCategories] = useState([]);
  const [internshipAptitudes, setInternshipAptitudes] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [internshipCitySelectedOption, setCitiesSelectedOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesSelectedOption, setCategoriesSelectedOption] = useState("");
  const [internshipCategoriesAux, setInternshipCategoriesAux] = useState([]);
  const [idInternshipCategoriesToDelete, setIdInternshipCategoriesToDelete] = useState(
    []
  );
  const [idInternshipCategoriesToInsert, setIdInternshipCategoriesToInsert] = useState(
    []
  );
  const [
    idInternshipCategoriesToDeleteAux,
    setIdInternshipCategoriesToDeleteAux,
  ] = useState([]);
  const [
    idInternshipCategoriesToInsertAux,
    setIdInternshipCategoriesToInsertAux,
  ] = useState([]);
  const [categoriesIsOpen, setCategoriesIsOpen] = useState(false);
  const [aptitudes, setAptitudes] = useState([]);
  const [aptitudesOptions, setAptitudesOptions] = useState([]);
  const [aptitudesSelectedOption, setAptitudesSelectedOption] = useState("");
  const [internshipAptitudesAux, setInternshipAptitudesAux] = useState([]);
  const [idInternshipAptitudesToDelete, setIdInternshipAptitudesToDelete] = useState([]);
  const [idInternshipAptitudesToInsert, setIdInternshipAptitudesToInsert] = useState([]);
  const [
    idInternshipAptitudesToDeleteAux,
    setIdInternshipAptitudesToDeleteAux,
  ] = useState([]);
  const [
    idInternshipAptitudesToInsertAux,
    setIdInternshipAptitudesToInsertAux,
  ] = useState([]);
  const [aptitudesIsOpen, setAptitudesIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateModifyInternshipData = async () => {
      try {
        let internshipData = "";
        await fetch("api/internships/" + internshipId)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            internshipData = data;
            setInternship(internshipData);
          });

        let internshipCategoriesResponse = await fetch(
          "api/categories/internship/" + internshipId
        );
        let internshipCategoriesData = "";
        if (internshipCategoriesResponse.ok) {
          internshipCategoriesData = await internshipCategoriesResponse.json();
          console.log(internshipCategoriesData);
        }

        let internshipAptitudesResponse = await fetch(
          "api/aptitudes/internship/" + internshipId
        );
        let internshipAptitudesData = "";
        if (internshipAptitudesResponse.ok) {
          internshipAptitudesData = await internshipAptitudesResponse.json();
        }

        let citiesData = [];
        let citiesOptions = [];
        await fetch("api/cities")
          .then((res) => res.json())
          .then((data) => {
            citiesData = data;
            citiesOptions = getCitiesOptions(citiesData);
          });

        for (let i = 0; i < citiesOptions.length; i++) {
          if (
            citiesOptions[i].value === getCity(citiesData, internshipData.idCity).name
          ) {
            setCitiesSelectedOption(citiesOptions[i]);
          }
        }

        let categoriesResponse = await fetch("api/categories");
        let categoriesData = "";
        let categoriesOptions = "";
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
          categoriesOptions = getCategoriesOptions(categoriesData);
        }

        let aptitudesResponse = await fetch("api/aptitudes");
        let aptitudesData = "";
        let aptitudesOptions = "";
        if (aptitudesResponse.ok) {
          aptitudesData = await aptitudesResponse.json();
          aptitudesOptions = getAptitudesOptions(aptitudesData);
        }

        setInternshipMaxNumberStudents(internshipData.maxNumberStudents);
        setInternshipName(internshipData.name);

        let descriptionCopy = internshipData.description;
        descriptionCopy = descriptionCopy.replaceAll("<br/>", "\n");
        setInternshipDescription(descriptionCopy);

        setInternshipPaid(internshipData.paid);
        setInternshipStartDate(internshipData.startDate);
        setInternshipEndDate(internshipData.endDate);
        setInternshipDeadline(internshipData.deadline);

        if (internshipCategoriesResponse.ok) {
          setInternshipCategories(internshipCategoriesData);
          setInternshipCategoriesAux(internshipCategoriesData);
        }

        if (internshipAptitudesResponse.ok) {
          setInternshipAptitudes(internshipAptitudesData);
          setInternshipAptitudesAux(internshipAptitudesData);
        }

        setCities(citiesData);
        setCitiesOptions(citiesOptions);

        setCategories(categoriesData);
        setCategoriesOptions(categoriesOptions);

        setAptitudes(aptitudesData);
        setAptitudesOptions(aptitudesOptions);
        setLoading(false);
      } catch (error) {
        const response = error?.response;
        if (response && response.status === 400) {
          const identityErrors = response.data;
          const errorDescriptions = identityErrors.map((error) => error.description);
          setError(errorDescriptions.join(" "));
        } else {
          setError("Eroare la comunicarea cu serverul");
        }
      }
    };

    populateModifyInternshipData();
  }, []);

  const getCitiesOptions = (cities) => {
    let citiesOptions = [];
    for (let i = 0; i < cities.length; i++) {
      citiesOptions.push({
        value: cities[i].name,
        label: cities[i].name,
      });
    }
    return citiesOptions;
  };

  const getCategoriesOptions = (categories) => {
    let categoriesOptions = [];
    for (let i = 0; i < categories.length; i++) {
      categoriesOptions.push({
        value: categories[i].name,
        label: categories[i].name,
      });
    }
    return categoriesOptions;
  };

  const getAptitudesOptions = (aptitudes) => {
    let aptitudesOptions = [];
    for (let i = 0; i < aptitudes.length; i++) {
      aptitudesOptions.push({
        value: aptitudes[i].name,
        label: aptitudes[i].name,
      });
    }
    return aptitudesOptions;
  };

  const getCity = (citiesData, id) => {
    for (let i = 0; i < citiesData.length; i++)
      if (citiesData[i].id === id) return citiesData[i];
  };

  const handleInternshipNameChange = (changeEvent) => {
    setInternshipName(changeEvent.target.value);
  };

  const handleInternshipStartDateChange = (changeEvent) => {
    setInternshipStartDate(changeEvent.target.value);
  };

  const handleInternshipEndDateChange = (changeEvent) => {
    setInternshipEndDate(changeEvent.target.value);
  };

  const handleInternshipDeadlineChange = (changeEvent) => {
    setInternshipDeadline(changeEvent.target.value);
  };

  const handleInternshipMaxNumberStudentsChange = (changeEvent) => {
    setInternshipMaxNumberStudents(changeEvent.target.value);
  };

  const handleInternshipPaidChange = (changeEvent) => {
    if (internshipPaid) setInternshipPaid(false);
    else setInternshipPaid(true);

    console.log(internshipPaid);
  };

  const handleInternshipDescriptionChange = (changeEvent) => {
    setInternshipDescription(changeEvent.target.value);
  };

  const handleInternshipCityChange = (changeEvent) => {
    setCitiesSelectedOption(changeEvent);
  };

  const handleInternshipCategoryChange = (changeEvent) => {
    let searchedCategory = categories.find((obj) => obj.name === changeEvent.value);
    console.log(searchedCategory);

    if (
      internshipCategoriesAux.find((obj) => obj.name === searchedCategory.name) ===
      undefined
    ) {
      let modifiedInternshipCategoriesAux = JSON.parse(
        JSON.stringify(internshipCategoriesAux)
      );
      modifiedInternshipCategoriesAux.push(searchedCategory);

      let idInternshipCategoriesToDeleteCopy = JSON.parse(
        JSON.stringify(
          idInternshipCategoriesToDeleteAux.filter((obj) => obj !== searchedCategory.id)
        )
      );

      let idInternshipCategoriesToInsertCopy = JSON.parse(
        JSON.stringify(idInternshipCategoriesToInsertAux)
      );
      idInternshipCategoriesToInsertCopy.push(searchedCategory.id);

      setCategoriesSelectedOption(changeEvent);
      setInternshipCategoriesAux(modifiedInternshipCategoriesAux);
      setIdInternshipCategoriesToInsertAux(idInternshipCategoriesToInsertCopy);
      setIdInternshipCategoriesToDeleteAux(idInternshipCategoriesToDeleteCopy);
      console.log("CHANGE");
      console.log(idInternshipCategoriesToInsertCopy);
    }
  };

  const handleInternshipCategoryDelete = async (idCategory) => {
    console.log("INSERT");
    console.log(idInternshipCategoriesToInsert.filter((obj) => obj !== idCategory));
    const idInternshipCategoriesToInsertCopy = JSON.parse(
      JSON.stringify(
        idInternshipCategoriesToInsertAux.filter((obj) => obj !== idCategory)
      )
    );

    const filteredInternshipCategoriesAux = JSON.parse(
      JSON.stringify(internshipCategoriesAux.filter((obj) => obj.id !== idCategory))
    );

    let idInternshipCategoriesToDeleteCopy = JSON.parse(
      JSON.stringify(idInternshipCategoriesToDeleteAux)
    );
    idInternshipCategoriesToDeleteCopy.push(idCategory);

    setInternshipCategoriesAux(filteredInternshipCategoriesAux);
    setIdInternshipCategoriesToDeleteAux(idInternshipCategoriesToDeleteCopy);
    setIdInternshipCategoriesToInsertAux(idInternshipCategoriesToInsertCopy);

    console.log(idInternshipCategoriesToDelete);
    console.log(idInternshipCategoriesToInsert);
    console.log(internshipCategories);
    console.log(internshipCategoriesAux);
  };

  const handleInternshipCategoryForm = (clickEvent) => {
    setCategoriesIsOpen(false);
    // setInternshipCategories(internshipCategoriesAux);
    setIdInternshipCategoriesToDelete(idInternshipCategoriesToDeleteAux);
    setIdInternshipCategoriesToInsert(idInternshipCategoriesToInsertAux);
    console.log(idInternshipCategoriesToInsertAux);
  };

  const handleInternshipAptitudeChange = (changeEvent) => {
    let searchedAptitude = aptitudes.find((obj) => obj.name === changeEvent.value);
    console.log(searchedAptitude);

    if (
      internshipAptitudesAux.find((obj) => obj.name === searchedAptitude.name) ===
      undefined
    ) {
      let modifiedInternshipAptitudesAux = JSON.parse(
        JSON.stringify(internshipAptitudesAux)
      );
      modifiedInternshipAptitudesAux.push(searchedAptitude);

      let idInternshipAptitudesToDeleteCopy = JSON.parse(
        JSON.stringify(
          idInternshipAptitudesToDeleteAux.filter((obj) => obj !== searchedAptitude.id)
        )
      );

      let idInternshipAptitudesToInsertCopy = JSON.parse(
        JSON.stringify(idInternshipAptitudesToInsertAux)
      );
      idInternshipAptitudesToInsertCopy.push(searchedAptitude.id);

      setAptitudesSelectedOption(changeEvent);
      setInternshipAptitudesAux(modifiedInternshipAptitudesAux);
      setIdInternshipAptitudesToInsertAux(idInternshipAptitudesToInsertCopy);
      setIdInternshipAptitudesToDeleteAux(idInternshipAptitudesToDeleteCopy);
    }
  };

  const handleInternshipAptitudeDelete = async (idAptitude) => {
    console.log("INSERT");
    console.log(idInternshipAptitudesToInsert.filter((obj) => obj !== idAptitude));
    const idInternshipAptitudesToInsertCopy = JSON.parse(
      JSON.stringify(idInternshipAptitudesToInsertAux.filter((obj) => obj !== idAptitude))
    );

    const filteredInternshipAptitudesAux = JSON.parse(
      JSON.stringify(internshipAptitudesAux.filter((obj) => obj.id !== idAptitude))
    );

    let idInternshipAptitudesToDeleteCopy = JSON.parse(
      JSON.stringify(idInternshipAptitudesToDeleteAux)
    );
    idInternshipAptitudesToDeleteCopy.push(idAptitude);

    setInternshipAptitudesAux(filteredInternshipAptitudesAux);
    setIdInternshipAptitudesToDeleteAux(idInternshipAptitudesToDeleteCopy);
    setIdInternshipAptitudesToInsertAux(idInternshipAptitudesToInsertCopy);

    console.log(idInternshipAptitudesToDelete);
    console.log(idInternshipAptitudesToInsert);
    console.log(internshipAptitudes);
    console.log(internshipAptitudesAux);
  };

  const handleInternshipAptitudeForm = (clickEvent) => {
    setAptitudesIsOpen(false);
    // setInternshipAptitudes(internshipAptitudesAux);
    setIdInternshipAptitudesToDelete(idInternshipAptitudesToDeleteAux);
    setIdInternshipAptitudesToInsert(idInternshipAptitudesToInsertAux);
  };

  const handleInternshipModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    console.log("HERE");
    let searchedCity = cities.find(
      (obj) => obj.name === internshipCitySelectedOption.value
    );

    console.log(searchedCity);
    let modifiedInternship = {
      id: internship.id,
      name: internshipName,
      startDate: internshipStartDate,
      endDate: internshipEndDate,
      deadline: internshipDeadline,
      maxNumberStudents: internshipMaxNumberStudents,
      paid: internshipPaid,
      description: internshipDescription,
      idCompany: internship.idCompany,
      idCity: searchedCity !== undefined ? searchedCity.id : null,
    };

    modifiedInternship.description = modifiedInternship.description.replaceAll(
      "\n",
      "<br/>"
    );
    console.log(modifiedInternship);

    try {
      let internshipResponse = await API.put(
        "/internships/" + internship.id,
        modifiedInternship
      );

      console.log(internshipResponse);

      console.log("FINAL");
      console.log(idInternshipCategoriesToDelete);
      console.log(idInternshipCategoriesToInsert);
      console.log(internshipCategories);
      console.log(internshipCategoriesAux);

      for (let i = 0; i < idInternshipCategoriesToDelete.length; i++) {
        if (
          internshipCategories.find(
            (obj) => obj.id === idInternshipCategoriesToDelete[i]
          ) !== undefined
        ) {
          let aux =
            "/internshipCategories/internship/" +
            internship.id +
            "/category/" +
            idInternshipCategoriesToDelete[i];
          await API.delete(aux);
        }
      }

      for (let i = 0; i < idInternshipCategoriesToInsert.length; i++) {
        if (
          internshipCategories.find(
            (obj) => obj.id === idInternshipCategoriesToInsert[i]
          ) === undefined
        ) {
          let internshipCategory = {
            idInternship: internship.id,
            idCategory: idInternshipCategoriesToInsert[i],
          };
          console.log("INSERT-internship-categ");
          console.log(internshipCategory);
          let aux = "/internshipCategories";
          await API.post(aux, internshipCategory);
        }
      }
      setInternshipCategories(internshipCategoriesAux);

      for (let i = 0; i < idInternshipAptitudesToDelete.length; i++) {
        if (
          internshipAptitudes.find(
            (obj) => obj.id === idInternshipAptitudesToDelete[i]
          ) !== undefined
        ) {
          let aux =
            "/internshipAptitudes/internship/" +
            internship.id +
            "/aptitude/" +
            idInternshipAptitudesToDelete[i];
          await API.delete(aux);
        }
      }

      for (let i = 0; i < idInternshipAptitudesToInsert.length; i++) {
        if (
          internshipAptitudes.find(
            (obj) => obj.id === idInternshipAptitudesToInsert[i]
          ) === undefined
        ) {
          console.log("DA");
          let internshipAptitude = {
            idInternship: internship.id,
            idAptitude: idInternshipAptitudesToInsert[i],
          };

          let aux = "/internshipAptitudes";
          await API.post(aux, internshipAptitude);
        }
      }
      setInternshipAptitudes(internshipAptitudesAux);
      history.push("/companyInternships");
    } catch (error) {
      const response = error?.response;
      if (response && response.status === 400) {
        const identityErrors = response.data;
        const errorDescriptions = identityErrors.map((error) => error.description);
        setError(errorDescriptions.join(" "));
      } else {
        setError("Eroare la comunicarea cu serverul");
      }
    }
  };

  const handleClose = () => {
    if (categoriesIsOpen) {
        setCategoriesIsOpen(false);
        setInternshipCategoriesAux(internshipCategories);
    }
    else if (aptitudesIsOpen) {
        setAptitudesIsOpen(false);
        setInternshipAptitudesAux(internshipAptitudes);
    }  
  }

  const handleShowCategories = () => {
    setCategoriesIsOpen(true);
  }

  const handleShowAptitudes = () => {
    setAptitudesIsOpen(true);
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <>
        <div className="col-md-4">
          <h3>Modificare stagiu </h3>
        </div>

        <Form onSubmit={handleInternshipModifyForm}>
          <Input
            type="text"
            name="name"
            label="Nume"
            value={internshipName}
            handleChange={handleInternshipNameChange}
            required={true}
          />

          <Input
            type="date"
            name="startDate"
            label="Dată începere"
            value={internshipStartDate}
            handleChange={handleInternshipStartDateChange}
            required={true}
          />

          <Input
            type="date"
            name="endDate"
            label="Dată sfârșit"
            value={internshipEndDate}
            handleChange={handleInternshipEndDateChange}
            required={true}
          />

          <Input
            type="date"
            name="deadline"
            label="Deadline înscrieri"
            value={internshipDeadline}
            handleChange={handleInternshipDeadlineChange}
            required={true}
          />

          <Input
            type="number"
            name="maxNumberStudents"
            label="Număr maxim de studenți"
            value={internshipMaxNumberStudents}
            handleChange={handleInternshipMaxNumberStudentsChange}
            required={true}
          />

          <FormControlLabel
            value={internshipPaid}
            control={<Checkbox color="primary" />}
            label="Plătit"
            labelPlacement="start"
            checked={internshipPaid === true}
            onChange={handleInternshipPaidChange}
            required={true}
          />

          <Form.Group className="col-md-4">
            <Form.Label>Descriere</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={internshipDescription}
              onChange={handleInternshipDescriptionChange}
              required={true}
            />
          </Form.Group>

          <p></p>

          <div className="col-md-4">
            <label>Oras:</label>
            <Select
              placeholder="Selectează oraș"
              value={internshipCitySelectedOption}
              options={citiesOptions}
              onChange={handleInternshipCityChange}
              isSearchable
              required
            />
          </div>

          <p></p>


          <div className="col-md-4">
          Categorii:
          <Button variant="primary" onClick={handleShowCategories}>
          {JSON.stringify(internshipCategories) !== JSON.stringify([])
                ? internshipCategories
                    .map((category) => category.name)
                    .join(", ")
                : "Nicio categorie"}
      </Button>
          </div>
          
          

      <Modal show={categoriesIsOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Categorii</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {internshipCategoriesAux !== []
              ? internshipCategoriesAux.map((category) => (
                  <>
                    <SelectElement
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      onDelete={handleInternshipCategoryDelete}
                    />
                  </>
                ))
              : ""}
            <br/>
            <Select
              placeholder="Selecteaza categorie"
              value={categoriesSelectedOption}
              options={categoriesOptions}
              onChange={handleInternshipCategoryChange}
            />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Închide
          </Button>
          <Button variant="primary" onClick={handleInternshipCategoryForm}>
            Salvează
          </Button>
        </Modal.Footer>
      </Modal>

          

          <div className="col-md-4">
          Aptitudini:
          <Button variant="primary" onClick={handleShowAptitudes}>
          {JSON.stringify(internshipAptitudes) !== JSON.stringify([])
                ? internshipAptitudes
                    .map((aptitude) => aptitude.name)
                    .join(", ")
                : "Nicio aptitudine"}
      </Button>
          </div>
          
          

      <Modal show={aptitudesIsOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aptitudini</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {internshipAptitudesAux !== []
              ? internshipAptitudesAux.map((aptitude) => (
                  <>
                    <SelectElement
                      key={aptitude.id}
                      id={aptitude.id}
                      name={aptitude.name}
                      onDelete={handleInternshipAptitudeDelete}
                    />
                  </>
                ))
              : ""}
                      <br/>

            <Select
              placeholder="Selecteaza aptitudine"
              value={aptitudesSelectedOption}
              options={aptitudesOptions}
              onChange={handleInternshipAptitudeChange}
            />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Închide
          </Button>
          <Button variant="primary" onClick={handleInternshipAptitudeForm}>
            Salvează
          </Button>
        </Modal.Footer>
      </Modal>

          <div className="col-md-4">
            <button className="btn btn-primary mt-2" type="submit">
              Salveaza
            </button>
          </div>

          <div className="text-danger m-3 justify-content-center">{error}</div>
        </Form>
      </>
    </div>
  );
};

export default ModifyInternship;