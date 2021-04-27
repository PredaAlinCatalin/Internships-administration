import React, { Component } from "react";
// import Modal from "../Modal";
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import SelectElement from "../Universal/SelectElement";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "../Universal/Input";
import { Form, Row, Modal, Button } from "react-bootstrap";
import API from "../../api";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import MyEditor from "../Universal/MyEditor";
import Div3D from '../Universal/Div3D';
const Select = (props) => (
  <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
);

class CreateInternship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internshipId: 0,
      internshipMaxNumberStudents: 0,
      internshipName: "",
      internshipDescription: "",
      internshipPaid: false,
      internshipStartDate: "2021-07-01",
      internshipEndDate: "2021-10-01",
      internshipDeadline: "2021-01-01",
      internshipCity: "",
      internshipCategories: [],
      internshipAptitudes: [],
      cities: [],
      citiesOptions: [],
      citiesSelectedOption: "",
      categories: [],
      categoriesOptions: [],
      categoriesSelectedOption: [],
      internshipCategoriesAux: [],
      categoriesIsOpen: false,
      aptitudes: [],
      aptitudesOptions: [],
      aptitudesSelectedOption: [],
      internshipAptitudesAux: [],
      aptitudesIsOpen: false,
      error: "",
      userId: "",
      loading: true,
    };
    this.renderCreateInternshipData = this.renderCreateInternshipData.bind(this);
  }

  componentDidMount() {
    this.populateCreateInternshipData();
  }

  async populateCreateInternshipData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ userId: user.id });

    let citiesResponse = await fetch("api/cities");
    let citiesData = "";
    let citiesOptions = "";
    if (citiesResponse.ok) {
      citiesData = await citiesResponse.json();
      citiesOptions = this.getCitiesOptions(citiesData);
    }

    let categoriesResponse = await fetch("api/categories");
    let categoriesData = "";
    let categoriesOptions = "";
    if (categoriesResponse.ok) {
      categoriesData = await categoriesResponse.json();
      categoriesOptions = this.getCategoriesOptions(categoriesData);
    }

    let aptitudesResponse = await fetch("api/aptitudes");
    let aptitudesData = "";
    let aptitudesOptions = "";
    if (aptitudesResponse.ok) {
      aptitudesData = await aptitudesResponse.json();
      aptitudesOptions = this.getAptitudesOptions(aptitudesData);
    }

    this.setState({
      cities: citiesData,
      citiesOptions: citiesOptions,
      categories: categoriesData,
      categoriesOptions: categoriesOptions,
      aptitudes: aptitudesData,
      aptitudesOptions: aptitudesOptions,
      loading: false,
    });
  }

  getCitiesOptions = (cities) => {
    let citiesOptions = [];
    for (let i = 0; i < cities.length; i++) {
      citiesOptions.push({
        value: cities[i].name,
        label: cities[i].name,
      });
    }
    return citiesOptions;
  };

  getCategoriesOptions = (categories) => {
    let categoriesOptions = [];
    for (let i = 0; i < categories.length; i++) {
      categoriesOptions.push({
        value: categories[i].name,
        label: categories[i].name,
      });
    }
    return categoriesOptions;
  };

  getAptitudesOptions = (aptitudes) => {
    let aptitudesOptions = [];
    for (let i = 0; i < aptitudes.length; i++) {
      aptitudesOptions.push({
        value: aptitudes[i].name,
        label: aptitudes[i].name,
      });
    }
    return aptitudesOptions;
  };

  handleInternshipNameChange = (changeEvent) => {
    this.setState({
      internshipName: changeEvent.target.value,
    });
  };

  handleInternshipStartDateChange = (changeEvent) => {
    this.setState({
      internshipStartDate: changeEvent.target.value,
    });
  };

  handleInternshipEndDateChange = (changeEvent) => {
    this.setState({
      internshipEndDate: changeEvent.target.value,
    });
  };

  handleInternshipDeadlineChange = (changeEvent) => {
    this.setState({
      internshipDeadline: changeEvent.target.value,
    });
  };

  handleInternshipMaxNumberStudentsChange = (changeEvent) => {
    this.setState({
      internshipMaxNumberStudents: changeEvent.target.value,
    });
  };

  handleInternshipPaidChange = (changeEvent) => {
    if (this.state.internshipPaid)
      this.setState({
        internshipPaid: false,
      });
    else
      this.setState({
        internshipPaid: true,
      });
  };

  handleInternshipDescriptionChange = (changeEvent) => {
    this.setState({
      internshipDescription: changeEvent.target.value,
    });
  };

  handleInternshipNameChange = (changeEvent) => {
    this.setState({
      internshipName: changeEvent.target.value,
    });
  };

  handleInternshipCityChange = (changeEvent) => {
    this.setState({
      citiesSelectedOption: changeEvent,
    });
  };

  handleInternshipCategoryChange = (changeEvent) => {
    let searchedCategory = this.state.categories.find(
      (obj) => obj.name === changeEvent.value
    );
    console.log("Category" + searchedCategory);

    if (
      this.state.internshipCategoriesAux.find(
        (obj) => obj.name === searchedCategory.name
      ) === undefined
    ) {
      let modifiedInternshipCategoriesAux = JSON.parse(
        JSON.stringify(this.state.internshipCategoriesAux)
      );
      modifiedInternshipCategoriesAux.push(searchedCategory);

      this.setState({
        categoriesSelectedOption: changeEvent,
        internshipCategoriesAux: modifiedInternshipCategoriesAux,
      });
    }
  };

  handleInternshipCategoryDelete = async (idCategory) => {
    let filteredInternshipCategoriesAux = JSON.parse(
      JSON.stringify(
        this.state.internshipCategoriesAux.filter((obj) => obj.id !== idCategory)
      )
    );

    this.setState({
      internshipCategoriesAux: filteredInternshipCategoriesAux,
    });
  };

  handleInternshipCategoryForm = (clickEvent) => {
    console.log(this.state.internshipCategories);
    console.log(this.state.internshipCategoriesAux);

    this.setState({
      internshipCategories: this.state.internshipCategoriesAux,
      categoriesIsOpen: false,
    });
  };

  //---------------------------
  handleInternshipAptitudeChange = (changeEvent) => {
    let searchedAptitude = this.state.aptitudes.find(
      (obj) => obj.name === changeEvent.value
    );
    console.log("Aptitude" + searchedAptitude);

    if (
      this.state.internshipAptitudesAux.find(
        (obj) => obj.name === searchedAptitude.name
      ) === undefined
    ) {
      let modifiedInternshipAptitudesAux = JSON.parse(
        JSON.stringify(this.state.internshipAptitudesAux)
      );
      modifiedInternshipAptitudesAux.push(searchedAptitude);

      this.setState({
        aptitudesSelectedOption: changeEvent,
        internshipAptitudesAux: modifiedInternshipAptitudesAux,
      });
    }
  };

  handleInternshipAptitudeDelete = async (idAptitude) => {
    let filteredInternshipAptitudesAux = JSON.parse(
      JSON.stringify(
        this.state.internshipAptitudesAux.filter((obj) => obj.id !== idAptitude)
      )
    );

    this.setState({
      internshipAptitudesAux: filteredInternshipAptitudesAux,
    });
  };

  handleInternshipAptitudeForm = (clickEvent) => {
    this.setState({
      internshipAptitudes: this.state.internshipAptitudesAux,
      aptitudesIsOpen: false,
    });
  };

  handleInternshipCreateForm = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    let searchedCity = this.state.cities.find(
      (obj) => obj.name === this.state.citiesSelectedOption.value
    );
    let descriptionCopy = this.state.internshipDescription;
    descriptionCopy = descriptionCopy.replaceAll("\n", "<br/>");
    let newInternship = {
      name: this.state.internshipName,
      startDate: this.state.internshipStartDate,
      endDate: this.state.internshipEndDate,
      deadline: this.state.internshipDeadline,
      maxNumberStudents: this.state.internshipMaxNumberStudents,
      paid: this.state.internshipPaid,
      description: descriptionCopy,
      idCompany: this.state.userId,
      idCity: searchedCity !== undefined ? searchedCity.id : null,
    };

    try {
      let internshipData = "";
      let internshipResponse = await API.post("/internships", newInternship);

      console.log(internshipResponse);
      if (internshipResponse.status === 201) {
        internshipData = internshipResponse.data;
        for (let i = 0; i < this.state.internshipCategoriesAux.length; i++) {
          let internshipCategory = {
            idInternship: internshipData.id,
            idCategory: this.state.internshipCategoriesAux[i].id,
          };

          let aux = "/internshipCategories";
          console.log(internshipCategory);
          await API.post(aux, internshipCategory);
        }

        for (let i = 0; i < this.state.internshipAptitudesAux.length; i++) {
          let internshipAptitude = {
            idInternship: internshipData.id,
            idAptitude: this.state.internshipAptitudesAux[i].id,
          };

          let aux = "/internshipAptitudes";
          await API.post(aux, internshipAptitude);
        }
      }

      this.props.history.push("/companyInternships");
    } catch (error) {
      const response = error?.response;
      if (response && response.status === 400) {
        const identityErrors = response.data;
        const errorDescriptions = identityErrors.map((error) => error.description);
        this.setState({
          error: errorDescriptions.join(" "),
        });
      } else {
        this.setState({
          error: "Eroare la comunicarea cu serverul",
        });
        console.log(error);
      }
    }
  };

  handleClose = () => {
    if (this.state.categoriesIsOpen) {
      this.setState({
        categoriesIsOpen: false,
        internshipCategoriesAux: this.state.internshipCategories,
      })
    }
    else if (this.state.aptitudesIsOpen) {
      this.setState({
        aptitudesIsOpen: false,
        internshipAptitudesAux: this.state.internshipAptitudes,
      })
    }  
  }

  handleShowCategories = () => {
    this.setState({categoriesIsOpen: true});
  }

  handleShowAptitudes = () => {
    this.setState({aptitudesIsOpen: true});
  }
  renderCreateInternshipData() {
    return (
      <div className="box">
        <div className="col-md-4">
          <h3>Creare stagiu </h3>
        </div>

        <Link to="/MyEditor">
          Mergi la editor
        </Link>
        
        <Form onSubmit={this.handleInternshipCreateForm}>
          <Input
            type="text"
            name="name"
            label="Nume"
            value={this.state.internshipName}
            handleChange={this.handleInternshipNameChange}
            required={true}
          />

          <Input
            type="date"
            name="startDate"
            label="Dată începere"
            value={this.state.internshipStartDate}
            handleChange={this.handleInternshipStartDateChange}
            required={true}
          />

          <Input
            type="date"
            name="endDate"
            label="Dată sfârșit"
            value={this.state.internshipEndDate}
            handleChange={this.handleInternshipEndDateChange}
            required={true}
          />

          <Input
            type="date"
            name="deadline"
            label="Deadline înscrieri"
            value={this.state.internshipDeadline}
            handleChange={this.handleInternshipDeadlineChange}
            required={true}
          />

          <Input
            type="number"
            name="maxNumberStudents"
            label="Număr maxim de studenți"
            value={this.state.internshipMaxNumberStudents}
            handleChange={this.handleInternshipMaxNumberStudentsChange}
            required={true}
          />

          <FormControlLabel
            value={this.state.internshipPaid}
            control={<Checkbox color="primary" />}
            label="Plătit"
            labelPlacement="start"
            checked={this.state.internshipPaid === true}
            onChange={this.handleInternshipPaidChange}
            required={true}
          />

          <Form.Group className="col-md-4">
            <Form.Label>Descriere</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={this.state.internshipDescription}
              onChange={this.handleInternshipDescriptionChange}
              required={true}
            />
          </Form.Group>

          <p></p>

          <div className="col-md-4">
            <label>Oras:</label>
            <Select
              placeholder="Selectează oraș"
              value={this.state.internshipCitySelectedOption}
              options={this.state.citiesOptions}
              onChange={this.handleInternshipCityChange}
              isSearchable
              required
            />
          </div>

          <p></p>

          

<div className="col-md-4">
          Categorii:
          <Button variant="primary" onClick={this.handleShowCategories}>
          {JSON.stringify(this.state.internshipCategories) !== JSON.stringify([])
                ? this.state.internshipCategories
                    .map((category) => category.name)
                    .join(", ")
                : "Nicio categorie"}
      </Button>
          </div>
          
          

      <Modal show={this.state.categoriesIsOpen} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Categorii</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {this.state.internshipCategoriesAux !== []
              ? this.state.internshipCategoriesAux.map((category) => (
                  <>
                    <SelectElement
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      onDelete={this.handleInternshipCategoryDelete}
                    />
                  </>
                ))
              : ""}
            <br/>
            <Select
              placeholder="Selecteaza categorie"
              value={this.state.categoriesSelectedOption}
              options={this.state.categoriesOptions}
              onChange={this.handleInternshipCategoryChange}
            />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Închide
          </Button>
          <Button variant="primary" onClick={this.handleInternshipCategoryForm}>
            Salvează
          </Button>
        </Modal.Footer>
      </Modal>

          <div className="col-md-4">
          Aptitudini:
          <Button variant="primary" onClick={this.handleShowAptitudes}>
          {JSON.stringify(this.state.internshipAptitudes) !== JSON.stringify([])
                ? this.state.internshipAptitudes
                    .map((aptitude) => aptitude.name)
                    .join(", ")
                : "Nicio aptitudine"}
      </Button>
          </div>
          
          

      <Modal show={this.state.aptitudesIsOpen} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aptitudini</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {this.state.internshipAptitudesAux !== []
              ? this.state.internshipAptitudesAux.map((aptitude) => (
                  <>
                    <SelectElement
                      key={aptitude.id}
                      id={aptitude.id}
                      name={aptitude.name}
                      onDelete={this.handleInternshipAptitudeDelete}
                    />
                  </>
                ))
              : ""}
                      <br/>

            <Select
              placeholder="Selecteaza aptitudine"
              value={this.state.aptitudesSelectedOption}
              options={this.state.aptitudesOptions}
              onChange={this.handleInternshipAptitudeChange}
            />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Închide
          </Button>
          <Button variant="primary" onClick={this.handleInternshipAptitudeForm}>
            Salvează
          </Button>
        </Modal.Footer>
      </Modal>


          <div className="col-md-4">
            <button className="btn btn-primary mt-2" type="submit">
              Salveaza
            </button>
          </div>

          <div className="text-danger m-3 justify-content-center">{this.state.error}</div>
        </Form>
      </div>
    );
  }

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCreateInternshipData();

    return <div>{contents}</div>;
  }
}

export default withRouter(CreateInternship);
