import React, { Component } from "react";
import "./CompanyProfile.css";
import { withRouter } from "react-router-dom";
import Loading from "../Universal/Loading";
import NameForm from "./Profile/NameForm";
import DescriptionForm from "./Profile/DescriptionForm";
import IndustryForm from "./Profile/IndustryForm";
import AddressForm from "./Profile/AddressForm";
import WebsiteForm from "./Profile/WebsiteForm";
import LogoForm from "./Profile/LogoForm";
import { Paper } from "@material-ui/core";

class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      loading: true,
      companyLogoPath: "",
      logoIsOpen: false,
      companyName: "",
      nameIsOpen: false,
      companyDescription: "",
      descriptionIsOpen: false,
      companyIndustry: "",
      industryIsOpen: false,
      companyAddress: "",
      addressIsOpen: false,
      companyWebsite: "",
      isAuthenticated: false,
      userName: null,
      userId: null,
      logoFormData: null,
    };
    this.renderCompanyProfileData = this.renderCompanyProfileData.bind(this);
  }

  componentDidMount() {
    this.populateCompanyProfileData();
  }

  async populateCompanyProfileData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ userId: user.id });
    var companyResponse = await fetch("api/companies/" + user.id);
    var companyData = "";
    if (companyResponse.ok) companyData = await companyResponse.json();

    this.setState({
      company: companyData,
      loading: false,
    });
  }
  renderCompanyProfileData() {
    return (
      <div>
        <Paper className="m-3 p-3" elevation={3} style={{ width: 900 }}>
          {/* <div
            className="border border border-5 shadow p-3 mb-5 bg-body rounded"
            style={{
              width: 900,
              backgroundColor: "lightblue",
              margin: "auto",
              padding: 50,
            }}
          > */}
          <LogoForm companyId={this.state.company.id} />

          <br />

          <div style={{ paddingLeft: 8 }}>
            <b
              style={{
                color: "#0c56a5",
                fontSize: 18,
              }}
            >
              NUME COMPANIE
            </b>
            <hr
              style={{
                marginTop: -5,
                borderTop: "2px solid gray",
              }}
            />
          </div>

          <NameForm companyId={this.state.company.id} />

          <br />

          <div style={{ paddingLeft: 8 }}>
            <b
              style={{
                color: "#0c56a5",
                fontSize: 18,
              }}
            >
              DESCRIERE
            </b>
            <hr
              style={{
                marginTop: -5,
                borderTop: "2px solid gray",
              }}
            />
          </div>

          <DescriptionForm companyId={this.state.company.id} />

          <br />

          <div style={{ paddingLeft: 8 }}>
            <b
              style={{
                color: "#0c56a5",
                fontSize: 18,
              }}
            >
              INDUSTRIE
            </b>
            <hr
              style={{
                marginTop: -5,
                borderTop: "2px solid gray",
              }}
            />
          </div>

          <IndustryForm companyId={this.state.company.id} />

          <br />

          <div style={{ paddingLeft: 8 }}>
            <b
              style={{
                color: "#0c56a5",
                fontSize: 18,
              }}
            >
              ADRESA
            </b>
            <hr
              style={{
                marginTop: -5,
                borderTop: "2px solid gray",
              }}
            />
          </div>

          <AddressForm companyId={this.state.company.id} />

          <br />

          <div style={{ paddingLeft: 8 }}>
            <b
              style={{
                color: "#0c56a5",
                fontSize: 18,
              }}
            >
              WEBSITE
            </b>
            <hr
              style={{
                marginTop: -5,
                borderTop: "2px solid gray",
              }}
            />
          </div>

          <WebsiteForm companyId={this.state.company.id} />
          {/* </div> */}
        </Paper>
        <br />
      </div>
    );
  }
  render() {
    let contents = this.state.loading ? <Loading /> : this.renderCompanyProfileData();

    return <div>{contents}</div>;
  }
}

export default withRouter(CompanyProfile);
