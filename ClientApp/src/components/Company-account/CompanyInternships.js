import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Universal/Loading";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

class CompanyInternships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [],
      cities: [],
      loading: true,
    };
    this.renderCompanyInternshipsData = this.renderCompanyInternshipsData.bind(this);
  }

  componentDidMount() {
    this.populateCompanyInternshipsData();
  }

  async populateCompanyInternshipsData() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    const internshipsResponse = await fetch("api/internships/company/" + user.id);
    var internshipsData = [];
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    const citiesResponse = await fetch("api/cities");
    var citiesData = [];
    if (citiesResponse.ok) citiesData = await citiesResponse.json();

    this.setState({
      internships: internshipsData,
      cities: citiesData,
      loading: false,
    });
  }

  handleSelectInternship = (id) => {
    this.props.history.push("/internship/" + id);
  };

  handleManageApplications = (id) => {
    this.props.history.push("/manageInternshipApplications/" + id);
  };

  handleModifyInternship = (id) => {
    this.props.history.push("/modifyInternship/" + id);
  };

  handleCreateInternship = () => {
    this.props.history.push("/createInternship");
  };

  handleDeleteInternship = async (id) => {
    var internshipResponse = await fetch("api/internships/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (internshipResponse.ok) {
      var internshipsCopy = JSON.parse(JSON.stringify(this.state.internships));
      internshipsCopy = internshipsCopy.filter((obj) => obj.id !== id);
      this.setState({
        internships: internshipsCopy,
      });
    }
  };

  getInternshipDescriptionShort(description, length) {
    description = description.replaceAll("<br/>", "\n");
    if (description.length > length) return description.substring(0, length) + "...";
    else return description;
  }

  getCity = (id) => {
    for (let i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  renderCompanyInternshipsData() {
    return (
      <>
        <div className="m-3">
          <h3 className="text-center">Stagiile companiei </h3>
          <Fab
            color="primary"
            aria-label="add"
            onClick={this.handleCreateInternship}
            size="medium"
          >
            <AddIcon />
          </Fab>
        </div>

        <p> </p>

        {this.state.internships !== []
          ? this.state.internships.map((internship, index) => (
              <Paper className="p-3 m-3">
                <span key={index}>
                  <Link to={"internship/" + internship.id}>
                    <b style={{ fontSize: 18 }}> {internship.name} </b>
                  </Link>
                  <br />
                  <span style={{ fontSize: 14 }}>
                    {internship.paid ? "Platit" : "Neplatit"}
                  </span>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 14,
                    }}
                  >
                    {this.getCity(internship.cityId).name}
                    <Icon.GeoAltFill />
                  </span>
                  <br />
                  <span>
                    {this.getInternshipDescriptionShort(internship.description, 200)}
                  </span>
                  <p> </p>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 200 }}
                    className="btn btn-primary mt-2"
                    onClick={() => this.handleManageApplications(internship.id)}
                  >
                    Gestionează aplicări
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 200 }}
                    className="btn btn-primary mt-2"
                    onClick={() => this.handleModifyInternship(internship.id)}
                  >
                    Modifică
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ width: 200 }}
                    className="btn btn-danger mt-2"
                    onClick={() => this.handleDeleteInternship(internship.id)}
                  >
                    Șterge
                  </Button>
                </span>
              </Paper>
            ))
          : ""}
      </>
    );
  }

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCompanyInternshipsData();

    return <div>{contents}</div>;
  }
}

export default withRouter(CompanyInternships);
