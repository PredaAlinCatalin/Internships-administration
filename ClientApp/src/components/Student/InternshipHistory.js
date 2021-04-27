import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";

export default class InternshipHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentInternships: [],
      internships: [],
      companies: [],
      cities: [],
      loading: true,
    };
    this.renderInternshipHistoryData = this.renderInternshipHistoryData.bind(this);
  }

  componentDidMount() {
    this.populateInternshipHistoryData();
  }

  async populateInternshipHistoryData() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    var studentInternshipsData = [];
    const studentInternshipsResponse = await fetch(
      "api/studentinternships/student/" + user.id
    );
    if (studentInternshipsResponse.ok)
      studentInternshipsData = await studentInternshipsResponse.json();

    const internshipsResponse = await fetch("api/internships/student/" + user.id);
    var internshipsData = [];
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    const companiesResponse = await fetch("api/companies");
    var companiesData = [];
    if (companiesResponse.ok) companiesData = await companiesResponse.json();

    const citiesResponse = await fetch("api/cities");
    var citiesData = [];
    if (citiesResponse.ok) citiesData = await citiesResponse.json();

    this.setState({
      studentInternships: studentInternshipsData,
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

  renderInternshipHistoryData() {
    return (
      <>
        <h5>Istoricul stagiilor tale:</h5>
        <br />

        <table aria-labelledby="tabelLabel" className="table table-striped">
          <thead>
            <tr>
              <th>Companie</th>
              <th>Stagiu</th>
              <th>Data inceput</th>
              <th>Data sfarsit</th>
              <th>Data aplicarii</th>
              <th>Nota stagiu</th>
            </tr>
          </thead>
          <tbody>
            {this.state.studentInternships !== []
              ? this.state.studentInternships.map((studentInternship, index) => (
                  <tr key={index}>
                    <>
                      <td
                        style={{
                          paddingRight: 10,
                        }}
                      >
                        <img
                          width="100"
                          alt="lenovo"
                          src={
                            "logos/" +
                            this.getCompany(
                              this.getInternship(studentInternship.idInternship).idCompany
                            ).logoPath
                          }
                          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                          onMouseOut={(e) => (e.target.style.cursor = "normal")}
                          onClick={() =>
                            this.handleSelectCompany(
                              this.getInternship(studentInternship.idInternship).idCompany
                            )
                          }
                        />
                        <br />
                        <br />
                      </td>
                      <td style={{ width: 700 }}>
                        <a href={"internship/" + studentInternship.idInternship}>
                          <b
                            style={{
                              color: "black",
                            }}
                          >
                            {this.getInternship(studentInternship.idInternship).name}
                          </b>
                        </a>
                        <br />
                        <a
                          href={
                            "company/" +
                            this.getInternship(studentInternship.idInternship).idCompany
                          }
                        >
                          <b
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {
                              this.getCompany(
                                this.getInternship(studentInternship.idInternship)
                                  .idCompany
                              ).name
                            }
                          </b>
                        </a>
                        <span
                          style={{
                            paddingLeft: 6,
                            fontSize: 14,
                          }}
                        >
                          {this.getInternship(studentInternship.idInternship).paid
                            ? "Platit"
                            : "Neplatit"}
                        </span>
                        <span
                          style={{
                            paddingLeft: 6,
                            fontSize: 14,
                          }}
                        >
                          {
                            this.getCity(
                              this.getInternship(studentInternship.idInternship).idCity
                            ).name
                          }
                          <Icon.GeoAltFill />
                        </span>
                        <br />
                        <br />
                      </td>

                      <td
                        style={{
                          paddingRight: 20,
                        }}
                      >
                        {studentInternship.applicationDate}
                        <br />
                        <br />
                      </td>

                      <td
                        style={{
                          paddingRight: 20,
                        }}
                      >
                        {this.getInternship(studentInternship.idInternship).startDate}
                        <br />
                        <br />
                      </td>

                      <td
                        style={{
                          paddingRight: 20,
                        }}
                      >
                        {this.getInternship(studentInternship.idInternship).endDate}
                        <br />
                        <br />
                      </td>

                      <td>
                        {studentInternship.hasGraded
                          ? studentInternship.internshipGrade
                          : ""}
                        <br />
                        <br />
                      </td>
                    </>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderInternshipHistoryData()
    );

    return <div>{contents}</div>;
  }
}
