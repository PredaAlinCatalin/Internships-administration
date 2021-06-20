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
} from "../Anonymous/internshipsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getFormattedDateNoTime } from "../Utility/Utility";
import { v4 as uuidv4 } from "uuid";
import {InternshipStatus} from '../Constants';

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

  const handleInternshipStatusChange = async (internship, internshipStatus) => {
    if (internship.status !== internshipStatus) {
      let modifiedInternship = { ...internship };
      modifiedInternship.status = internshipStatus;
      try {
        setUpdateRequestStatus("pending");
        const resultAction = await dispatch(updateInternship(modifiedInternship));
        unwrapResult(resultAction);
      } catch (error) {
      } finally {
        setUpdateRequestStatus("idle");
      }
    }
    }
    

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
      if (internships[i].companyId === company.id && internships[i].status === internshipStatus || internshipStatus === "all") nr++;
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
                        <th className="col-3">Stagiu</th>
                        <th className="col-1">Data creării</th>
                        <th className="col-1">Status</th>
                        <th className="col-7">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.map((internship, index) => (
                        <>
                          {internship.companyId === company.id && (internshipStatus === "all" ||
                            (internshipStatus === InternshipStatus.approved &&
                              internship.status === InternshipStatus.approved) ||
                            (internshipStatus === InternshipStatus.pending &&
                              internship.status === InternshipStatus.pending) ||
                            (internshipStatus === InternshipStatus.refused &&
                              internship.status === InternshipStatus.refused) ||
                            (internshipStatus === InternshipStatus.closed &&
                              internship.status === InternshipStatus.closed)) && (
                            <tr key={internship.id} className="d-flex">
                              {
                                <>
                                  <td className="col-3">
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

                                  <td className="col-1">
                                    <span style={{ fontSize: 14 }}>
                                      {getFormattedDateNoTime(internship.creationDate)}
                                    </span>
                                  </td>

                                  <td className="col-1">
                                    <span style={{ fontSize: 14 }}>
                                      {internship.status}
                                    </span>
                                  </td>

                                  <td className="col-7">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      className="btn btn-primary mt-2"
                                      onClick={() =>
                                        handleManageApplications(internship.id)
                                      }
                                    >
                                      Candidări
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
                                      Modifică
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
                                      Șterge
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      className="btn btn-danger mt-2"
                                      onClick={() => handleInternshipStatusChange(internship, InternshipStatus.closed)}
                                    >
                                      Închide
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      className="btn btn-primary mt-2"
                                      onClick={() => handleInternshipStatusChange(internship, InternshipStatus.pending)}
                                    >
                                      Deschide
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      className="btn btn-primary mt-2"
                                      onClick={() => handleInternshipStatusChange(internship, InternshipStatus.approved)}
                                    >
                                      Aprobă
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      className="btn btn-danger mt-2"
                                      onClick={() => handleInternshipStatusChange(internship, InternshipStatus.refused)}
                                    >
                                      Refuză
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
          {internshipStatus === "all" && "Nu există niciun stagiu la această companie"}
          {internshipStatus === "pending" && "Nu există niciun stagiu în așteptare"}
          {internshipStatus === "approved" && "Nu există niciun stagiu aprobat"}
          {internshipStatus === "refused" && "Nu există niciun stagiu refuzat"}
          {internshipStatus === "closed" && "Nu există niciun stagiu închis"}
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default withRouter(CompanyInternships);
