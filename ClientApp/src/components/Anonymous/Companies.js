import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Loading from "../Universal/Loading";
class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      internships: [],
      cities: [],
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.populateCompaniesData();
  }

  async handleSelectCompany(companyId) {
    this.props.history.push("/company/" + companyId);
  }

  async populateCompaniesData() {
    const companiesResponse = await fetch("api/companies");
    const companiesData = await companiesResponse.json();

    const internshipsResponse = await fetch("api/internships");
    const internshipsData = await internshipsResponse.json();

    const citiesResponse = await fetch("api/cities");
    const citiesData = await citiesResponse.json();

    const categoriesResponse = await fetch("api/categories");
    const categoriesData = await categoriesResponse.json();

    this.setState({
      companies: companiesData,
      internships: internshipsData,
      cities: citiesData,
      categories: categoriesData,
      loading: false,
    });
  }

  renderCompaniesData() {
    return (
      <div className="justify-content-start">
        <br />
        <h3 className="text-center">Companii</h3>
        <br />
        {this.state.companies.map((company, index) => (
          <span key={index} className="mr-3">
            <img
              width="200"
              height="200"
              alt="picture"
              src={"logos/" + company.logoPath}
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
              onClick={() => this.handleSelectCompany(company.id)}
            />
          </span>
        ))}
      </div>
    );
  }

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCompaniesData();

    return <div>{contents}</div>;
  }
}

export default withRouter(Companies);
