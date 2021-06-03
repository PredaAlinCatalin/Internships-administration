import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Loading from "../Universal/Loading";
import { Button, Paper } from "@material-ui/core";
import "../Universal/coverButton.css";
import InternshipCard from "./InternshipCard";

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

  handleClickedAddress = () => {
    window.open("https://www.google.ro/maps/place/" + this.state.company.address);
  };

  handleClickedWebsite = () => {
    window.open("https://" + this.state.company.website);
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
        <br />

        <div class="container">
          <div class="row">
            <div
              //  style={{width: 860}}
              className="col-lg-8"
            >
              <Paper>
                <div className="cover-container">
                  <img
                    width="100%"
                    alt="cover"
                    src={"covers/" + this.state.company.coverPath}
                  />
                  <img
                    className="cover-img"
                    alt="logo"
                    src={"logos/" + this.state.company.logoPath}
                  />
                </div>
                <div className="p-4 mb-3">
                  <h4>{this.state.company.name}</h4>
                  <div style={{ marginTop: -10, fontSize: 15 }}>
                    {this.state.company.industry} {this.state.company.address}
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickedWebsite}
                  >
                    Mergi la site-ul web
                  </Button>
                  <img
                    style={{ marginLeft: 5 }}
                    onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    onMouseOut={(e) => (e.target.style.cursor = "normal")}
                    onClick={this.handleClickedAddress}
                    width="36"
                    alt="Google Maps icon"
                    src="googlemaps.png"
                  />
                  <br />
                </div>
              </Paper>

              <Paper>
                {/* <div className="p-4 mb-5">
                  <h4>Stagiile companiei</h4>
                  <br />
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
                            {this.getCity(internship.cityId).name}
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
                </div> */}

                <div className="container">
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    {this.state.internships.map(
                      (internship) =>
                        internship.status === "approved" && (
                          <div key={internship.id} className="mb-3 col">
                            <div className="card">
                              <InternshipCard
                                internshipId={internship.id}
                                companyId={internship.companyId}
                              />
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </Paper>
            </div>

            <div class="col-sm-4">
              <Paper>
                <div className="p-3">
                  <h4>Despre</h4>
                  {this.state.company["description"]}
                  <br />
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
