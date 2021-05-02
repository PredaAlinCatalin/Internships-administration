import React, { useState, useEffect } from "react";
// import Modal from "../Modal";
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import SelectElement from "../Universal/SelectElement";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "../Universal/Input";
import { Form, Row, Modal } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import MyEditor from "../Universal/MyEditor";
import "../Universal/Div3D.scss";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
// import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { FormGroup } from "@material-ui/core";
import "./CreateInternship.css";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

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
        setError(error.message);
        console.log(error);
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
    setCitiesSelectedOption(changeEvent);
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
    }
  };

  const handleInternshipCategoryDelete = async (idCategory) => {
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
  };

  const handleInternshipCategoryForm = (clickEvent) => {
    setCategoriesIsOpen(false);
    // setInternshipCategories(internshipCategoriesAux);
    setIdInternshipCategoriesToDelete(idInternshipCategoriesToDeleteAux);
    setIdInternshipCategoriesToInsert(idInternshipCategoriesToInsertAux);
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
  };

  const handleInternshipAptitudeForm = (clickEvent) => {
    setAptitudesIsOpen(false);
    // setInternshipAptitudes(internshipAptitudesAux);
    setIdInternshipAptitudesToDelete(idInternshipAptitudesToDeleteAux);
    setIdInternshipAptitudesToInsert(idInternshipAptitudesToInsertAux);
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
      idCompany: internship.idCompany,
      idCity: searchedCity !== undefined ? searchedCity.id : null,
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

    for (let i = 0; i < idInternshipCategoriesToDelete.length; i++) {
      if (
        internshipCategories.find(
          (obj) => obj.id === idInternshipCategoriesToDelete[i]
        ) !== undefined
      ) {
        let aux =
          "api/internshipCategories/internship/" +
          internship.id +
          "/category/" +
          idInternshipCategoriesToDelete[i];

        await fetch(aux, {
          method: "DELETE",
        });
      }
    }

    for (let i = 0; i < idInternshipCategoriesToInsertAux.length; i++) {
      if (
        internshipCategories.find(
          (obj) => obj.id === idInternshipCategoriesToInsertAux[i]
        ) === undefined
      ) {
        let internshipCategory = {
          idInternship: internship.id,
          idCategory: idInternshipCategoriesToInsertAux[i],
        };

        let aux = "api/internshipCategories";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(internshipCategory),
        });
      }
    }
    setInternshipCategories(internshipCategoriesAux);

    for (let i = 0; i < idInternshipAptitudesToDeleteAux.length; i++) {
      if (
        internshipAptitudes.find(
          (obj) => obj.id === idInternshipAptitudesToDeleteAux[i]
        ) !== undefined
      ) {
        let aux =
          "api/internshipAptitudes/internship/" +
          internship.id +
          "/aptitude/" +
          idInternshipAptitudesToDeleteAux[i];
        await fetch(aux, {
          method: "DELETE",
        });
      }
    }

    for (let i = 0; i < idInternshipAptitudesToInsertAux.length; i++) {
      if (
        internshipAptitudes.find(
          (obj) => obj.id === idInternshipAptitudesToInsertAux[i]
        ) === undefined
      ) {
        let internshipAptitude = {
          idInternship: internship.id,
          idAptitude: idInternshipAptitudesToInsertAux[i],
        };

        let aux = "api/internshipAptitudes";
        await fetch(aux, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(internshipAptitude),
        });
      }
    }
    setInternshipAptitudes(internshipAptitudesAux);
    history.push("/companyInternships");
    // } catch (error) {
    //   const response = error?.response;
    //   if (response && response.status === 400) {
    //     const identityErrors = response.data;
    //     const errorDescriptions = identityErrors.map((error) => error.description);
    //     setError(errorDescriptions.join(" "));
    //   } else {
    //     setError("Eroare la comunicarea cu serverul");
    //   }
    // }
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

  const handleShowCategories = () => {
    setCategoriesIsOpen(true);
  };

  const handleShowAptitudes = () => {
    setAptitudesIsOpen(true);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="box">
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
              id="date-picker-inline"
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
              id="date-picker-inline"
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
    </div>
  );
};

export default ModifyInternship;
