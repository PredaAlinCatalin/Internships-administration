import React, { Component } from "react";
import InternshipCard from "../Internships/InternshipCard";
import TabMenu from "../Universal/TabMenu";

export default class SavedInternships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedStudentInternships: [],
      internships: [],
      companies: [],
      cities: [],
      loading: true,
    };
    this.renderSavedInternshipsData = this.renderSavedInternshipsData.bind(this);
  }

  componentDidMount() {
    this.populateSavedInternshipsData();
  }

  async populateSavedInternshipsData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    var savedStudentInternshipsData = [];
    const savedStudentInternshipsResponse = await fetch(
      "api/savedstudentinternships/student/" + user.id
    );
    if (savedStudentInternshipsResponse.ok)
      savedStudentInternshipsData = await savedStudentInternshipsResponse.json();

    const internshipsResponse = await fetch("api/internships/studentSaved/" + user.id);
    var internshipsData = [];
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    const companiesResponse = await fetch("api/companies");
    var companiesData = [];
    if (companiesResponse.ok) companiesData = await companiesResponse.json();

    const citiesResponse = await fetch("api/cities");
    var citiesData = [];
    if (citiesResponse.ok) citiesData = await citiesResponse.json();

    this.setState({
      savedStudentInternships: savedStudentInternshipsData,
      internships: internshipsData,
      companies: companiesData,
      cities: citiesData,
      loading: false,
    });
  }

  handleSelectCompany(name) {
    this.props.history.push("/company/" + name);
  }

  handleSelectInternship = (id) => {
    this.props.history.push("/internship/" + id);
  };

  getInternship = (id) => {
    for (var i = 0; i < this.state.internships.length; i++)
      if (this.state.internships[i].id === id) return this.state.internships[i];
  };

  getCompany = (id) => {
    for (var i = 0; i < this.state.companies.length; i++)
      if (this.state.companies[i].id === id) return this.state.companies[i];
  };

  getCity = (id) => {
    for (var i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  renderSavedInternshipsData() {
    return (
      <>
        <TabMenu />
        {this.state.savedStudentInternships.length > 0 ? (
          <div>
            <h5>Stagii salvate:</h5>
            <br />

            <div className="container">
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
                {this.state.savedStudentInternships.map(
                  (savedStudentInternship, index) => (
                    <div className="mb-3 col">
                      <div className="card">
                        <InternshipCard
                          internshipData={this.getInternship(
                            savedStudentInternship.internshipId
                          )}
                          internshipId={savedStudentInternship.internshipId}
                          companyId={
                            this.getInternship(savedStudentInternship.internshipId)
                              .companyId
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">Nu ai salvat niciun stagiu</div>
        )}
      </>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderSavedInternshipsData()
    );

    return <div>{contents}</div>;
  }
}
