import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Loading from "../Universal/Loading";
import { Paper } from "@material-ui/core";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      company: null,
      internships: [],
      cities: [],
    };
  }

  componentDidMount() {
    this.populateCompanyData();
  }

  populateCompanyData = async () => {
    var companyResponse = await fetch("api/companies/" + this.props.companyId);
    var companyData = "";
    console.log(companyResponse);
    if (companyResponse.ok) {
      companyData = await companyResponse.json();
    }

    const internshipsResponse = await fetch(
      "api/internships/company/" + this.props.companyId
    );
    var internshipsData = [];
    if (internshipsResponse.ok) {
      internshipsData = await internshipsResponse.json();
    }

    const citiesResponse = await fetch("api/cities");
    var citiesData = [];
    if (citiesResponse.ok) citiesData = await citiesResponse.json();

    this.setState({
      company: companyData,
      internships: internshipsData,
      cities: citiesData,
      loading: false,
    });
  };

  handleSelectInternship = (id) => {
    this.props.history.push("/internship/" + id);
  };

  getInternshipDescriptionShort(description, length) {
    description = description.replaceAll("<br/>", "\n");
    if (description.length > length) return description.substring(0, length) + "...";
    else return description;
  }

  handleClickedAddress = (address) => {
    window.open("https://www.google.ro/maps/place/" + address);
  };

  handleClickedWebsite = (website) => {
    window.open(website);
  };

  getCity = (id) => {
    for (let i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  handleWebsiteMouseOver = (event) => {
    event.target.style.cursor = "pointer";
    event.target.style.textDecoration = "underline";
  };

  handleWebsiteMouseOut = (event) => {
    event.target.style.cursor = "normal";
    event.target.style.textDecoration = "none";
  };

  renderCompanyData = () => {
    return (
      <div>
        <br/>
        <div className="text-center">
          <h3>{this.state.company.name}</h3>
        </div>
        <br />

        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <Paper>
                <div className="p-4 mb-5">
                  {this.state.internships !== []
                    ? this.state.internships.map((internship) => (
                        <span id={internship.id}>
                          <Link to={"/internship/" + internship.id}>
                            <b
                              style={{
                                fontSize: 18,
                              }}
                            >
                              {" "}
                              {internship.name}{" "}
                            </b>
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
                            {this.getCity(internship.idCity).name}
                            <Icon.GeoAltFill />
                          </span>
                          <br />
                          <span>
                            {this.getInternshipDescriptionShort(
                              internship.description,
                              200
                            )}
                          </span>
                          <p> </p>
                        </span>
                      ))
                    : ""}
                </div>
              </Paper>
            </div>

            <div class="col-sm-4">
              <Paper>
                <div className="p-3">
                  <img
                    width="70"
                    alt={this.state.company.name}
                    src={"/logos/" + this.state.company.logoPath}
                  />
                  <br />
                  {this.state.company["description"]}
                  <br />
                  <br />
                  <img
                    onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    onMouseOut={(e) => (e.target.style.cursor = "normal")}
                    onClick={() => this.handleClickedAddress(this.state.company.address)}
                    width="32"
                    alt="Google Maps icon"
                    src="googlemaps.png"
                  />

                  <span
                    style={{ marginLeft: 15, color: "#0366d6" }}
                    onMouseOver={this.handleWebsiteMouseOver}
                    onMouseOut={this.handleWebsiteMouseOut}
                    onClick={() => this.handleClickedWebsite(this.state.company.website)}
                  >
                    Website
                  </span>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCompanyData();

    return <div>{contents}</div>;
  }
}

//export default Company
export default withRouter(Company);
