import React, { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { withRouter, Link, useHistory } from "react-router-dom";
import Loading from "../Universal/Loading";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import "./CompanyInternships.css";
import Tooltip from "@material-ui/core/Tooltip";
import TabMenuCompany from "./TabMenuCompany";
import {
  fetchInternships,
  selectAllInternships,
  deleteInternship,
  updateInternship,
} from "../internship/internshipsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getFormattedDateNoTime } from "../Utility/Utility";
import { v4 as uuidv4 } from "uuid";

const CompanyInternships = ({ internshipStatus }) => {
  const [company, setCompany] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const internships = useSelector(selectAllInternships);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.internships.status);
  const error = useSelector((state) => state.internships.error);
  const [deleteRequestStatus, setDeleteRequestStatus] = useState("idle");
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle");
  useEffect(() => {
    async function populateCompanyInternshipsData() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      let companyData = "";
      const companyResponse = await fetch("api/companies/" + user.id);
      if (companyResponse.ok) companyData = await companyResponse.json();

      if (status === "idle") dispatch(fetchInternships());

      const citiesResponse = await fetch("api/cities");
      var citiesData = [];
      if (citiesResponse.ok) citiesData = await citiesResponse.json();

      setCompany(companyData);
      setCities(citiesData);
      setLoading(false);
    }

    populateCompanyInternshipsData();
  }, [status, dispatch, internshipStatus]);

  const handleSelectInternship = (id) => {
    history.push("/internship/" + id);
  };

  const handleManageApplications = (id) => {
    history.push("/manageInternshipApplications/" + id);
  };

  const handleModifyInternship = (id) => {
    history.push("/modifyInternship/" + id);
  };

  const handleCreateInternship = () => {
    history.push("/createInternship");
  };

  const handleDeleteInternship = async (id) => {
    try {
      setDeleteRequestStatus("pending");
      const resultAction = await dispatch(deleteInternship(id));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteRequestStatus("idle");
    }
  };

  const handleCloseInternship = async (internship) => {
    let modifiedInternship = { ...internship };
    modifiedInternship.status = "closed";
    try {
      setUpdateRequestStatus("pending");
      const resultAction = await dispatch(updateInternship(modifiedInternship));
      unwrapResult(resultAction);
    } catch (error) {
    } finally {
      setUpdateRequestStatus("idle");
    }
  };

  const getInternshipDescriptionShort = (description, length) => {
    description = description.replaceAll("<br/>", "\n");
    if (description.length > length) return description.substring(0, length) + "...";
    else return description;
  };

  const getCity = (id) => {
    for (let i = 0; i < cities.length; i++) if (cities[i].id === id) return cities[i];
  };

  const getNumberInternshipsByStatus = () => {
    let nr = 0;
    for (let i = 0; i < internships.length; i++)
      if (internships[i].status === internshipStatus || internshipStatus === "all") nr++;
    return nr;
  };

  return !loading ? (
    <>
      <TabMenuCompany />

      {getNumberInternshipsByStatus() > 0 ? (
        <>
          <div>
            <div className="m-3">
              <Paper elevation={3}>
                <div className="container p-3 pb-2">
                  <div className="table-responsive"></div>
                  <table aria-labelledby="tabelLabel" className="table table-hover">
                    <thead>
                      <tr className="d-flex">
                        <th className="col-4">Stagiu</th>
                        <th className="col-2">Data cre??rii</th>
                        <th className="col-1">Status</th>
                        <th className="col-5">Ac??iuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.map((internship, index) => (
                        <>
                          {(internshipStatus === "all" ||
                            (internshipStatus === "approved" &&
                              internship.status === "approved") ||
                            (internshipStatus === "pending" &&
                              internship.status === "pending") ||
                            (internshipStatus === "refused" &&
                              internship.status === "refused") ||
                            (internshipStatus === "closed" &&
                              internship.status === "closed")) && (
                            <tr key={internship.id} className="d-flex">
                              {
                                <>
                                  <td className="col-4">
                                    <Link to={"/internship/" + internship.id}>
                                      <b style={{ fontSize: 18 }}> {internship.name} </b>
                                    </Link>
                                    <br />

                                    <span
                                      style={{
                                        // paddingLeft: 6,
                                        fontSize: 14,
                                      }}
                                    >
                                      {getCity(internship.cityId).name}
                                      <Icon.GeoAltFill />
                                    </span>
                                  </td>

                                  <td className="col-2">
                                    <span style={{ fontSize: 14 }}>
                                      {getFormattedDateNoTime(internship.creationDate)}
                                    </span>
                                  </td>

                                  <td className="col-1">
                                    <span style={{ fontSize: 14 }}>
                                      {internship.status}
                                    </span>
                                  </td>

                                  <td className="col-5">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      className="btn btn-primary mt-2"
                                      onClick={() =>
                                        handleManageApplications(internship.id)
                                      }
                                    >
                                      Candid??ri
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      className="btn btn-primary mt-2"
                                      onClick={() =>
                                        handleModifyInternship(internship.id)
                                      }
                                    >
                                      Modific??
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      className="btn btn-danger mt-2"
                                      onClick={() =>
                                        handleDeleteInternship(internship.id)
                                      }
                                    >
                                      ??terge
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      className="btn btn-danger mt-2"
                                      onClick={() => handleCloseInternship(internship)}
                                    >
                                      ??nchide
                                    </Button>
                                  </td>
                                </>
                              }
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Paper>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted mt-3">
          {internshipStatus === "all" && "Nu exist?? niciun stagiu la aceast?? companie"}
          {internshipStatus === "pending" && "Nu exist?? niciun stagiu ??n a??teptare"}
          {internshipStatus === "approved" && "Nu exist?? niciun stagiu aprobat"}
          {internshipStatus === "refused" && "Nu exist?? niciun stagiu refuzat"}
          {internshipStatus === "closed" && "Nu exist?? niciun stagiu ??nchis"}
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default withRouter(CompanyInternships);
