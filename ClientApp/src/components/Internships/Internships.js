import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import $ from "jquery";
import Loading from "../Universal/Loading";
import {Modal} from 'react-bootstrap';

class Internships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      internships: [],
      cities: [],
      categories: [],
      loading: true,
      nrInternshipsByCategory: [],
      nrInternshipsByCity: [],
      currentCategory: this.props.category !== undefined ? this.props.category : -1,
      currentSearch: this.props.search !== undefined ? this.props.search : "",
      currentCity: this.props.city !== undefined ? this.props.city : -1,
      currentPage: 1,
      internshipsPerPage: 4,
      upperPageBound: 3,
      lowerPageBound: 0,
      isPrevBtnActive: "disabled",
      isNextBtnActive: "",
      pageBound: 3,
      currentInternships: [],
      pageNumbers: [],
    };
  }

  componentDidUpdate() {
    $("ul li.active").removeClass("active");
    $("ul li#" + this.state.currentPage).addClass("active");
  }

  handleClick = (event) => {
    let listid = Number(event.target.id);
    this.setState({
      currentPage: listid,
    });
    $("ul li.active").removeClass("active");
    $("ul li#" + listid).addClass("active");
    this.setPrevAndNextBtnClass(listid);
  };
  setPrevAndNextBtnClass = (listid) => {
    let totalPage = Math.ceil(
      this.state.internships.length / this.state.internshipsPerPage
    );
    this.setState({
      isNextBtnActive: "disabled",
    });
    this.setState({
      isPrevBtnActive: "disabled",
    });
    if (totalPage === listid && totalPage > 1) {
      this.setState({ isPrevBtnActive: "" });
    } else if (listid === 1 && totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
    } else if (totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
      this.setState({ isPrevBtnActive: "" });
    }

    const indexOfLastInternship = listid * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    const limit = Math.ceil(
      this.state.internships.length / this.state.internshipsPerPage
    );
    for (let i = 1; i <= limit; i++) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };
  btnIncrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound + this.state.pageBound,
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound + this.state.pageBound,
    });
    let listid = this.state.upperPageBound + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };
  btnDecrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound - this.state.pageBound,
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound - this.state.pageBound,
    });
    let listid = this.state.upperPageBound - this.state.pageBound;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };
  btnPrevClick = () => {
    if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
      this.setState({
        upperPageBound: this.state.upperPageBound - this.state.pageBound,
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound - this.state.pageBound,
      });
    }
    let listid = this.state.currentPage - 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };
  btnNextClick = () => {
    if (this.state.currentPage + 1 > this.state.upperPageBound) {
      this.setState({
        upperPageBound: this.state.upperPageBound + this.state.pageBound,
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound + this.state.pageBound,
      });
    }
    let listid = this.state.currentPage + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };

  componentDidMount() {
    this.populateInternshipsData();
  }

  handleSelectCompany(id) {
    this.props.history.push("/company/" + id);
  }

  handleSelectInternship = (id) => {
    this.props.history.push("/internship/" + id);
  };

  async populateInternshipsData() {
    console.log(sessionStorage.getItem("user"));
    const companiesResponse = await fetch("api/companies");
    let companiesData = [];
    if (companiesResponse.ok) companiesData = await companiesResponse.json();

    const internshipsResponse = await fetch("api/internships");
    let internshipsData = [];
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    let categoriesData = [];
    await fetch("api/categories")
      .then((res) => res.json())
      .then((data) => {
        categoriesData = data;
      });

    for (let i = 0; i < categoriesData.length; i++) {
      await fetch("api/internships/category/" + categoriesData[i].id)
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 404) {
            let obj = {
              nrInternships: data.length,
              categoryName: categoriesData[i].name,
              categoryId: categoriesData[i].id,
            };

            let nrInternshipsByCategoryCopy = JSON.parse(
              JSON.stringify(this.state.nrInternshipsByCategory)
            );
            nrInternshipsByCategoryCopy.push(obj);

            this.setState({
              nrInternshipsByCategory: nrInternshipsByCategoryCopy,
            });
          }
        })
        .catch((error) => console.log(error));
    }

    let citiesData = [];
    await fetch("api/cities")
      .then((res) => res.json())
      .then((data) => {
        citiesData = data;
      });

    for (let i = 0; i < citiesData.length; i++) {
      await fetch("api/internships/city/" + citiesData[i].id)
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 404) {
            let obj = {
              nrInternships: data.length,
              cityName: citiesData[i].name,
              cityId: citiesData[i].id,
            };

            let nrInternshipsByCityCopy = JSON.parse(
              JSON.stringify(this.state.nrInternshipsByCity)
            );
            nrInternshipsByCityCopy.push(obj);

            this.setState({
              nrInternshipsByCity: nrInternshipsByCityCopy,
            });
          }
        });
    }

    this.setState({
      companies: companiesData,
      internships: internshipsData,
      cities: citiesData,
      categories: categoriesData,
      loading: false,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  }

  handleSearchSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    const aux =
      "api/internships/category/" +
      this.state.currentCategory +
      "/city/" +
      this.state.currentCity +
      "/search/" +
      this.state.currentSearch;

    let internshipsData = [];
    let internshipsResponse = await fetch(aux);
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
    this.setState({
      internships: internshipsData,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  handleCategoryChange = async (categoryId) => {
    const aux =
      "api/internships/category/" +
      categoryId +
      "/city/" +
      this.state.currentCity +
      "/search/" +
      this.state.currentSearch;

    let internshipsData = [];
    let internshipsResponse = await fetch(aux);
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
    this.setState({
      currentCategory: categoryId,
      internships: internshipsData,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  handleCategoryRemove = async (categoryId) => {
    const aux =
      "api/internships/category/-1/city/" +
      this.state.currentCity +
      "/search/" +
      this.state.currentSearch;

    let internshipsData = [];
    let internshipsResponse = await fetch(aux);
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
    this.setState({
      currentCategory: -1,
      internships: internshipsData,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  handleCategoryMouseOver = (event) => {
    if (event.target.id === "categoryChange") event.target.style.color = "#0366d6";
    else event.target.parentElement.style.color = "#0366d6";
    event.target.style.cursor = "pointer";
  };

  handleCategoryMouseOut = (event) => {
    if (event.target.id === "categoryChange") event.target.style.color = "black";
    else event.target.parentElement.style.color = "black";
    event.target.style.cursor = "default";
  };

  handleCityChange = async (cityId) => {
    const aux =
      "api/internships/category/" +
      this.state.currentCategory +
      "/city/" +
      cityId +
      "/search/" +
      this.state.currentSearch;

    let internshipsData = [];
    let internshipsResponse = await fetch(aux);
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
    this.setState({
      currentCity: cityId,
      internships: internshipsData,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  handleCityRemove = async (cityId) => {
    const aux =
      "api/internships/category/" +
      this.state.currentCategory +
      "/city/-1/search/" +
      this.state.currentSearch;

    let internshipsData = [];
    let internshipsResponse = await fetch(aux);
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
    this.setState({
      currentCity: -1,
      internships: internshipsData,
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  handleCityMouseOver = (event) => {
    if (event.target.id === "cityChange") event.target.style.color = "#0366d6";
    else event.target.parentElement.style.color = "#0366d6";
    event.target.style.cursor = "pointer";
  };

  handleCityMouseOut = (event) => {
    if (event.target.id === "cityChange") event.target.style.color = "black";
    else event.target.parentElement.style.color = "black";
    event.target.style.cursor = "default";
  };

  handleResetFiltersMouseOver = (event) => {
    if (event.target.id === "resetFilters") event.target.style.color = "#0366d6";
    else event.target.parentElement.style.color = "#0366d6";
    event.target.style.cursor = "pointer";
  };

  handleResetFiltersMouseOut = (event) => {
    if (event.target.id === "resetFilters") event.target.style.color = "black";
    else event.target.parentElement.style.color = "black";
    event.target.style.cursor = "default";
  };

  handleResetFilters = async () => {
    let internshipsData = [];
    let internshipsResponse = await fetch("api/internships");
    if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

    this.setState({
      internships: internshipsData,
      currentCategory: -1,
      currentCity: -1,
      currentSearch: "",
    });

    const indexOfLastInternship = this.state.currentPage * this.state.internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - this.state.internshipsPerPage;
    const currentInternships = this.state.internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.internships.length / this.state.internshipsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    this.setState({
      currentInternships: currentInternships,
      pageNumbers: pageNumbers,
    });
  };

  getCompany = (id) => {
    for (let i = 0; i < this.state.companies.length; i++)
      if (this.state.companies[i].id === id) return this.state.companies[i];
  };

  getCity = (id) => {
    for (let i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  renderInternshipsData() {
    return (
      <>
        <div style={{ width: 300, marginLeft: 15 }}>
          <span
            style={{
              display: "inline",
              whiteSpace: "nowrap",
            }}
          >
            <form style={{ display: "inline" }} onSubmit={this.handleSearchSubmit}>
              <input
                style={{
                  display: "inline",
                  whiteSpace: "nowrap",
                }}
                type="text"
                placeholder="Cauta"
                className="form-control"
                name="search"
                value={this.state.currentSearch}
                onChange={(e) =>
                  this.setState({
                    currentSearch: e.target.value,
                  })
                }
              />
              <button
                style={{
                  display: "inline",
                  whiteSpace: "nowrap",
                }}
                className="btn submit"
                type="submit"
              >
                <Icon.Search />
              </button>
            </form>

            {this.state.currentCategory !== -1 ||
            this.state.currentCity !== -1 ||
            this.state.currentSearch !== "" ? (
              <span
                id="resetFilters"
                onClick={this.handleResetFilters}
                onMouseOver={this.handleResetFiltersMouseOver}
                onMouseOut={this.handleResetFiltersMouseOut}
              >
                Reseteaza filtre
                <Icon.X color="red" size={20} />
              </span>
            ) : (
              ""
            )}
          </span>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <p> </p>
              <table>
                <tbody>
                  {this.state.currentInternships.map((internship, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          paddingRight: 10,
                          paddingTop: 10,
                        }}
                      >
                        <img
                          width="100"
                          alt="lenovo"
                          src={"logos/" + this.getCompany(internship.idCompany).logoPath}
                          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                          onMouseOut={(e) => (e.target.style.cursor = "normal")}
                          onClick={() => this.handleSelectCompany(internship.idCompany)}
                        />
                        <br />
                        <br />
                      </td>

                      <td
                        style={{
                          paddingRight: 10,
                          paddingTop: 10,
                        }}
                      >
                        <Link to={"internship/" + internship.id}>
                          <b
                            style={{
                              color: "black",
                            }}
                          >
                            {internship.name}
                          </b>
                        </Link>
                        <br />
                        <Link to={"/company/" + internship.idCompany}>
                          <b
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {this.getCompany(internship.idCompany).name}
                          </b>
                        </Link>
                        <span
                          style={{
                            paddingLeft: 6,
                            fontSize: 14,
                          }}
                        >
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
                        <br />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-sm-3">
              Categorii:
              <br />
              <div style={{ fontSize: 14 }}>
                {this.state.nrInternshipsByCategory.map((object, index) => (
                  <span key={index}>
                    {this.state.currentCategory !== object.categoryId ? (
                      <>
                        <span
                          id="categoryChange"
                          onClick={(event) =>
                            this.handleCategoryChange(object.categoryId)
                          }
                          onMouseOver={this.handleCategoryMouseOver}
                          onMouseOut={this.handleCategoryMouseOut}
                        >
                          {object.categoryName}
                          <span
                            style={{
                              color: "gray",
                            }}
                          >
                            ({object.nrInternships})
                          </span>
                          &nbsp;
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          id="categoryChange"
                          onClick={(event) =>
                            this.handleCategoryRemove(object.categoryId)
                          }
                          onMouseOver={this.handleCategoryMouseOver}
                          onMouseOut={this.handleCategoryMouseOut}
                        >
                          {object.categoryName}
                          <span
                            style={{
                              color: "gray",
                            }}
                          >
                            ({object.nrInternships})
                          </span>
                          &nbsp;
                          <Icon.X color="red" size={20} />
                        </span>
                      </>
                    )}

                    <br />
                  </span>
                ))}
              </div>
              <br />
              Orase:
              <br />
              <div style={{ fontSize: 14 }}>
                {this.state.nrInternshipsByCity.map((object, index) => (
                  <span key={index}>
                    {this.state.currentCity !== object.cityId ? (
                      <>
                        <span
                          id="cityChange"
                          onClick={(event) => this.handleCityChange(object.cityId)}
                          onMouseOver={this.handleCityMouseOver}
                          onMouseOut={this.handleCityMouseOut}
                        >
                          {object.cityName}
                          <span
                            style={{
                              color: "gray",
                            }}
                          >
                            ({object.nrInternships})
                          </span>
                          &nbsp;
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          id="cityChange"
                          onClick={(event) => this.handleCityRemove(object.cityId)}
                          onMouseOver={this.handleCityMouseOver}
                          onMouseOut={this.handleCityMouseOut}
                        >
                          {object.cityName}
                          <span
                            style={{
                              color: "gray",
                            }}
                          >
                            ({object.nrInternships})
                          </span>
                          &nbsp;
                          <Icon.X color="red" size={20} />
                        </span>
                      </>
                    )}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ul className="pagination">
          {this.state.isPrevBtnActive === "disabled" && (
            <li className={this.state.isPrevBtnActive}>
              <button className="btn btn-primary" disabled id="btnPrev">
                {" "}
                Prev{" "}
              </button>
            </li>
          )}

          {this.state.isPrevBtnActive === "" && (
            <li className={this.state.isPrevBtnActive}>
              <button
                className="btn btn-primary"
                id="btnPrev"
                onClick={this.btnPrevClick}
              >
                {" "}
                Prev{" "}
              </button>
            </li>
          )}

          {this.state.lowerPageBound >= 1 && (
            <li className="">
              <button className="btn btn-primary" onClick={this.btnDecrementClick}>
                {" "}
                &hellip;{" "}
              </button>
            </li>
          )}

          {this.state.pageNumbers.map((number, index) => (
            <span key={index}>
              {number === 1 && this.state.currentPage === 1 ? (
                <li key={number} className="active" id={number}>
                  <button
                    className="btn btn-primary"
                    id={number}
                    onClick={this.handleClick}
                  >
                    {number}
                  </button>
                </li>
              ) : number < this.state.upperPageBound + 1 &&
                number > this.state.lowerPageBound ? (
                <li key={number} id={number}>
                  <button
                    className="btn btn-primary"
                    id={number}
                    onClick={this.handleClick}
                  >
                    {number}
                  </button>
                </li>
              ) : (
                ""
              )}
            </span>
          ))}

          {this.state.pageNumbers.length > this.state.upperPageBound && (
            <li className="">
              <button className="btn btn-primary" onClick={this.btnIncrementClick}>
                {" "}
                &hellip;{" "}
              </button>
            </li>
          )}

          {this.state.isNextBtnActive === "disabled" && (
            <li className={this.state.isNextBtnActive}>
              <button className="btn btn-primary" disabled id="btnNext">
                {" "}
                Next{" "}
              </button>
            </li>
          )}

          {this.state.isNextBtnActive === "" && (
            <li className={this.state.isNextBtnActive}>
              <button
                className="btn btn-primary"
                id="btnNext"
                onClick={this.btnNextClick}
              >
                {" "}
                Next{" "}
              </button>
            </li>
          )}
        </ul>
      </>
    );
  }

  render() {
    let contents = this.state.loading ? <Loading /> : this.renderInternshipsData();

    return <div>{contents}</div>;
  }
}

export default withRouter(Internships);
