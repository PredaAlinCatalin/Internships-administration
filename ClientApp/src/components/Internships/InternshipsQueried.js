import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import $ from "jquery";
import Loading from "../Universal/Loading";
import { Modal } from "react-bootstrap";
import InternshipCard from "./InternshipCard";
import "./Internships.css";
import InternshipCardMe from "./InternshipCardMe";
import qs from "qs";
import Button from "@material-ui/core/Button";

class InternshipsQueried extends Component {
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
      currentCategory: "",
      currentSearch: "",
      currentCity: "",
      currentPage: 1,
      internshipsPerPage: 15,
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
    console.log(this.props.location);
    let search = this.props.location.search;
    console.log(search);
    let searchJSON = qs.parse(search);
    console.log(searchJSON);
    if (search !== "") {
      this.setState({
        currentCategory: searchJSON.category,
        currentCity: searchJSON.city,
        currentSearch: searchJSON["?searchString"],
      });
    }

    const companiesResponse = await fetch("api/companies");
    let companiesData = [];
    if (companiesResponse.ok) companiesData = await companiesResponse.json();

    const internshipsResponse = await fetch("api/internships/" + search);
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

  getCompany = (id) => {
    for (let i = 0; i < this.state.companies.length; i++)
      if (this.state.companies[i].id === id) {
        return this.state.companies[i];
      }
  };

  getCity = (id) => {
    for (let i = 0; i < this.state.cities.length; i++)
      if (this.state.cities[i].id === id) return this.state.cities[i];
  };

  renderInternshipsData() {
    return (
      <>
        <h3>
          {this.state.currentInternships.length}
          {this.state.length === 1 ? "stagiu" : "stagii"} {this.state.currentSearch}{" "}
          {this.state.currentCategory} {this.state.currentCity}
        </h3>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.props.history.push("/internships")}
        >
          Resetează filtrarea
        </Button>

        <div className="container">
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
            {this.state.currentInternships.map((internship, index) => (
              <div className="mb-3 col">
                <div className="card">
                  <InternshipCard
                    internshipData={internship}
                    companyData={this.getCompany(internship.idCompany)}
                  />
                  {/* <div>
              </div> */}
                </div>
              </div>
            ))}
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

export default withRouter(InternshipsQueried);
