import React, { useState, useEffect } from "react";
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import SelectElement from "../Universal/SelectElement";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
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
import Paper from "@material-ui/core/Paper";
import axios from "axios";

const Select = (props) => (
  <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
);
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
  const [internshipCitySelectedOption, setInternshipCitySelectedOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesSelectedOption, setCategoriesSelectedOption] = useState("");
  const [internshipCategoriesAux, setInternshipCategoriesAux] = useState([]);

  const [aptitudes, setAptitudes] = useState([]);
  const [aptitudesOptions, setAptitudesOptions] = useState([]);
  const [aptitudesSelectedOption, setAptitudesSelectedOption] = useState("");
  const [internshipAptitudesAux, setInternshipAptitudesAux] = useState([]);

  const [
    internshipAptitudeIdsToDeleteAux,
    setInternshipAptitudeIdsToDeleteAux,
  ] = useState([]);
  const [
    internshipAptitudeIdsToInsertAux,
    setInternshipAptitudeIdsToInsertAux,
  ] = useState([]);

  const [
    internshipCategoryIdsToDeleteAux,
    setInternshipCategoryIdsToDeleteAux,
  ] = useState([]);
  const [
    internshipCategoryIdsToInsertAux,
    setInternshipCategoryIdsToInsertAux,
  ] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateModifyInternshipData = async () => {
      try {
        let internshipData = "";
        await fetch("api/internships/" + internshipId)
          .then((res) => res.json())
          .then((data) => {
            internshipData = data;
            setInternship(internshipData);
          });

        let internshipCategoriesResponse = await fetch(
          "api/categories/internship/" + internshipId
        );
        let internshipCategoriesData = "";
        if (internshipCategoriesResponse.ok) {
          internshipCategoriesData = await internshipCategoriesResponse.json();
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
            citiesOptions[i].value === getCity(citiesData, internshipData.cityId).name
          ) {
            setInternshipCitySelectedOption(citiesOptions[i]);
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
        setError(error.message);
        console.log(error);
      }
    };

    populateModifyInternshipData();
  }, [internshipId]);

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
    setInternshipStartDate(changeEvent);
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

    if (
      internshipCategoriesAux.find((obj) => obj.name === searchedCategory.name) ===
      undefined
    ) {
      let modifiedInternshipCategoriesAux = JSON.parse(
        JSON.stringify(internshipCategoriesAux)
      );
      modifiedInternshipCategoriesAux.push(searchedCategory);

      let internshipCategoryIdsToDeleteCopy = JSON.parse(
        JSON.stringify(
          internshipCategoryIdsToDeleteAux.filter((obj) => obj !== searchedCategory.id)
        )
      );

      let internshipCategoryIdsToInsertCopy = JSON.parse(
        JSON.stringify(internshipCategoryIdsToInsertAux)
      );
      internshipCategoryIdsToInsertCopy.push(searchedCategory.id);

      setCategoriesSelectedOption(changeEvent);
      setInternshipCategoriesAux(modifiedInternshipCategoriesAux);
      setInternshipCategoryIdsToInsertAux(internshipCategoryIdsToInsertCopy);
      setInternshipCategoryIdsToDeleteAux(internshipCategoryIdsToDeleteCopy);
    }
  };

  const handleInternshipCategoryDelete = async (aptitudeId) => {
    const internshipCategoryIdsToInsertCopy = JSON.parse(
      JSON.stringify(internshipCategoryIdsToInsertAux.filter((obj) => obj !== aptitudeId))
    );

    const filteredInternshipCategoriesAux = JSON.parse(
      JSON.stringify(internshipCategoriesAux.filter((obj) => obj.id !== aptitudeId))
    );

    let internshipCategoryIdsToDeleteCopy = JSON.parse(
      JSON.stringify(internshipCategoryIdsToDeleteAux)
    );
    internshipCategoryIdsToDeleteCopy.push(aptitudeId);

    setInternshipCategoriesAux(filteredInternshipCategoriesAux);
    setInternshipCategoryIdsToDeleteAux(internshipCategoryIdsToDeleteCopy);
    setInternshipCategoryIdsToInsertAux(internshipCategoryIdsToInsertCopy);
  };

  const handleInternshipAptitudeChange = (changeEvent) => {
    let searchedAptitude = aptitudes.find((obj) => obj.name === changeEvent.value);

    if (
      internshipAptitudesAux.find((obj) => obj.name === searchedAptitude.name) ===
      undefined
    ) {
      let modifiedInternshipAptitudesAux = JSON.parse(
        JSON.stringify(internshipAptitudesAux)
      );
      modifiedInternshipAptitudesAux.push(searchedAptitude);

      let internshipAptitudeIdsToDeleteCopy = JSON.parse(
        JSON.stringify(
          internshipAptitudeIdsToDeleteAux.filter((obj) => obj !== searchedAptitude.id)
        )
      );

      let internshipAptitudeIdsToInsertCopy = JSON.parse(
        JSON.stringify(internshipAptitudeIdsToInsertAux)
      );
      internshipAptitudeIdsToInsertCopy.push(searchedAptitude.id);

      setAptitudesSelectedOption(changeEvent);
      setInternshipAptitudesAux(modifiedInternshipAptitudesAux);
      setInternshipAptitudeIdsToInsertAux(internshipAptitudeIdsToInsertCopy);
      setInternshipAptitudeIdsToDeleteAux(internshipAptitudeIdsToDeleteCopy);
    }
  };

  const handleInternshipAptitudeDelete = async (aptitudeId) => {
    const internshipAptitudeIdsToInsertCopy = JSON.parse(
      JSON.stringify(internshipAptitudeIdsToInsertAux.filter((obj) => obj !== aptitudeId))
    );

    const filteredInternshipAptitudesAux = JSON.parse(
      JSON.stringify(internshipAptitudesAux.filter((obj) => obj.id !== aptitudeId))
    );

    let internshipAptitudeIdsToDeleteCopy = JSON.parse(
      JSON.stringify(internshipAptitudeIdsToDeleteAux)
    );
    internshipAptitudeIdsToDeleteCopy.push(aptitudeId);

    setInternshipAptitudesAux(filteredInternshipAptitudesAux);
    setInternshipAptitudeIdsToDeleteAux(internshipAptitudeIdsToDeleteCopy);
    setInternshipAptitudeIdsToInsertAux(internshipAptitudeIdsToInsertCopy);
  };

  const handleInternshipModifyForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let searchedCity = cities.find(
      (obj) => obj.name === internshipCitySelectedOption.value
    );

    let modifiedInternship = {
      id: internship.id,
      name: internshipName,
      startDate: internshipStartDate,
      endDate: internshipEndDate,
      deadline: internshipDeadline,
      maxNumberStudents: internshipMaxNumberStudents,
      paid: internshipPaid,
      description: internshipDescription,
      companyId: internship.companyId,
      cityId: searchedCity !== undefined ? searchedCity.id : null,
    };

    console.log(modifiedInternship);

    modifiedInternship.description = modifiedInternship.description.replaceAll(
      "\n",
      "<br/>"
    );

    // try {
    await fetch("api/internships/" + internship.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedInternship),
    }).then((res) => {
      console.log(res);
    });

    let axiosArray = [];

    for (let i = 0; i < internshipCategoryIdsToDeleteAux.length; i++) {
      if (
        internshipCategories.find(
          (obj) => obj.id === internshipCategoryIdsToDeleteAux[i]
        ) !== undefined
      ) {
        let url =
          "api/internshipCategories/internship/" +
          internship.id +
          "/category/" +
          internshipCategoryIdsToDeleteAux[i];

        let newPromise = axios({
          method: "delete",
          url: url,
        });
        axiosArray.push(newPromise);

        // await fetch(aux, {
        //   method: "DELETE",
        // });
      }
    }

    for (let i = 0; i < internshipCategoryIdsToInsertAux.length; i++) {
      if (
        internshipCategories.find(
          (obj) => obj.id === internshipCategoryIdsToInsertAux[i]
        ) === undefined
      ) {
        let internshipCategory = {
          internshipId: internship.id,
          categoryId: internshipCategoryIdsToInsertAux[i],
        };

        let newPromise = axios({
          method: "post",
          url: "api/internshipCategories",
          data: internshipCategory,
        });
        axiosArray.push(newPromise);

        // let aux = "api/internshipCategories";
        // await fetch(aux, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(internshipCategory),
        // });
      }
    }
    setInternshipCategories(internshipCategoriesAux);

    for (let i = 0; i < internshipAptitudeIdsToDeleteAux.length; i++) {
      if (
        internshipAptitudes.find(
          (obj) => obj.id === internshipAptitudeIdsToDeleteAux[i]
        ) !== undefined
      ) {
        let url =
          "api/internshipAptitudes/internship/" +
          internship.id +
          "/aptitude/" +
          internshipAptitudeIdsToDeleteAux[i];

        let newPromise = axios({
          method: "delete",
          url: url,
        });
        axiosArray.push(newPromise);

        // await fetch(aux, {
        //   method: "DELETE",
        // });
      }
    }

    for (let i = 0; i < internshipAptitudeIdsToInsertAux.length; i++) {
      if (
        internshipAptitudes.find(
          (obj) => obj.id === internshipAptitudeIdsToInsertAux[i]
        ) === undefined
      ) {
        let internshipAptitude = {
          internshipId: internship.id,
          aptitudeId: internshipAptitudeIdsToInsertAux[i],
        };

        let url = "api/internshipAptitudes";

        let newPromise = axios({
          method: "post",
          url: url,
          data: internshipAptitude,
        });
        axiosArray.push(newPromise);

        // await fetch(aux, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(internshipAptitude),
        // });
      }
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

    setInternshipAptitudes(internshipAptitudesAux);
    history.push("/companyInternships");
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Paper className="m-3 p-3" elevation={3} style={{ width: 900 }}>
        <div className="text-center">
          <h3>Modifică stagiu </h3>
        </div>

        <Link to="/MyEditor">Mergi la editor</Link>

        <Form onSubmit={handleInternshipModifyForm}>
          <TextField
            id="standard-full-width"
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
            id="standard-full-width"
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

          <FormControlLabel
            value={internshipPaid}
            control={<Checkbox color="primary" />}
            label="Plătit"
            labelPlacement="start"
            checked={internshipPaid === true}
            onChange={handleInternshipPaidChange}
            required={true}
          />

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
                id="date-picker-inline"
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
                id="date-picker-inline2"
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
                id="date-picker-inline3"
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
              required
            />
          </div>

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

          <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleInternshipModifyForm}
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

export default ModifyInternship;
