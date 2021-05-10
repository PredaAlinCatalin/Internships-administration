import React, { useState, useEffect, useContext } from "react";
import { Link, withRouter, Redirect, useLocation, useHistory } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import $ from "jquery";
import Loading from "../Universal/Loading";
import { Modal } from "react-bootstrap";
import InternshipCard from "./InternshipCard";
import "./Internships.css";
import InternshipCardMe from "./InternshipCardMe";
import qs from "qs";
import { Button, Paper } from "@material-ui/core";
import Select from "react-select";
// import FixRequiredSelect from "../Universal/FixRequiredSelect";
import { Tabs, Tab } from "@material-ui/core";
import {
  getCitiesOptions,
  getCategoriesOptions,
  getAptitudesOptions,
} from "../Utility/Utility";
import SearchIcon from "@material-ui/icons/Search";
import { TextField, InputAdornment } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Row } from "react-bootstrap";
import { useIsStudent } from "../Authentication/Authentication";
import NoteIcon from "@material-ui/icons/Note";
import HistoryIcon from "@material-ui/icons/History";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import TabMenu from "../Universal/TabMenu";
const customStyles = {
  control: (base, state) => ({
    ...base,
    "&:hover": { borderColor: "#3f51b5", border: "1px solid black" },
    "&:focus": { borderColor: "#3f51b5", border: "2px solid #3f51b5" },
    border: "1px solid lightgray",
    boxShadow: "none",
  }),
};

function SelectWrapped(props) {
  return <Select props={props} styles={customStyles} />;
}

// const Select = (props) => (
//   <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
// );

const Internships = () => {
  const [value, setValue] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [aptitudes, setAptitudes] = useState([]);
  const [aptitudesOptions, setAptitudesOptions] = useState([]);
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
  const [input, setInput] = useState({
    search: "",
    currentSearch: "",
    city: "",
    currentCity: "",
  });
  const isStudent = useIsStudent();

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
      console.log("Egal cu sir vid", search === "");
      console.log(search);
      console.log(searchJSON);
      if (search !== "") {
        setInput({ ...input, search: searchJSON.searchString });
        setInput({ ...input, currentSearch: searchJSON.searchString });

        if (searchJSON.city !== undefined) {
          setInput({
            ...input,
            city: { value: searchJSON.city, label: searchJSON.city },
          });
          setInput({
            ...input,
            currentCity: { value: searchJSON.city, label: searchJSON.city },
          });
        } else {
          setInput({ ...input, city: "" });
          setInput({ ...input, currentCity: "" });
        }
      } else {
        setInput({ ...input, search: "" });
        setInput({ ...input, currentSearch: "" });
        setInput({ ...input, city: "" });
        setInput({ ...input, currentCity: "" });
      }

      console.log(input);

      const companiesResponse = await fetch("api/companies");
      let companiesData = [];
      if (companiesResponse.ok) companiesData = await companiesResponse.json();

      const internshipsResponse = await fetch("api/internships/?" + search);
      let internshipsData = [];
      if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();
      console.log(internshipsData);

      let citiesData = [];
      let citiesOptionsData = [];
      await fetch("api/cities")
        .then((res) => res.json())
        .then((data) => {
          citiesData = data;
          citiesOptionsData = getCitiesOptions(citiesData);
        });

      setCompanies(companiesData);
      setInternships(internshipsData);
      setCities(citiesData);
      setCitiesOptions(getCitiesOptions(citiesData));
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
      $("ul li.active").removeClass("active");
      $("ul li#" + currentPage).addClass("active");
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
    console.log(input);
    if (input.currentSearch !== "" || input.currentCity.value !== undefined) {
      history.push(
        "/internships/query?searchString=" +
          input.currentSearch +
          "&city=" +
          input.currentCity.value ?? ""
      );
      setSubmitted(true);
    }
  };

  const handleResetFilters = () => {
    setInput({
      search: "",
      currentSearch: "",
      city: "",
      currentCity: "",
    });
    setSubmitted(true);
    history.push("/internships");
  };

  return !loading ? (
    <>
      <br />
      {isStudent && <TabMenu />}

      <div className="m-3">
        <Paper style={{ width: "100%" }}>
          <form onSubmit={handleQuerySubmit}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-3 m-2 mt-lg-4 mb-lg-4">
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    label="Căutare"
                    type="text"
                    // style={{ width: 450 }}
                    value={input.currentSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) =>
                      setInput({ ...input, currentSearch: e.target.value })
                    }
                  />
                </div>
                <div className="col-lg-3 m-2 mt-lg-4 mb-lg-4">
                  <Select
                    placeholder="Selectează oraș"
                    value={input.currentCity}
                    options={citiesOptions}
                    onChange={(event) => setInput({ ...input, currentCity: event })}
                    isSearchable
                    required
                    styles={customStyles}
                  />
                </div>
                <div className="col-lg-4 mt-lg-4 mb-lg-4">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="mr-lg-2"
                  >
                    Caută
                  </Button>
                  {input.search !== "" || input.city !== "" ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleResetFilters}
                    >
                      Resetează filtre
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </form>
        </Paper>
      </div>

      <br />
      <div className="container">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
          {currentInternships.map((internship, index) => (
            <div className="mb-3 col">
              <div className="card">
                <InternshipCard
                  internshipId={internship.id}
                  companyId={internship.companyId}
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

        {isNextBtnActive === "disabled" ||
        Math.ceil(internships.length / internshipsPerPage) ? (
          <li className={isNextBtnActive}>
            <button className="btn btn-primary" disabled id="btnNext">
              {" "}
              Next{" "}
            </button>
          </li>
        ) : (
          <li className={isNextBtnActive}>
            <button className="btn btn-primary" id="btnNext" onClick={btnNextClick}>
              {" "}
              Next{" "}
            </button>
          </li>
        )}
      </ul>
    </>
  ) : (
    <Loading />
  );
};

export default Internships;
