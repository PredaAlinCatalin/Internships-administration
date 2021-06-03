import React, { useState, useEffect } from "react";
// import Modal from "../Modal";
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import SelectElement from "../Universal/SelectElement";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Form, Modal } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import "../Universal/Div3D.scss";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
// import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import "./CreateInternship.css";
import SaveIcon from "@material-ui/icons/Save";
import {
  getCitiesOptions,
  getCategoriesOptions,
  getAptitudesOptions,
} from "../Utility/Utility";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { getFormattedDateNoTime } from "../Utility/Utility";
import {
  fetchInternships,
  selectAllInternships,
  addInternship,
} from "../internship/internshipsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const Select = (props) => (
  <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
);

const CreateInternship = () => {
  const history = useHistory();
  const [internshipMaxNumberStudents, setInternshipMaxNumberStudents] = useState(0);
  const [internshipName, setInternshipName] = useState("");
  const [internshipDescription, setInternshipDescription] = useState("");
  const [internshipPaid, setInternshipPaid] = useState(false);
  const [internshipSalary, setInternshipSalary] = useState(0);
  const [internshipStartDate, setInternshipStartDate] = useState(new Date("2021-04-01"));
  const [internshipEndDate, setInternshipEndDate] = useState(new Date("2021-05-01"));
  const [internshipDeadline, setInternshipDeadline] = useState(new Date("2021-03-01"));
  const [internshipCategories, setInternshipCategories] = useState([]);
  const [internshipAptitudes, setInternshipAptitudes] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [internshipCitySelectedOption, setInternshipCitySelectedOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesSelectedOption, setCategoriesSelectedOption] = useState("");
  const [internshipCategoriesAux, setInternshipCategoriesAux] = useState([]);

  const [categoriesIsOpen, setCategoriesIsOpen] = useState(false);
  const [aptitudes, setAptitudes] = useState([]);
  const [aptitudesOptions, setAptitudesOptions] = useState([]);
  const [aptitudesSelectedOption, setAptitudesSelectedOption] = useState("");
  const [internshipAptitudesAux, setInternshipAptitudesAux] = useState([]);

  const [aptitudesIsOpen, setAptitudesIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.internships.status);
  const errorInternships = useSelector((state) => state.internships.error);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  useEffect(() => {
    async function populateCreateInternshipData() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      setUserId(user.id);

      let citiesResponse = await fetch("api/cities");
      let citiesData = "";
      let citiesOptionsData = "";
      if (citiesResponse.ok) {
        citiesData = await citiesResponse.json();
        citiesOptionsData = getCitiesOptions(citiesData);
      }

      let categoriesResponse = await fetch("api/categories");
      let categoriesData = "";
      let categoriesOptionsData = "";
      if (categoriesResponse.ok) {
        categoriesData = await categoriesResponse.json();
        categoriesOptionsData = getCategoriesOptions(categoriesData);
      }

      let aptitudesResponse = await fetch("api/aptitudes");
      let aptitudesData = "";
      let aptitudesOptionsData = "";
      if (aptitudesResponse.ok) {
        aptitudesData = await aptitudesResponse.json();
        aptitudesOptionsData = getAptitudesOptions(aptitudesData);
      }

      setCities(citiesData);
      setCitiesOptions(citiesOptionsData);
      setCategories(categoriesData);
      setCategoriesOptions(categoriesOptionsData);
      setAptitudes(aptitudesData);
      setAptitudesOptions(aptitudesOptionsData);
      setLoading(false);
    }
    populateCreateInternshipData();
  }, []);

  const handleInternshipNameChange = (changeEvent) => {
    setInternshipName(changeEvent.target.value);
  };

  const handleInternshipStartDateChange = (changeEvent) => {
    setInternshipStartDate(changeEvent);
    console.log(changeEvent);
  };

  const handleInternshipEndDateChange = (changeEvent) => {
    setInternshipEndDate(changeEvent);
  };

  const handleInternshipDeadlineChange = (changeEvent) => {
    setInternshipDeadline(changeEvent);
  };

  const handleInternshipMaxNumberStudentsChange = (changeEvent) => {
    setInternshipMaxNumberStudents(changeEvent.target.value);
  };

  const handleInternshipPaidChange = (changeEvent) => {
    if (internshipPaid) setInternshipPaid(false);
    else setInternshipPaid(true);
  };

  const handleInternshipDescriptionChange = (changeEvent) => {
    setInternshipDescription(changeEvent.target.value);
  };

  const handleInternshipCityChange = (changeEvent) => {
    setInternshipCitySelectedOption(changeEvent);
  };

  const handleInternshipCategoryChange = (changeEvent) => {
    let searchedCategory = categories.find((obj) => obj.name === changeEvent.value);
    console.log("Category" + searchedCategory);

    if (
      internshipCategoriesAux.find((obj) => obj.name === searchedCategory.name) ===
      undefined
    ) {
      let modifiedInternshipCategoriesAux = JSON.parse(
        JSON.stringify(internshipCategoriesAux)
      );
      modifiedInternshipCategoriesAux.push(searchedCategory);

      setCategoriesSelectedOption(changeEvent);
      setInternshipCategoriesAux(modifiedInternshipCategoriesAux);
    }
  };

  const handleInternshipCategoryDelete = async (categoryId) => {
    let filteredInternshipCategoriesAux = JSON.parse(
      JSON.stringify(internshipCategoriesAux.filter((obj) => obj.id !== categoryId))
    );

    setInternshipCategoriesAux(filteredInternshipCategoriesAux);
  };

  const handleInternshipCategoryForm = (clickEvent) => {
    console.log(internshipCategories);
    console.log(internshipCategoriesAux);

    setInternshipCategories(internshipCategoriesAux);
    setCategoriesIsOpen(false);
  };

  //---------------------------
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

      setAptitudesSelectedOption(changeEvent);
      setInternshipAptitudesAux(modifiedInternshipAptitudesAux);
      console.log(modifiedInternshipAptitudesAux);
    }
  };

  const handleInternshipAptitudeDelete = async (aptitudeId) => {
    let filteredInternshipAptitudesAux = JSON.parse(
      JSON.stringify(internshipAptitudesAux.filter((obj) => obj.id !== aptitudeId))
    );

    setInternshipAptitudesAux(filteredInternshipAptitudesAux);
  };

  const handleInternshipAptitudeForm = (clickEvent) => {
    setInternshipAptitudes(internshipAptitudesAux);
    setAptitudesIsOpen(false);
  };

  const handleInternshipCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let searchedCity = cities.find(
      (obj) => obj.name === internshipCitySelectedOption.value
    );
    let descriptionCopy = internshipDescription;
    descriptionCopy = descriptionCopy.replaceAll("\n", "<br/>");
    let currentDate = new Date();

    for (let j = 0; j < count; j++) {
      try {
        let newInternship = {
          name: internshipName + j,
          startDate: internshipStartDate,
          endDate: internshipEndDate,
          deadline: internshipDeadline,
          creationDate: currentDate,
          status: "pending",
          maxNumberStudents: internshipMaxNumberStudents,
          paid: internshipPaid,
          salary: internshipSalary,
          description: descriptionCopy,
          companyId: userId,
          cityId: searchedCity !== undefined ? searchedCity.id : null,
        };
        let internshipData = "";

        try {
          setAddRequestStatus("pending");
          const resultAction = await dispatch(addInternship(newInternship));
          unwrapResult(resultAction);
          console.log(resultAction);
          internshipData = resultAction.payload;
        } catch (error) {
          console.log(error);
        } finally {
          setAddRequestStatus("idle");
        }

        if (internshipData !== "") {
          let axiosArray = [];
          for (let i = 0; i < internshipCategoriesAux.length; i++) {
            let internshipCategory = {
              internshipId: internshipData.id,
              categoryId: internshipCategoriesAux[i].id,
            };

            let newPromise = axios({
              method: "post",
              url: "api/internshipCategories",
              data: internshipCategory,
            });
            axiosArray.push(newPromise);
          }

          for (let i = 0; i < internshipAptitudesAux.length; i++) {
            let internshipAptitude = {
              internshipId: internshipData.id,
              aptitudeId: internshipAptitudesAux[i].id,
            };

            let newPromise = axios({
              method: "post",
              url: "api/internshipAptitudes",
              data: internshipAptitude,
            });
            axiosArray.push(newPromise);
          }
          axios
            .all(axiosArray)
            .then(
              axios.spread((...responses) => {
                responses.forEach((res) => console.log("Success"));
                console.log("submitted all axios calls");
              })
            )
            .catch((error) => console.log(error));
        }
        history.push("/companyInternships/all");
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    if (categoriesIsOpen) {
      setCategoriesIsOpen(false);
      setInternshipCategoriesAux(internshipCategories);
    } else if (aptitudesIsOpen) {
      setAptitudesIsOpen(false);
      setInternshipAptitudesAux(internshipAptitudes);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Paper className="m-3 p-3" elevation={3} style={{ width: 900 }}>
        <div className="text-center">
          <h3>Creare stagiu </h3>
        </div>

        <Link to="/MyEditor">Mergi la editor</Link>

        <Form onSubmit={handleInternshipCreateForm}>
          <TextField
            label="Nume"
            style={{ margin: 15 }}
            placeholder="Nume"
            fullWidth
            margin="normal"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            value={internshipName}
            onChange={handleInternshipNameChange}
            required={true}
          />

          <TextField
            type="number"
            label="Număr maxim studenți"
            style={{ margin: 15 }}
            placeholder="Număr maxim studenți"
            fullWidth
            margin="normal"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            value={internshipMaxNumberStudents}
            onChange={handleInternshipMaxNumberStudentsChange}
            required={true}
          />

          <TextField
            type="number"
            label="De cate ori sa fie creat"
            style={{ margin: 15 }}
            placeholder="De cate ori sa fie creat"
            fullWidth
            margin="normal"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            value={count}
            onChange={(event) => setCount(event.target.value)}
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

          {internshipPaid ? (
            <TextField
              type="number"
              label="Salariu"
              style={{ margin: 15 }}
              placeholder="Salariu"
              fullWidth
              margin="normal"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              value={internshipSalary}
              onChange={(event) => setInternshipSalary(event.target.value)}
              required={true}
            />
          ) : (
            ""
          )}

          <div className="col-md-4">
            Oraș:
            <Select
              placeholder="Selectează oraș"
              value={internshipCitySelectedOption}
              options={citiesOptions}
              onChange={handleInternshipCityChange}
              isSearchable
              required
            />
          </div>
          <br />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                style={{ margin: 15 }}
                label="Dată începere"
                value={internshipStartDate}
                onChange={handleInternshipStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />

              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                style={{ margin: 15 }}
                label="Dată sfârșit"
                value={internshipEndDate}
                onChange={handleInternshipEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />

              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                style={{ margin: 15 }}
                label="Deadline aplicări"
                value={internshipDeadline}
                onChange={handleInternshipDeadlineChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>

          <Form.Group className="col-md-12">
            <Form.Label>Descriere</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={internshipDescription}
              onChange={handleInternshipDescriptionChange}
              required={true}
            />
          </Form.Group>

          <p></p>

          <p></p>
          <div className="col-md-12">
            Categorii:{" "}
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
          </div>

          <p></p>
          <div className="col-md-4">
            <Select
              placeholder="Selecteaza categorie"
              value={categoriesSelectedOption}
              options={categoriesOptions}
              onChange={handleInternshipCategoryChange}
              required={true}
            />
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
              <br />
              <Select
                placeholder="Selecteaza categorie"
                value={categoriesSelectedOption}
                options={categoriesOptions}
                onChange={handleInternshipCategoryChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary mt-2" onClick={handleClose}>
                Închide
              </button>
              <button
                className="btn btn-primary mt-2"
                onClick={handleInternshipCategoryForm}
              >
                Salvează
              </button>
            </Modal.Footer>
          </Modal>
          <br />
          <div className="col-md-12">
            Aptitudini:{" "}
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
            <p></p>
          </div>
          <div className="col-md-4">
            <Select
              placeholder="Selecteaza aptitudine"
              value={aptitudesSelectedOption}
              options={aptitudesOptions}
              onChange={handleInternshipAptitudeChange}
              required
            />
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
              <br />

              <Select
                placeholder="Selecteaza aptitudine"
                value={aptitudesSelectedOption}
                options={aptitudesOptions}
                onChange={handleInternshipAptitudeChange}
                required
              />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary mt-2" onClick={handleClose}>
                Închide
              </button>
              <button
                className="btn btn-primary mt-2"
                onClick={handleInternshipAptitudeForm}
              >
                Salvează
              </button>
            </Modal.Footer>
          </Modal>

          <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleInternshipCreateForm}
            >
              {" "}
              Salvează
            </Button>
          </div>

          <div className="text-danger m-3 justify-content-center">{error}</div>
        </Form>
      </Paper>
      <br />
    </div>
  );
};

export default withRouter(CreateInternship);
