import React, { useState, useEffect } from "react";
import { Link, withRouter, Redirect, useLocation, useHistory } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import $ from "jquery";
import Loading from "../Universal/Loading";
import { Modal } from "react-bootstrap";
import InternshipCard from "./InternshipCard";
import "./Internships.css";
import InternshipCardMe from "./InternshipCardMe";
import qs from "qs";
import { Button } from "@material-ui/core";

const Internships = () => {
  const [value, setValue] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 10;
  const [upperPageBound, setUpperPageBound] = useState(3);
  const [lowerPageBound, setLowerPageBound] = useState(0);
  const [isPrevBtnActive, setIsPrevBtnActive] = useState("disabled");
  const [isNextBtnActive, setIsNextBtnActive] = useState("");
  const pageBound = 3;
  const [currentInternships, setCurrentInternships] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    async function populateInternshipsData() {
      const navNumber =
        sessionStorage.getItem("navnumber") !== null
          ? sessionStorage.getItem("navnumber")
          : 0;
      setValue(navNumber);

      let search = location.search;
      search = search.substring(1);
      let searchJSON = qs.parse(search);
      console.log(search);
      if (search !== "") {
        setCurrentCategory(searchJSON.category);
        setCurrentCity(searchJSON.city);
        setCurrentSearch(searchJSON.searchString);
        setCurrentSearchInput(searchJSON.searchString);
      } else {
        setCurrentCategory("");
        setCurrentCity("");
        setCurrentSearch("");
        setCurrentSearchInput("");
      }

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

      let citiesData = [];
      await fetch("api/cities")
        .then((res) => res.json())
        .then((data) => {
          citiesData = data;
        });

      setCompanies(companiesData);
      setInternships(internshipsData);
      setCities(citiesData);
      setCategories(categoriesData);
      setLoading(false);

      const indexOfLastInternship = currentPage * internshipsPerPage;
      const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
      const currentInternshipsData = internshipsData.slice(
        indexOfFirstInternship,
        indexOfLastInternship
      );

      const pageNumbersData = [];
      for (let i = 1; i <= Math.ceil(internshipsData.length / internshipsPerPage); i++) {
        pageNumbersData.push(i);
      }

      setCurrentInternships(currentInternshipsData);
      setPageNumbers(pageNumbersData);
      setSubmitted(false);
      // $("ul li.active").removeClass("active");
      // $("ul li#" + currentPage).addClass("active");
    }
    populateInternshipsData();
  }, [submitted]);

  const handleClick = (event) => {
    let listid = Number(event.target.id);

    setCurrentPage(listid);
    $("ul li.active").removeClass("active");
    $("ul li#" + listid).addClass("active");
    setPrevAndNextBtnClass(listid);
  };
  const setPrevAndNextBtnClass = (listid) => {
    let totalPage = Math.ceil(internships.length / internshipsPerPage);

    setIsNextBtnActive("disabled");
    setIsPrevBtnActive("disabled");

    if (totalPage === listid && totalPage > 1) {
      setIsPrevBtnActive("");
    } else if (listid === 1 && totalPage > 1) {
      setIsNextBtnActive("");
    } else if (totalPage > 1) {
      setIsNextBtnActive("");
      setIsPrevBtnActive("");
    }

    const indexOfLastInternship = listid * internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
    const currentInternshipsData = internships.slice(
      indexOfFirstInternship,
      indexOfLastInternship
    );

    const pageNumbersData = [];
    const limit = Math.ceil(internships.length / internshipsPerPage);
    for (let i = 1; i <= limit; i++) {
      pageNumbersData.push(i);
    }

    setCurrentInternships(currentInternshipsData);
    setPageNumbers(pageNumbersData);
  };
  const btnIncrementClick = () => {
    setUpperPageBound(upperPageBound + pageBound);
    setLowerPageBound(lowerPageBound + pageBound);

    let listid = upperPageBound + 1;
    setCurrentPage(listid);

    setPrevAndNextBtnClass(listid);
  };
  const btnDecrementClick = () => {
    setUpperPageBound(upperPageBound - pageBound);
    setLowerPageBound(lowerPageBound - pageBound);

    let listid = upperPageBound - pageBound;
    setCurrentPage(listid);
    setPrevAndNextBtnClass(listid);
  };
  const btnPrevClick = () => {
    if ((currentPage - 1) % pageBound === 0) {
      setUpperPageBound(upperPageBound - pageBound);
      setLowerPageBound(lowerPageBound - pageBound);
    }
    let listid = currentPage - 1;
    setCurrentPage(listid);
    setPrevAndNextBtnClass(listid);
  };
  const btnNextClick = () => {
    if (currentPage + 1 > upperPageBound) {
      setUpperPageBound(upperPageBound + pageBound);
      setLowerPageBound(lowerPageBound + pageBound);
    }
    let listid = currentPage + 1;
    setCurrentPage(listid);
    setPrevAndNextBtnClass(listid);
  };

  const handleSelectCompany = (id) => {
    history.push("/company/" + id);
  };

  const handleSelectInternship = (id) => {
    history.push("/internship/" + id);
  };

  const getCompany = (id) => {
    for (let i = 0; i < companies.length; i++)
      if (companies[i].id === id) {
        return companies[i];
      }
  };

  const getCity = (id) => {
    for (let i = 0; i < cities.length; i++) if (cities[i].id === id) return cities[i];
  };

  const handleQuerySubmit = (event) => {
    event.preventDefault();
    if (currentSearchInput !== "" || currentCategory !== "" || currentCity !== "") {
      history.push(
        "/internships/query?searchString=" +
          currentSearchInput +
          "&city=" +
          currentCity +
          "&category=" +
          currentCategory
      );
      setSubmitted(true);
    }
  };

  const handleResetFilters = () => {
    setCurrentSearch("");
    setCurrentCity("");
    setCurrentCategory("");
    setCurrentSearchInput("");
    setSubmitted(true);
    history.push("/internships");
  };

  return !loading ? (
    <>
      <div style={{ width: 300, marginLeft: 15 }}>
        <span
          style={{
            display: "inline",
            whiteSpace: "nowrap",
          }}
        >
          <form style={{ display: "inline" }} onSubmit={handleQuerySubmit}>
            <input
              style={{
                display: "inline",
                whiteSpace: "nowrap",
              }}
              type="text"
              placeholder="Cauta"
              className="form-control"
              name="search"
              value={currentSearchInput}
              onChange={(e) => setCurrentSearchInput(e.target.value)}
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

          {currentCategory !== "" || currentCity !== "" || currentSearch !== "" ? (
            <Button variant="contained" color="secondary" onClick={handleResetFilters}>
              Resetează filtre
            </Button>
          ) : (
            ""
          )}
        </span>
      </div>

      <div className="container">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
          {currentInternships.map((internship, index) => (
            <div className="mb-3 col">
              <div className="card">
                <InternshipCard
                  internshipId={internship.id}
                  companyId={internship.idCompany}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="pagination">
        {isPrevBtnActive === "disabled" && (
          <li className={isPrevBtnActive}>
            <button className="btn btn-primary" disabled id="btnPrev">
              {" "}
              Prev{" "}
            </button>
          </li>
        )}

        {isPrevBtnActive === "" && (
          <li className={isPrevBtnActive}>
            <button className="btn btn-primary" id="btnPrev" onClick={btnPrevClick}>
              {" "}
              Prev{" "}
            </button>
          </li>
        )}

        {lowerPageBound >= 1 && (
          <li className="">
            <button className="btn btn-primary" onClick={btnDecrementClick}>
              {" "}
              &hellip;{" "}
            </button>
          </li>
        )}

        {pageNumbers.map((number, index) => (
          <span key={index}>
            {number === 1 && currentPage === 1 ? (
              <li key={number} className="active" id={number}>
                <button className="btn btn-primary" id={number} onClick={handleClick}>
                  {number}
                </button>
              </li>
            ) : number < upperPageBound + 1 && number > lowerPageBound ? (
              <li key={number} id={number}>
                <button className="btn btn-primary" id={number} onClick={handleClick}>
                  {number}
                </button>
              </li>
            ) : (
              ""
            )}
          </span>
        ))}

        {pageNumbers.length > upperPageBound && (
          <li className="">
            <button className="btn btn-primary" onClick={btnIncrementClick}>
              {" "}
              &hellip;{" "}
            </button>
          </li>
        )}

        {(isNextBtnActive === "disabled" || Math.ceil(internships.length / internshipsPerPage)) ? (
          <li className={isNextBtnActive}>
            <button className="btn btn-primary" disabled id="btnNext">
              {" "}
              Next{" "}
            </button>
          </li>
        )
        :
          <li className={isNextBtnActive}>
          <button className="btn btn-primary" id="btnNext" onClick={btnNextClick}>
            {" "}
            Next{" "}
          </button>
          </li>
      }
      </ul>
    </>
  ) : (
    <Loading />
  );
};

export default Internships;
